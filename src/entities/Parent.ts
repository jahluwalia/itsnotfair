import { Scene, Physics, GameObjects } from 'phaser';

export type ParentState = 'PATROL' | 'ALERT' | 'CHASE' | 'RETURNING';

export interface PatrolPoint {
  x: number;
  y: number;
  wait?: number; // Optional wait time at this point in ms
}

export class Parent {
  public sprite: Physics.Arcade.Sprite;
  private scene: Scene;
  private state: ParentState = 'PATROL';
  private patrolPath: PatrolPoint[];
  private currentPatrolIndex: number = 0;
  private patrolSpeed: number = 60;
  private chaseSpeed: number = 120;
  private detectionRange: number = 150;
  private visionCone!: GameObjects.Graphics;
  private visionAngle: number = 45; // Degrees on each side
  private catchPhrase: string;
  private alertIcon?: GameObjects.Text;
  private isWaiting: boolean = false;
  private facingDirection: number = 0; // Angle in radians
  private lastPlayerPosition?: { x: number; y: number };
  
  constructor(
    scene: Scene,
    x: number,
    y: number,
    patrolPath: PatrolPoint[],
    catchPhrase: string = "Got you!"
  ) {
    this.scene = scene;
    this.patrolPath = patrolPath.length > 0 ? patrolPath : [{ x, y }];
    this.catchPhrase = catchPhrase;
    
    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'parent');
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setSize(30, 50);
    this.sprite.setOffset(5, 3);
    
    // Create vision cone graphic
    this.createVisionCone();
    
