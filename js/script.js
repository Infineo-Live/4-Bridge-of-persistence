// SCREEN REFERENCES 
const welcomeScreen  = document.getElementById("welcome-screen");
const gameScreen = document.getElementById("game-screen");
const successScreen = document.getElementById("success-screen");

// AUDIO 
const bgMusic = document.getElementById("bg-music");
const clickSound = document.getElementById("click-audio");
const correctSound = document.getElementById("correct-audio");
const wrongSound = document.getElementById("wrong-audio");
const yaySound = document.getElementById("yay-audio");
const woodenSound = document.getElementById("wood-audio");

// BUTTONS 
const gameContent = document.getElementById("game-content");
const startBtn = document.getElementById("start-btn");
const playBtn = document.getElementById("play-btn");
const choice1Btn = document.getElementById("choice-1-btn");
const choice2Btn = document.getElementById("choice-2-btn");
const choice3Btn = document.getElementById("choice-3-btn");

// ELEMENTS 
const popup = document.getElementById("instruction-popup");
const bridge = document.getElementById("bridge");
const character = document.getElementById("character");
const brickTray = document.getElementById("brick-tray");
const villagerImg = document.getElementById("villager-img");
const encounterText = document.getElementById("mean-comment");
const villager = document.getElementById("villager");
const speechBubble = document.getElementById("speech-bubble");

// GAME DATA 
const encounters = [
  {
    villager: "assets/uncle.webp",
    comment: "You cannot achieve that!",
    choices: ["😞 Maybe I should stop", "😊 I will still try", "😠 Be rude back"],
    correct: 1,
    value: "Hope",
    color: "#3498db"
  },
  {
    villager: "assets/cruel-boy.webp",
    comment: "Nobody will like this!",
    choices: ["😔 Feel bad", "🌟 I will do my best", "😡 Argue"],
    correct: 1,
    value: "Patience",
    color: "#2ecc71"
  },
  {
    villager: "assets/cruel-uncle.webp",
    comment: "You are too young!",
    choices: ["😊 I can still learn", "😞 Walk away", "😠 Get angry"],
    correct: 0,
    value: "Smile",
    color: "#f39c12"
  },
  {
    villager: "assets/lady.webp",
    comment: "This will never work!",
    choices: ["😡 Shout back", "😊 Keep going", "😞 Give up"],
    correct: 1,
    value: "Kindness",
    color: "#e91e63"
  },
  {
    villager: "assets/uncle-with-stick.webp",
    comment: "Why are you\neven trying?",
    choices: ["🌟 I believe in myself", "😔 Stop trying", "😠 Fight"],
    correct: 0,
    value: "Courage",
    color: "#9b59b6"
  },
  {
    villager: "assets/rude-uncle.webp",
    comment: "You will\nfail anyway!",
    choices: ["😔 Feel upset", "😊 I will continue", "😡 Yell back"],
    correct: 1,
    value: "Trust",
    color: "#1abc9c"
  },
  {
    villager: "assets/rude-girl.webp",
    comment: "Impossible!\nYou can't do it!",
    choices: ["🌟 I will keep trying", "😞 Quit", "😠 Get angry"],
    correct: 0,
    value: "Joy",
    color: "#f1c40f"
  }
];

// GAME STATE
let progress = 0;
let gameCompleted = false;
const bridgeGoal = encounters.length;

// SCREEN SWITCH 
// FIX: explicitly set display:flex so flex screens are restored correctly
function showScreen(screenEl) {
  document.querySelectorAll(".screen").forEach(s => {
    s.classList.remove("active");
    s.style.display = "none";
  });
  screenEl.style.display = "flex";
  screenEl.classList.add("active");
}

//  START GAME 
startBtn.addEventListener("click", () => {
  playSound(clickSound, 0.5);
  showScreen(gameScreen);
  popup.classList.add("active-popup");
  gameContent.classList.remove("show-game");
  gameContent.classList.add("hidden-game");
});

//  CLOSE POPUP & BEGIN 
playBtn.addEventListener("click", () => {
   playSound(clickSound, 0.5);
  gsap.to(popup, {
    scale: 0.88, opacity: 0, duration: 0.28, ease: "back.in(1.4)",
    onComplete: () => {
      popup.classList.remove("active-popup");
      gsap.set(popup, { scale: 1, opacity: 1 });

      gameContent.classList.remove("hidden-game");
      gameContent.classList.add("show-game");

      renderBrickTray();
      loadEncounter();
      updateProgress();

      bgMusic.volume = 0.35;
      bgMusic.play().catch(() => {});

      gsap.fromTo("#game-content",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }
      );
    }
  });
});

