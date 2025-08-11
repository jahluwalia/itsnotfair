### **Sibling Stealth Platformer**—Feature Deep-Dive  
*(Working title: **“Because I Said So!”*)*  

---

#### 1. Core Gameplay Loop  
| Phase | What the Player Does | Comedy Angle |
|-------|----------------------|--------------|
| **Scout** | Pan the camera, mark patrol paths of Mom, Dad, the dog, Roomba-with-a-baby-monitor, etc. | Dad hums off-key ’80s rock; Roomba mutters AI-style comments about unionizing. |
| **Sneak & Snag** | Control Sister (agile) **or** Brother (brainy) to collect “Fairness Tokens” (extra screen time, dessert coupons, stay-up-late passes). | Token art is absurd (e.g., “Lifetime Ice-Cream Voucher” the size of a door). |
| **Co-op Twist** | Switch between kids or play couch-co-op. Some vents are only Sister-small; Brother can hack the “Smart Fridge.” | Banter buttons: press Y for instant sibling sarcasm (“Nice stealth, ninja-nerd!”). |
| **Escape** | Reach the bedroom fort before Parents’ “Ground-o-Meter” fills. | If caught, a mock lecture appears with random “Dad Jokes” you must button-mash to skip. |

---

#### 2. Level Progression (5-World Arc)  
| World | Setting | Signature Gag | New Mechanic |
|-------|---------|---------------|--------------|
| **1. Bedtime Blitz** | Upstairs hallway, creaky floors, motion-sensor night-lights. | Parents inexplicably teleport to check “one last thing.” | Crouch-&-roll under the night-light cone. |
| **2. Snack-Heist Kitchen** | Alarmed fridge, laser-grid pantry. | The fridge voice assistant nags in a polite British accent. | Brother’s “Code-Breaker” minigame (Simon Says). |
| **3. Backyard Breakout** | Lawn sprinklers, barking dog, garden gnome cameras. | Sprinklers fire in emoji shapes 🌭🍕 to taunt hunger. | Sister gets a double-jump via pogo stick. |
| **4. Mall Mayhem** | Parents drag kids shopping; mission is to sneak toys into cart. | Store intercom mispronounces Dad’s name repeatedly. | Crowd-blend mechanic (hide in mannequin poses). |
| **5. Grand Finale: Vacation Vexation** | Airport / hotel; curfew vs. pool time. | “Random” TSA stops only target the kids’ inflatables. | Tag-team stealth: both siblings on-screen at once tethered by pool noodle. |

---

#### 3. Fair-versus-Funny Systems  
| System | Fairness Lesson | Humor Delivery |
|--------|-----------------|----------------|
| **Rule-Change Events** | Halfway through a level, Mom updates chores list (“New policy: 2 tokens per chore!”). Kids must pivot. | On-screen sticky note slaps down with a loud “THWOP!” |
| **Unfair RNG** | Occasionally a token spawns right behind a parent—impossible to grab safely. | Siblings grumble in comic-strip speech bubbles (“Rigged, I tell ya!”). |
| **“Because I Said So” Meter** | When caught, meter spikes; repeated unfair moments lower kids’ **Patience Bar**. They win by keeping patience ≥ 0. | Narrator voice reads ridiculous parental logic (“Because… quantum physics!”). |

---

#### 4. Character Kits  
| Kid | Abilities | Quirky Animation |
|-----|-----------|------------------|
| **Sister (Kavi?)** | Wall-slide, duct-crawl, balloon decoy that looks like her. | Eye-roll idle animation; floss-dance when she grabs a token. |
| **Brother (Niro?)** | Hack household IoT, carry heavy objects to boost Sister to vents. | Pushes glasses up when thinking; victory pose is a full jazz-hands flourish. |

---

#### 5. Comedy FX Library  
- **SFX:** creak that yells “CREEEEAK!” in text form, Dad-sneeze sonic boom, dog snore that shifts parents’ patrol routes.  
- **Catch-Phrases:** Unlockable audio packs (e.g., “Mom’s Corporate Email Mode”— robotic scolding).  
- **Fail Screen:** “Grounded until further notice… OR until the heat death of the universe—whichever comes first.” *Retry?*  

---

#### 6. Macro Progression & Replay  
| Hook | Implementation |
|------|----------------|
| **Sticker Album** | Each unfair scenario awards a satirical sticker (“Participation Trophy Trophy”). Collect them to unlock concept art. |
| **Difficulty Skews** | “Parent Alertness” slider: on **Chaos Mode**, parents drink espresso mid-patrol and run. |
| **Daily Challenge** | Random house layouts; global leaderboard titled “Most Groundings Dodged.” |

---

#### 7. Infrastructure Snapshot (No-Code Yet)  
| Component | Choice | Why |
|-----------|--------|-----|
| **Engine** | Phaser 3 (JS) or Godot-to-Web | Both export to HTML5; easy couch-co-op via same keyboard/controller. |
| **Hosting** | Cloudflare Pages or Vercel (static) | Zero-backend unless you add leaderboards; fast global edge. |
| **Leaderboards** | Supabase Edge Functions | Lightweight Postgres sync; row-level security for kids. |
| **Art Pipeline** | Aseprite + Spine (2D rigging) | Small file sizes; smooth cartoon animation. |

---

### Next Decisions
1. **Choose art style** (storybook vs. Saturday-morning cartoon).  
2. **Lock controls** (single-player character-swap or simultaneous two-player).  
3. **Define MVP scope**—suggest Worlds 1-2 playable with core systems, ship as early demo.  

When you’re ready, we can outline deliverables (design doc, asset list, sprint plan) and map the exact infra steps (DNS, CI/CD, SSL). Let the unfair fun begin!