    // Start patrolling
    this.moveToNextPatrolPoint();
  }
  
  private createVisionCone(): void {
    this.visionCone = this.scene.add.graphics();
    this.visionCone.setDepth(5); // Below sprites but above floor
  }
  
  update(playerPosition: { x: number; y: number }): void {
    // Update vision cone position
    this.updateVisionCone();
    
    // Check for player detection
    if (this.state !== 'CHASE' && this.canSeePlayer(playerPosition)) {
      this.startChase(playerPosition);
    }
    
    // Update based on current state
    switch (this.state) {
      case 'PATROL':
        this.updatePatrol();
        break;
      case 'ALERT':
        this.updateAlert();
        break;
      case 'CHASE':
        this.updateChase(playerPosition);
        break;
      case 'RETURNING':
        this.updateReturning();
        break;
    }
    
    // Update facing direction based on velocity
    if (this.sprite.body && this.sprite.body.velocity.length() > 0) {
      this.facingDirection = Math.atan2(
        this.sprite.body.velocity.y,
        this.sprite.body.velocity.x
      );
      
      // Flip sprite based on direction
      this.sprite.setFlipX(this.sprite.body.velocity.x < 0);
    }
  }
  
  private updateVisionCone(): void {
    this.visionCone.clear();
    
    if (this.state === 'CHASE') {
      // Wider vision during chase
      this.visionCone.fillStyle(0xff0000, 0.3);
    } else if (this.state === 'ALERT') {
      // Yellow vision when alert
      this.visionCone.fillStyle(0xffff00, 0.3);
    } else {
      // Normal vision
      this.visionCone.fillStyle(0xffffff, 0.2);
    }
    
    // Draw vision cone as a triangle
    const range = this.state === 'CHASE' ? this.detectionRange * 1.5 : this.detectionRange;
    const angleRad = (this.visionAngle * Math.PI) / 180;
    
    this.visionCone.beginPath();
    this.visionCone.moveTo(this.sprite.x, this.sprite.y);
    
    // Calculate cone points
    const leftAngle = this.facingDirection - angleRad;
    const rightAngle = this.facingDirection + angleRad;
    
    const leftX = this.sprite.x + Math.cos(leftAngle) * range;
    const leftY = this.sprite.y + Math.sin(leftAngle) * range;
    
    this.visionCone.lineTo(leftX, leftY);
    this.visionCone.arc(
      this.sprite.x,
      this.sprite.y,
      range,
      leftAngle,
      rightAngle,
      false
    );
    this.visionCone.lineTo(this.sprite.x, this.sprite.y);
    this.visionCone.closePath();
    this.visionCone.fill();
  }
  
  private canSeePlayer(playerPosition: { x: number; y: number }): boolean {
    // Calculate distance
    const dx = playerPosition.x - this.sprite.x;
    const dy = playerPosition.y - this.sprite.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    // Check if within range
    const range = this.state === 'CHASE' ? this.detectionRange * 1.5 : this.detectionRange;
    if (distance > range) return false;
    
    // Check if within vision angle
    const angleToPlayer = Math.atan2(dy, dx);
    let angleDiff = Math.abs(angleToPlayer - this.facingDirection);
    
    // Normalize angle difference to [-PI, PI]
    if (angleDiff > Math.PI) {
      angleDiff = 2 * Math.PI - angleDiff;
    }
    
    const visionAngleRad = (this.visionAngle * Math.PI) / 180;
    return angleDiff <= visionAngleRad;
  }
  
  private updatePatrol(): void {
    if (this.isWaiting) return;
    
    const target = this.patrolPath[this.currentPatrolIndex];
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      target.x,
      target.y
    );
    
    if (distance < 10) {
      // Reached patrol point
      this.sprite.setVelocity(0, 0);
      
      if (target.wait && target.wait > 0) {
        this.isWaiting = true;
        this.scene.time.delayedCall(target.wait, () => {
          this.isWaiting = false;
          this.moveToNextPatrolPoint();
        });
      } else {
        this.moveToNextPatrolPoint();
      }
    }
  }
  
  private moveToNextPatrolPoint(): void {
    this.currentPatrolIndex = (this.currentPatrolIndex + 1) % this.patrolPath.length;
    const target = this.patrolPath[this.currentPatrolIndex];
    
    // Move towards target
    this.scene.physics.moveToObject(this.sprite, target, this.patrolSpeed);
  }
  
  private startChase(playerPosition: { x: number; y: number }): void {
    this.state = 'CHASE';
    this.lastPlayerPosition = { ...playerPosition };
    
    // Show alert icon
    this.showAlert('!', 0xff0000);
    
    // Stop current movement
    this.sprite.setVelocity(0, 0);
  }
  
  private updateAlert(): void {
    // Alert state is transitional, move to chase or return to patrol
    this.scene.time.delayedCall(500, () => {
      if (this.lastPlayerPosition) {
        this.state = 'CHASE';
      } else {
        this.state = 'PATROL';
        this.moveToNextPatrolPoint();
      }
    });
  }
  
  private updateChase(playerPosition: { x: number; y: number }): void {
    // Can we still see the player?
    if (this.canSeePlayer(playerPosition)) {
      // Update last known position
      this.lastPlayerPosition = { ...playerPosition };
      
      // Chase the player
      this.scene.physics.moveToObject(this.sprite, playerPosition, this.chaseSpeed);
    } else {
      // Lost sight of player
      if (this.lastPlayerPosition) {
        // Move to last known position
        const distance = Phaser.Math.Distance.Between(
          this.sprite.x,
          this.sprite.y,
          this.lastPlayerPosition.x,
          this.lastPlayerPosition.y
        );
        
        if (distance < 20) {
          // Reached last known position, look around then return
          this.lookAround();
        } else {
          // Keep moving to last known position
          this.scene.physics.moveToObject(
            this.sprite,
            this.lastPlayerPosition,
            this.patrolSpeed
          );
        }
      } else {
        // No last position, return to patrol
        this.startReturning();
      }
    }
  }
  
  private lookAround(): void {
    this.sprite.setVelocity(0, 0);
    this.showAlert('?', 0xffff00);
    
    // Rotate to look around
    let rotations = 0;
    const rotateTimer = this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        this.facingDirection += Math.PI / 2;
        rotations++;
        
        if (rotations >= 4) {
          rotateTimer.destroy();
          this.startReturning();
        }
      },
      repeat: 3,
    });
  }
  
  private startReturning(): void {
    this.state = 'RETURNING';
    this.lastPlayerPosition = undefined;
    this.hideAlert();
    
    // Find nearest patrol point
    let nearestIndex = 0;
    let nearestDistance = Infinity;
    
    this.patrolPath.forEach((point, index) => {
      const distance = Phaser.Math.Distance.Between(
        this.sprite.x,
        this.sprite.y,
        point.x,
        point.y
      );
      
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = index;
      }
    });
    
    this.currentPatrolIndex = nearestIndex;
    this.moveToNextPatrolPoint();
  }
  
  private updateReturning(): void {
    const target = this.patrolPath[this.currentPatrolIndex];
    const distance = Phaser.Math.Distance.Between(
      this.sprite.x,
      this.sprite.y,
      target.x,
      target.y
    );
    
    if (distance < 10) {
      // Back to patrol route
      this.state = 'PATROL';
      this.moveToNextPatrolPoint();
    }
  }
  
  private showAlert(text: string, color: number): void {
    this.hideAlert();
    
    this.alertIcon = this.scene.add.text(
      this.sprite.x,
      this.sprite.y - 40,
      text,
      {
        fontSize: '24px',
        fontFamily: 'Arial Black',
        color: `#${color.toString(16).padStart(6, '0')}`,
        stroke: '#000000',
        strokeThickness: 4,
      }
    );
    
    // Animate the alert
    this.scene.tweens.add({
      targets: this.alertIcon,
      y: this.sprite.y - 50,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 300,
      ease: 'Back.easeOut',
    });
  }
  
  private hideAlert(): void {
    if (this.alertIcon) {
      this.alertIcon.destroy();
      this.alertIcon = undefined;
    }
  }
  
  public getCatchPhrase(): string {
    return this.catchPhrase;
  }
  
  public getState(): ParentState {
    return this.state;
  }
  
  public reset(): void {
    this.state = 'PATROL';
    this.currentPatrolIndex = 0;
    this.lastPlayerPosition = undefined;
    this.hideAlert();
    this.sprite.setVelocity(0, 0);
    
    // Move to first patrol point
    if (this.patrolPath.length > 0) {
      this.sprite.setPosition(this.patrolPath[0].x, this.patrolPath[0].y);
      this.moveToNextPatrolPoint();
    }
  }
  
  public destroy(): void {
    this.hideAlert();
    this.visionCone.destroy();
    this.sprite.destroy();
  }
}