//  LOAD ENCOUNTER 
function loadEncounter() {
  const current = encounters[progress];
  if (!current) return;
  encounterText.innerText = current.comment;
  choice1Btn.innerText = current.choices[0];
  choice2Btn.innerText = current.choices[1];
  choice3Btn.innerText = current.choices[2];
  // FIX: reset button backgrounds properly before every encounter
  [choice1Btn, choice2Btn, choice3Btn].forEach(b => {
    gsap.set(b, { clearProps: "background,scale,opacity,y" });
    b.style.background = "";
  });
  gsap.to(villagerImg, {
    opacity: 0, duration: 0.15, onComplete: () => {
      villagerImg.src = current.villager;
      gsap.to(villagerImg, { opacity: 1, duration: 0.15 });
    }
  });

  gsap.set(villager, { x: 180, opacity: 0, scale: 0.85 });
  gsap.set(speechBubble, { opacity: 0, x: 20 });

  const tl = gsap.timeline();
  tl.to(villager, { x: 0, opacity: 1, scale: 1, duration: 0.55, ease: "back.out(1.6)" });
  tl.to(speechBubble, { opacity: 1, x: 0, duration: 0.3, ease: "power2.out" }, "-=0.15");

  gsap.fromTo([choice1Btn, choice2Btn, choice3Btn],
    { opacity: 0, y: 14 },
    { opacity: 1, y: 0, duration: 0.35, stagger: 0.08, ease: "power2.out", delay: 0.3 }
  );
}

// BUTTON EVENTS 
choice1Btn.addEventListener("click", () => handleChoice(0));
choice2Btn.addEventListener("click", () => handleChoice(1));
choice3Btn.addEventListener("click", () => handleChoice(2));

// HANDLE CHOICE 
function handleChoice(choiceIndex) {
  if (gameCompleted) return;
  playSound(clickSound, 0.45);
  const current = encounters[progress];
  if (choiceIndex === current.correct) {
    correctChoice(choiceIndex);
  } else {
    wrongChoice(choiceIndex);
  }
}

//  CORRECT CHOICE 
function correctChoice(choiceIdx) {
  disableChoices(true);
  playSound(correctSound, 0.7);
  const btns = [choice1Btn, choice2Btn, choice3Btn];

  // Flash correct btn green
  gsap.to(btns[choiceIdx], {
    background: "linear-gradient(160deg,#56d364,#2ea043)",
    scale: 1.06, duration: 0.18, yoyo: true, repeat: 1
  });

  spawnFloatingWord("✨ " + encounters[progress].value + "!", btns[choiceIdx]);

  const tl = gsap.timeline();

  tl.to(villager, { rotation: -6, duration: 0.08, yoyo: true, repeat: 3, ease: "none" }, 0);
  tl.to(speechBubble, { opacity: 0, x: -10, duration: 0.25 }, 0.1);
  tl.to(villager, { x: 200, opacity: 0, duration: 0.45, ease: "power2.in" }, 0.35);

  tl.call(() => {
    const slotIdx = progress;
    createBrick(slotIdx);
    progress++;
    updateProgress();
    moveCharacter(slotIdx);
    happyBounce();
  });

  tl.to({}, { duration: 0.85 });

  tl.to([choice1Btn, choice2Btn, choice3Btn], { opacity: 0, y: 8, duration: 0.2 }, "-=0.3");

  tl.call(() => {
    // FIX: reset ALL button backgrounds (not just the clicked one)
    btns.forEach(b => {
      b.style.background = "";
      gsap.set(b, { clearProps: "background" });
    });

    if (progress >= bridgeGoal) {
      gameCompleted = true;
      walkCharacter();
      return;
    }
    loadEncounter();
    disableChoices(false);
  });
}

