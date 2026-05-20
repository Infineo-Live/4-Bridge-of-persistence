// ─── SCREEN REFERENCES ───────────────────────────────────────────────────────
const welcomeScreen = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const successScreen = document.getElementById("success-screen");

// ─── AUDIO ───────────────────────────────────────────────────────────────────
const bgMusic = document.getElementById("bg-music");

// ─── BUTTONS ─────────────────────────────────────────────────────────────────
const gameContent = document.getElementById("game-content");
const startBtn = document.getElementById("start-btn");
const playBtn = document.getElementById("play-btn");
const choice1Btn = document.getElementById("choice-1-btn");
const choice2Btn = document.getElementById("choice-2-btn");
const choice3Btn = document.getElementById("choice-3-btn");

// ─── ELEMENTS ────────────────────────────────────────────────────────────────
const popup = document.getElementById("instruction-popup");
const bridge = document.getElementById("bridge");
const character = document.getElementById("character");
const brickTray = document.getElementById("brick-tray");
const villagerImg = document.getElementById("villager-img");
const encounterText = document.getElementById("mean-comment");
const villager = document.getElementById("villager");
const speechBubble = document.getElementById("speech-bubble");

// ─── GAME DATA ────────────────────────────────────────────────────────────────
const encounters = [
  {
    villager: "assets/uncle.png",
    comment: "You cannot make kheer\nwith so little rice!",
    choices: ["😞 Maybe I should stop", "😊 I will still try", "😠 Be rude back"],
    correct: 1,
    value: "Hope",
    color: "#3498db"
  },
  {
    villager: "assets/cruel-kid.png",
    comment: "Nobody will like\nyour kheer!",
    choices: ["😔 Feel bad", "🌟 I will do my best", "😡 Argue"],
    correct: 1,
    value: "Patience",
    color: "#2ecc71"
  },
  {
    villager: "assets/cruel-uncle.png",
    comment: "You are too small\nto cook!",
    choices: ["😊 I can still learn", "😞 Walk away", "😠 Get angry"],
    correct: 0,
    value: "Smile",
    color: "#f39c12"
  },
  {
    villager: "assets/lady.png",
    comment: "This will\nnever work!",
    choices: ["😡 Shout back", "😊 Keep going", "😞 Give up"],
    correct: 1,
    value: "Kindness",
    color: "#e91e63"
  },
  {
    villager: "assets/uncle-with-stick.png",
    comment: "Why are you\neven trying?",
    choices: ["🌟 I believe in myself", "😔 Stop trying", "😠 Fight"],
    correct: 0,
    value: "Courage",
    color: "#9b59b6"
  },
  {
    villager: "assets/cruel-kid.png",
    comment: "You will\nfail anyway!",
    choices: ["😔 Feel upset", "😊 I will continue", "😡 Yell back"],
    correct: 1,
    value: "Trust",
    color: "#1abc9c"
  },
  {
    villager: "assets/rude-girl.png",
    comment: "Impossible!\nYou can't do it!",
    choices: ["🌟 I will keep trying", "😞 Quit", "😠 Get angry"],
    correct: 0,
    value: "Joy",
    color: "#f1c40f"
  }
];

// ─── GAME STATE ───────────────────────────────────────────────────────────────
let progress = 0;
let gameCompleted = false;
let characterX = 0;   // tracks cumulative GSAP x offset on #character
const bridgeGoal = encounters.length;

// ─── SCREEN SWITCH ────────────────────────────────────────────────────────────
function showScreen(screenEl) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
    s.style.display = "none";
  });
  screenEl.classList.add("active");
  screenEl.style.display = "";
}

// ─── START GAME ───────────────────────────────────────────────────────────────
startBtn.addEventListener("click", () => {
  showScreen(gameScreen);
  popup.classList.add("active-popup");
  gameContent.classList.remove("show-game");
  gameContent.classList.add("hidden-game");
});

// ─── CLOSE POPUP & BEGIN ──────────────────────────────────────────────────────
playBtn.addEventListener("click", () => {
  // Animate popup out
  gsap.to(popup, {
    scale: 0.88, opacity: 0, duration: 0.28, ease: "back.in(1.4)",
    onComplete: () => {
      popup.classList.remove("active-popup");
      gsap.set(popup, { scale: 1, opacity: 1 }); // reset for potential reuse

      gameContent.classList.remove("hidden-game");
      gameContent.classList.add("show-game");

      renderBrickTray();
      loadEncounter();
      updateProgress();

      bgMusic.volume = 0.35;
      bgMusic.play().catch(() => { });

      // Staggered reveal: UI elements fade in one by one
      gsap.fromTo("#game-content",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      );
    }
  });
});

// ─── LOAD ENCOUNTER ───────────────────────────────────────────────────────────
function loadEncounter() {
  const current = encounters[progress];
  if (!current) return;

  // Update text & buttons
  encounterText.innerText = current.comment;
  choice1Btn.innerText = current.choices[0];
  choice2Btn.innerText = current.choices[1];
  choice3Btn.innerText = current.choices[2];

  // Swap villager image smoothly
  gsap.to(villagerImg, {
    opacity: 0, duration: 0.15, onComplete: () => {
      villagerImg.src = current.villager;
      gsap.to(villagerImg, { opacity: 1, duration: 0.15 });
    }
  });

  // Villager entrance: slides in from the right
  gsap.set(villager, { x: 180, opacity: 0, scale: 0.85 });
  gsap.set(speechBubble, { opacity: 0, x: 20 });

  const tl = gsap.timeline();
  tl.to(villager, {
    x: 0, opacity: 1, scale: 1,
    duration: 0.55, ease: "back.out(1.6)"
  });
  tl.to(speechBubble, {
    opacity: 1, x: 0,
    duration: 0.3, ease: "power2.out"
  }, "-=0.15");

  // Stagger button entrance
  gsap.fromTo([choice1Btn, choice2Btn, choice3Btn],
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out", delay: 0.3 }
  );
}

// ─── BUTTON EVENTS ────────────────────────────────────────────────────────────
choice1Btn.addEventListener("click", () => handleChoice(0));
choice2Btn.addEventListener("click", () => handleChoice(1));
choice3Btn.addEventListener("click", () => handleChoice(2));

// ─── HANDLE CHOICE ────────────────────────────────────────────────────────────
function handleChoice(choiceIndex) {
  if (gameCompleted) return;
  const current = encounters[progress];
  if (choiceIndex === current.correct) {
    correctChoice(choiceIndex);
  } else {
    wrongChoice(choiceIndex);
  }
}

// ─── CORRECT CHOICE ───────────────────────────────────────────────────────────
function correctChoice(choiceIdx) {
  disableChoices(true);

  // Flash the correct button green
  const btns = [choice1Btn, choice2Btn, choice3Btn];
  gsap.to(btns[choiceIdx], {
    background: "linear-gradient(160deg,#56d364,#2ea043)",
    scale: 1.06, duration: 0.18, yoyo: true, repeat: 1
  });

  spawnFloatingWord("✨ " + encounters[progress].value + "!", btns[choiceIdx]);

  const tl = gsap.timeline();

  // Villager laughs then runs away (exit right, he came from right)
  tl.to(villager, { rotation: -6, duration: 0.08, yoyo: true, repeat: 3, ease: "none" }, 0);
  tl.to(speechBubble, { opacity: 0, x: -10, duration: 0.25 }, 0.1);
  tl.to(villager, { x: 200, opacity: 0, duration: 0.45, ease: "power2.in" }, 0.35);

  // Build bridge & step forward
  tl.call(() => {
    const slotIdx = progress;
    createBrick(slotIdx);
    progress++;
    updateProgress();
    moveCharacter(slotIdx);
    happyBounce();
  });

  tl.to({}, { duration: 0.85 }); // wait for brick fly animation

  // Fade buttons out before next encounter loads
  tl.to([choice1Btn, choice2Btn, choice3Btn], { opacity: 0, y: 8, duration: 0.2 }, "-=0.3");

  tl.call(() => {
    if (progress >= bridgeGoal) {
      gameCompleted = true;
      walkCharacter();
      return;
    }
    loadEncounter();
    disableChoices(false);
  });
}