//  WRONG CHOICE 
function wrongChoice(choiceIdx) {
  disableChoices(true);
  playSound(wrongSound, 0.7);
  const btns = [choice1Btn, choice2Btn, choice3Btn];

  gsap.to(btns[choiceIdx], {
    background: "linear-gradient(160deg,#f85149,#b91c1c)",
    scale: 0.94, duration: 0.12, yoyo: true, repeat: 1
  });

  sadBounce();

  const tl = gsap.timeline();
  tl.to(villager, { rotation: -8, duration: 0.07, yoyo: true, repeat: 7, ease: "none" });
  tl.to(speechBubble, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1 }, 0);
  tl.to(".action-buttons", { x: -9, duration: 0.06, yoyo: true, repeat: 5, ease: "none" }, 0);

  tl.call(() => {
    gsap.to(speechBubble, { scale: 0.96, duration: 0.1, yoyo: true, repeat: 1 });
    encounterText.innerText = "Try again!\nStay positive 💛";
  });

  tl.to({}, { duration: 1.1 });

  tl.call(() => {
    encounterText.innerText = encounters[progress].comment;
    // FIX: reset the flashed button's background properly
    btns[choiceIdx].style.background = "";
    gsap.set(btns[choiceIdx], { clearProps: "background,scale" });
    disableChoices(false);
  });
}

//  DISABLE / ENABLE 
function disableChoices(disabled) {
  choice1Btn.disabled = disabled;
  choice2Btn.disabled = disabled;
  choice3Btn.disabled = disabled;
}

//  MOVE CHARACTER 
// FIX: target the brick-slot by index from the bridge directly,
//      since slots get a brick child appended but the slot element remains.
function moveCharacter(slotIndex) {
  const slots = bridge.querySelectorAll(".brick-slot");
  const slot = slots[slotIndex];
  if (!slot) return;
  const slotRect  = slot.getBoundingClientRect();
  const charRect  = character.getBoundingClientRect();
  // Center character over the slot
  const targetX = (slotRect.left + slotRect.width / 2) - (charRect.left + charRect.width / 2);
  const bounceTween = gsap.to(character, {
    y: -8, duration: 0.15, repeat: -1, yoyo: true, ease: "power1.inOut", paused: true
  });
  gsap.to(character, {
    x: `+=${targetX}`,
    duration: 0.55,
    ease: "power2.out",
    onStart:    () => bounceTween.play(),
    onComplete: () => {
      bounceTween.kill();
      gsap.set(character, { y: 0 });
    }
  });
}

//  CREATE BRICK 
// FIX: brick is positioned absolute inside the slot (inset:0) so it
//      fills it without disrupting bridge flex layout.
function createBrick(slotIndex) {
  const trayBrick = document.querySelector(`.tray-brick[data-index="${slotIndex}"]`);
  const slot = bridge.querySelectorAll(".brick-slot")[slotIndex];
  if (!slot) return;

  // Dim tray brick with "used" class
  if (trayBrick) {
    trayBrick.classList.add("used");
  }

  // Flying clone from tray to bridge
  if (trayBrick) {
    const trayRect = trayBrick.getBoundingClientRect();
    const flyingBrick = trayBrick.cloneNode(true);
    flyingBrick.classList.remove("used");
    document.body.appendChild(flyingBrick);
    Object.assign(flyingBrick.style, {
      position:  "fixed",
      left:      `${trayRect.left}px`,
      top:       `${trayRect.top}px`,
      width:     `${trayRect.width}px`,
      height:    `${trayRect.height}px`,
      zIndex:    "9998",
      margin:    "0",
      pointerEvents: "none"
    });

    // Place real (hidden) brick in slot immediately
    const bridgeBrick = document.createElement("div");
    bridgeBrick.classList.add("brick");
    bridgeBrick.innerText = encounters[slotIndex].value;
    bridgeBrick.style.opacity = "0";
    slot.appendChild(bridgeBrick);

    // Force layout
    void bridgeBrick.offsetWidth;
    const bridgeRect = bridgeBrick.getBoundingClientRect();

    gsap.to(flyingBrick, {
      left: bridgeRect.left,
      top:  bridgeRect.top,
      width:  bridgeRect.width,
      height: bridgeRect.height,
      duration: 0.65,
      ease: "power3.out",
      onComplete: () => {
        playSound(woodenSound, 0.8);
        flyingBrick.remove();
        bridgeBrick.style.opacity = "1";
        gsap.fromTo(bridgeBrick,
          { scale: 0.5, rotation: -8 },
          { scale: 1, rotation: 0, duration: 0.3, ease: "back.out(2.2)" }
        );
        gsap.fromTo(".bridge-container",
          { y: -3 },
          { y: 0, duration: 0.18, ease: "power2.out" }
        );
      }
    });
  } else {
    // Fallback: place without animation
    const bridgeBrick = document.createElement("div");
    bridgeBrick.classList.add("brick");
    bridgeBrick.innerText = encounters[slotIndex].value;
    slot.appendChild(bridgeBrick);
  }
}