// ─── WRONG CHOICE ─────────────────────────────────────────────────────────────
function wrongChoice(choiceIdx) {
  disableChoices(true);

  const btns = [choice1Btn, choice2Btn, choice3Btn];

  // Flash wrong button red
  gsap.to(btns[choiceIdx], {
    background: "linear-gradient(160deg,#f85149,#b91c1c)",
    scale: 0.94, duration: 0.12, yoyo: true, repeat: 1
  });

  sadBounce();

  const tl = gsap.timeline();

  // Villager laughs (shakes in place)
  tl.to(villager, { rotation: -8, duration: 0.07, yoyo: true, repeat: 7, ease: "none" });

  // Bubble pulses
  tl.to(speechBubble, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 }, 0);

  // Buttons shake
  tl.to(".action-buttons", { x: -9, duration: 0.06, yoyo: true, repeat: 5, ease: "none" }, 0);

  // Update bubble text
  tl.call(() => {
    gsap.to(speechBubble, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
    encounterText.innerText = "Try again!\nStay positive 💛";
  });

  tl.to({}, { duration: 1.1 });

  tl.call(() => {
    encounterText.innerText = encounters[progress].comment;
    disableChoices(false);
    gsap.to(btns[choiceIdx], { clearProps: "background" });
  });
}

// ─── DISABLE / ENABLE CHOICES ─────────────────────────────────────────────────
function disableChoices(disabled) {
  choice1Btn.disabled = disabled;
  choice2Btn.disabled = disabled;
  choice3Btn.disabled = disabled;
}

// ─── MOVE CHARACTER ───────────────────────────────────────────────────────────
// Moves the boy to stand centered on the slot just filled.
function moveCharacter(slotIndex) {
  const slots = document.querySelectorAll(".brick-slot");
  const slot = slots[slotIndex];
  if (!slot) return;

  const slotRect = slot.getBoundingClientRect();
  const charRect = character.getBoundingClientRect();

  // Target: horizontally center boy over the slot
  const targetX = (slotRect.left + slotRect.width / 2) - (charRect.left + charRect.width / 2);

  // Walking bounce while moving
  const bounceTween = gsap.to(character, {
    y: -8, duration: 0.15, repeat: -1, yoyo: true, ease: "power1.inOut", paused: true
  });

  gsap.to(character, {
    x: `+=${targetX}`,
    duration: 0.55,
    ease: "power2.out",
    onStart: () => bounceTween.play(),
    onComplete: () => {
      bounceTween.kill();
      gsap.set(character, { y: 0 });
      characterX += targetX; // track running offset
    }
  });
}

// ─── CREATE BRICK ─────────────────────────────────────────────────────────────
// Brick flies from tray position into the bridge slot.
function createBrick(slotIndex) {
  const trayBrick = document.querySelector(`.tray-brick[data-index="${slotIndex}"]`);
  if (!trayBrick) return;

  const trayRect = trayBrick.getBoundingClientRect();

  // Flying clone
  const flyingBrick = trayBrick.cloneNode(true);
  document.body.appendChild(flyingBrick);
  Object.assign(flyingBrick.style, {
    position: "fixed",
    left: `${trayRect.left}px`,
    top: `${trayRect.top}px`,
    width: `${trayRect.width}px`,
    height: `${trayRect.height}px`,
    zIndex: "9998",
    margin: "0",
    pointerEvents: "none"
  });

  // Hide source
  gsap.to(trayBrick, { scale: 0.7, opacity: 0.4, duration: 0.2 });

  // Place real brick in slot (invisible until landing)
  const slot = document.querySelectorAll(".brick-slot")[slotIndex];
  const bridgeBrick = document.createElement("div");
  bridgeBrick.classList.add("brick");
  bridgeBrick.innerText = encounters[slotIndex].value;
  bridgeBrick.style.background = `url('assets/rock.png') center/cover no-repeat`;
  bridgeBrick.style.color = "#fff";
  bridgeBrick.style.textShadow = "0 1px 4px rgba(0,0,0,0.7)"; bridgeBrick.style.opacity = "0";
  slot.appendChild(bridgeBrick);

  // Force layout recalc
  void bridgeBrick.offsetWidth;
  const bridgeRect = bridgeBrick.getBoundingClientRect();

  // Arc flight: go slightly up then land
  gsap.to(flyingBrick, {
    left: bridgeRect.left,
    top: bridgeRect.top,
    width: bridgeRect.width,
    height: bridgeRect.height,
    duration: 0.65,
    ease: "power3.out",
    onComplete: () => {
      flyingBrick.remove();
      bridgeBrick.style.opacity = "1";
      // Pop-in animation
      gsap.fromTo(bridgeBrick,
        { scale: 0.5, rotation: -8 },
        { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.2)" }
      );
      // Small screen shake for satisfying feel
      gsap.fromTo(".bridge-container",
        { y: -3 },
        { y: 0, duration: 0.18, ease: "power2.out" }
      );
    }
  });
}