// BRICK TRAY 
function renderBrickTray() {
  brickTray.innerHTML = "";
  encounters.forEach((enc, i) => {
    const brick = document.createElement("div");
    brick.classList.add("tray-brick");
    brick.innerText = enc.value;
    brick.dataset.index = i;
    brickTray.appendChild(brick);
  });

  gsap.fromTo(".tray-brick",
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.4, stagger: 0.07, ease: "back.out(1.8)", delay: 0.2 }
  );
}

//  PROGRESS BAR (ENHANCED) 
function updateProgress() {
  const pct = (progress / bridgeGoal) * 100;
  document.getElementById("progress-fill").style.width = `${pct}%`;

  // Update counter badge
  const countEl = document.querySelector(".prog-count");
  if (countEl) countEl.textContent = `${progress} / ${bridgeGoal}`;

  // Light up milestone dots
  document.querySelectorAll(".milestone-dot").forEach((dot, i) => {
    dot.classList.toggle("filled", i < progress);
  });
}

//  BUILD PROGRESS UI 
// Inject count badge and milestone dots into the existing markup
function buildProgressUI() {
  const label = document.querySelector(".progress-label");
  if (label) {
    label.innerHTML = `
      <span class="prog-title">Bridge of Persistence</span>
      <span class="prog-count">0 / ${bridgeGoal}</span>
    `;
  }

  // Add milestone dots row below the bar
  const bar = document.querySelector(".progress-bar");
  if (bar && !document.querySelector(".progress-milestones")) {
    const milestonesRow = document.createElement("div");
    milestonesRow.classList.add("progress-milestones");
    for (let i = 0; i < bridgeGoal; i++) {
      const dot = document.createElement("div");
      dot.classList.add("milestone-dot");
      milestonesRow.appendChild(dot);
    }
    bar.parentElement.appendChild(milestonesRow);
  }
}

//  CHARACTER ANIMATIONS 
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

//  WALK TO HOUSE (WIN STATE) 
function walkCharacter() {
  disableChoices(true);

  gsap.to(".brick-tray",     { opacity: 0, y: 10, duration: 0.3 });
  gsap.to(".action-buttons", { opacity: 0, y: 10, duration: 0.3 });

  const houseImg   = document.querySelector(".house img");
  const charRect   = character.getBoundingClientRect();
  const houseRect  = houseImg.getBoundingClientRect();
  const moveDistance = houseRect.left - charRect.left - charRect.width * 0.6;

  const bounceTween = gsap.to(character, {
    y: -7, duration: 0.16, repeat: -1, yoyo: true,
    ease: "power1.inOut", paused: true
  });

  const tl = gsap.timeline();

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

  tl.call(() => {
    const boyImg = document.getElementById("boy-img");
    boyImg.src = "assets/celebrating-boy.webp";
  });

  tl.fromTo(character,
    { scale: 1, y: 0 },
    { scale: 1.15, y: -20, duration: 0.3, ease: "back.out(2)", yoyo: true, repeat: 3 }
  );

  tl.call(() => {
    playSound(yaySound, 0.9);
    gsap.to(gameScreen, {
      opacity: 0, duration: 0.7, ease: "power2.in",
      onComplete: () => {
        gsap.set(gameScreen, { opacity: 1 });
        showScreen(successScreen);
      }
    });
  }, null, "+=0.4");
}

//  FLOATING WORD PARTICLE 
function spawnFloatingWord(text, anchorEl) {
  const rect = anchorEl.getBoundingClientRect();
  const el = document.createElement("div");
  el.classList.add("floating-word");
  el.innerText = text;
  el.style.left = `${rect.left + rect.width / 2 - 60}px`;
  el.style.top  = `${rect.top}px`;
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
function playSound(sound, volume = 1) {
  sound.pause();
  sound.currentTime = 0;
  sound.volume = volume;
  sound.playbackRate = 0.95 + Math.random() * 0.1;
  sound.play().catch(() => {});
}

// Build enhanced progress UI as soon as DOM is ready
buildProgressUI();