// ─── BRICK TRAY ───────────────────────────────────────────────────────────────
function renderBrickTray() {
  brickTray.innerHTML = "";
  encounters.forEach((enc, i) => {
    const brick = document.createElement("div");
    brick.classList.add("tray-brick");
    brick.innerText = enc.value;
    brick.style.background = `url('assets/rock.png') center/cover no-repeat`;
    brick.style.color = "#fff";
    brick.style.textShadow = "0 1px 4px rgba(0,0,0,0.7)"; brick.dataset.index = i;
    brickTray.appendChild(brick);
  });

  // Stagger entrance animation for tray bricks
  gsap.fromTo(".tray-brick",
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, stagger: 0.07, ease: "back.out(1.8)", delay: 0.2 }
  );
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
function updateProgress() {
  document.getElementById("progress-fill").style.width =
    `${(progress / bridgeGoal) * 100}%`;
}

// ─── CHARACTER ANIMATIONS ─────────────────────────────────────────────────────
function happyBounce() {
  gsap.fromTo(character,
    { y: 0, rotation: 0 },
    { y: -16, rotation: 5, duration: 0.18, yoyo: true, repeat: 1, ease: "power2.out" }
  );
}

function sadBounce() {
  gsap.fromTo(character,
    { rotation: 0 },
    { rotation: -12, duration: 0.12, yoyo: true, repeat: 4, ease: "power2.inOut" }
  );
}

// ─── WALK TO HOUSE (win state) ────────────────────────────────────────────────
function walkCharacter() {
  disableChoices(true);

  gsap.to(".brick-tray",     { opacity: 0, y: 10, duration: 0.3 });
  gsap.to(".action-buttons", { opacity: 0, y: 10, duration: 0.3 });

  const house      = document.querySelector(".house");
  const charRect   = character.getBoundingClientRect();
  const houseRect  = house.getBoundingClientRect();
  const moveDistance = houseRect.left - charRect.left - charRect.width * 0.6;

  const bounceTween = gsap.to(character, {
    y: -7, duration: 0.16, repeat: -1, yoyo: true,
    ease: "power1.inOut", paused: true
  });

  const tl = gsap.timeline();

  // Walk to house
  tl.to(character, {
    x: `+=${moveDistance}`,
    duration: 2.2,
    ease: "power1.inOut",
    onStart:    () => bounceTween.play(),
    onComplete: () => {
      bounceTween.kill();
      gsap.set(character, { y: 0 });
    }
  });

  // Swap to celebrate asset
  tl.call(() => {
    const boyImg = document.getElementById("boy-img");
    boyImg.src = "assets/celebrating-boy.png"; // your celebrating asset
  });

  // Celebration animation — bounce + scale pop
  tl.fromTo(character,
    { scale: 1,    y: 0 },
    { scale: 1.15, y: -20, duration: 0.3, ease: "back.out(2)", yoyo: true, repeat: 3 }
  );

  // Transition to success screen
  tl.call(() => {
    gsap.to(gameScreen, {
      opacity: 0, duration: 0.7, ease: "power2.in",
      onComplete: () => {
        gsap.set(gameScreen, { opacity: 1 });
        showScreen(successScreen);
      }
    });
  }, null, "+=0.4");
}

// ─── FLOATING WORD PARTICLE ───────────────────────────────────────────────────
function spawnFloatingWord(text, anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  const el = document.createElement("div");
  el.classList.add("floating-word");
  el.innerText = text;
  el.style.left = `${rect.left + rect.width / 2 - 60}px`;
  el.style.top = `${rect.top}px`;
  el.style.color = "#fff";
  el.style.textShadow = "0 2px 8px rgba(255,180,0,0.7)";
  document.body.appendChild(el);

  gsap.fromTo(el,
    { opacity: 1, y: 0, scale: 0.8 },
    {
      opacity: 0, y: -70, scale: 1.2, duration: 1.2, ease: "power2.out",
      onComplete: () => el.remove()
    }
  );
}