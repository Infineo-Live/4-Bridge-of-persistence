// ==========================
// SCREEN REFERENCES
// ==========================

const welcomeScreen = document.getElementById("welcome-screen");

const gameScreen = document.getElementById("game-screen");

const successScreen = document.getElementById("success-screen");

// ==========================
// BUTTONS
// ==========================

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

const villagerImg = document.getElementById("villager-img")

const encounterText = document.getElementById("mean-comment");

const villager = document.getElementById("villager");

const speechBubble = document.getElementById("speech-bubble");

// GAME DATA

const encounters = [
  {
    villager: "assets/uncle.png",
    comment: "You cannot make kheer with so little rice!",
    choices: [
      "😞 Maybe I should stop",
      "😊 I will still try",
      "😠 Be rude back"
    ],
    correct: 1,
    value: "Hope"
  },
  {
    villager: "assets/cruel-kid.png",
    comment: "Nobody will like your kheer!",
    choices: [
      "😔 Feel bad",
      "🌟 I will do my best",
      "😡 Argue"
    ],
    correct: 1,
    value: "Patience"
  },
  {
    villager: "assets/cruel-uncle.png",
    comment: "You are too small to cook!",
    choices: [
      "😊 I can still learn",
      "😞 Walk away",
      "😠 Get angry"
    ],
    correct: 0,
    value: "Smile"
  },
  {
    villager: "assets/lady.png",
    comment: "This will never work!",
    choices: [
      "😡 Shout back",
      "😊 Keep going",
      "😞 Give up"
    ],
    correct: 1,
    value: "Kindness"
  },
  {
    villager: "assets/uncle-with-stick.png",
    comment: "Why are you even trying?",
    choices: [
      "🌟 I believe in myself",
      "😔 Stop trying",
      "😠 Fight"
    ],
    correct: 0,
    value: "Courage"
  },
  {
    villager: "assets/cruel-kid.png",
    comment: "You will fail anyway!",
    choices: [
      "😔 Feel upset",
      "😊 I will continue",
      "😡 Yell back"
    ],
    correct: 1,
    value: "Trust"
  },
  {
    villager: "assets/rude-girl.png",
    comment: "Impossible! You can't do it!",
    choices: [
      "🌟 I will keep trying",
      "😞 Quit",
      "😠 Get angry"
    ],
    correct: 0,
    value: "Joy"
  }
];

const brickColors = [
  "#3498db",
  "#2ecc71",
  "#f39c12",
  "#e91e63",
  "#9b59b6",
  "#1abc9c",
  "#f1c40f"
];

// ==========================
// GAME STATE
// ==========================

let progress = 0;
let gameCompleted = false;

const bridgeGoal = encounters.length;

// ==========================
// SCREEN SWITCH
// ==========================

function showScreen(screenEl) {
  document
    .querySelectorAll(".screen")
    .forEach(screen => screen.classList.remove("active"));

  screenEl.classList.add("active");
}

// ==========================
// START GAME
// ==========================

startBtn.addEventListener("click", () => {
  showScreen(gameScreen);
  popup.classList.add("active-popup");
  renderBrickTray();
  loadEncounter();
});

// ==========================
// CLOSE POPUP
// ==========================

playBtn.addEventListener("click", () => {
  popup.classList.remove("active-popup");
});

// ==========================
// LOAD ENCOUNTER
// — defined only once, with entrance animation
// ==========================

function loadEncounter() {
  const current = encounters[progress];
  if (!current) return;

  // Preload villager image before animating in
  const img = new Image();
  img.src = current.villager;
  img.onload = () => {
    villagerImg.src = current.villager;
  };

  encounterText.innerText = current.comment;
  choice1Btn.innerText = current.choices[0];
  choice2Btn.innerText = current.choices[1];
  choice3Btn.innerText = current.choices[2];

  // Reset position off-screen right before animating in
  gsap.set(villager, { x: 500, opacity: 0, scale: 0.9 });
  gsap.set(speechBubble, { opacity: 0, y: 20 });

  const tl = gsap.timeline();

  tl.to(villager, {
    x: 0,
    opacity: 1,
    scale: 1,
    duration: 0.65,
    ease: "back.out(1.8)"
  });

  tl.to(speechBubble, {
    opacity: 1,
    y: 0,
    duration: 0.35
  }, "-=0.2");
}

// ==========================
// BUTTON EVENTS
// ==========================

choice1Btn.addEventListener("click", () => handleChoice(0));
choice2Btn.addEventListener("click", () => handleChoice(1));
choice3Btn.addEventListener("click", () => handleChoice(2));

// ==========================
// HANDLE CHOICE
// ==========================

function handleChoice(choiceIndex) {
  if (gameCompleted) return;

  const current = encounters[progress];

  if (choiceIndex === current.correct) {
    correctChoice();
  } else {
    wrongChoice();
  }
}

// ==========================
// CORRECT CHOICE
// ==========================

function correctChoice() {

  disableChoices(true);

  const tl = gsap.timeline();

  // villager exits
  tl.to(villager, {
    x: 450,
    opacity: 0,
    duration: 0.5,
    ease: "power2.in"
  });

  tl.to(speechBubble, {
    opacity: 0,
    duration: 0.25
  }, "<");

  // build bridge
  tl.call(() => {

    createBrick();

    progress++;

    updateProgress();

    moveCharacter();

    happyBounce();

  });

  // wait for brick animation
  tl.to({}, {
    duration: 0.9
  });

  // next encounter
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
// ==========================
// WRONG CHOICE
// ==========================

function wrongChoice() {

  disableChoices(true);

  sadBounce();

  const tl = gsap.timeline();

  // villager laughs
  tl.fromTo(
    villager,
    {
      rotation: -5
    },
    {
      rotation: 5,
      repeat: 5,
      yoyo: true,
      duration: 0.07
    }
  );

  // bubble pulse
  tl.fromTo(
    speechBubble,
    {
      scale: 1
    },
    {
      scale: 1.08,
      duration: 0.12,
      repeat: 1,
      yoyo: true
    },
    0
  );

  // buttons shake
  tl.fromTo(
    ".action-buttons",
    {
      x: 0
    },
    {
      x: -8,
      repeat: 5,
      yoyo: true,
      duration: 0.05
    },
    0
  );

  // boy encouragement
  tl.call(() => {

    encounterText.innerText =
      "Try again. Stay positive 💛";

  });

  tl.to({}, { duration: 1 });

  tl.call(() => {

    encounterText.innerText =
      encounters[progress].comment;

    disableChoices(false);

  });
}
// ==========================
// DISABLE / ENABLE CHOICES
// ==========================

function disableChoices(disabled) {
  choice1Btn.disabled = disabled;
  choice2Btn.disabled = disabled;
  choice3Btn.disabled = disabled;
}

// ==========================
// MOVE CHARACTER
// ==========================

function moveCharacter() {

  const slots =
    document.querySelectorAll(".brick-slot");

  if (!slots[progress - 1]) return;

  const targetSlot =
    slots[progress - 1];

  const slotRect =
    targetSlot.getBoundingClientRect();

  const characterRect =
    character.getBoundingClientRect();

  // move character to center of slot
  const targetX =
    slotRect.left -
    characterRect.left +
    (slotRect.width / 2) -
    30;

  gsap.to(character, {
    x: `+=${targetX}`,
    duration: 0.45,
    ease: "power2.out"
  });
}

// ==========================
// CREATE BRICK
// — flies from tray slot into bridge position
// ==========================

function createBrick() {
  const trayBrick = document.querySelector(
    `.tray-brick[data-index="${progress}"]`
  );

  if (!trayBrick) return;

  const trayRect = trayBrick.getBoundingClientRect();

  // Clone the tray brick to fly it across the screen
  const flyingBrick = trayBrick.cloneNode(true);
  document.body.appendChild(flyingBrick);

  flyingBrick.style.position = "fixed";
  flyingBrick.style.left = `${trayRect.left}px`;
  flyingBrick.style.top = `${trayRect.top}px`;
  flyingBrick.style.zIndex = "999";
  flyingBrick.style.margin = "0";

  // Hide the source tray brick
  trayBrick.style.visibility = "hidden";

  // Create the real bridge brick (invisible until fly-in completes)
  const bridgeBrick = document.createElement("div");
  bridgeBrick.classList.add("brick");
  bridgeBrick.innerText = encounters[progress].value;
  bridgeBrick.style.background = brickColors[progress];
  bridgeBrick.style.opacity = "0";
  const slot =
    document.querySelectorAll(".brick-slot")[progress];

  slot.appendChild(bridgeBrick);
  // Force layout so getBoundingClientRect is accurate
  const bridgeRect = bridgeBrick.getBoundingClientRect();

  // Fly the clone from tray → bridge slot
  gsap.to(flyingBrick, {
    left: bridgeRect.left,
    top: bridgeRect.top,
    duration: 0.75,
    ease: "power3.out",

    onComplete: () => {
      // Reveal real brick and pop it in
      bridgeBrick.style.opacity = "1";
      flyingBrick.remove();

      gsap.fromTo(
        bridgeBrick,
        { scale: 0.7 },
        { scale: 1, duration: 0.25, ease: "back.out(2)" }
      );
    }
  });
}

// ==========================
// BRICK TRAY
// ==========================

function renderBrickTray() {
  brickTray.innerHTML = "";

  encounters.forEach((encounter, index) => {
    const brick = document.createElement("div");
    brick.classList.add("tray-brick");
    brick.innerText = encounter.value;
    brick.style.background = brickColors[index];
    brick.dataset.index = index;
    brickTray.appendChild(brick);
  });
}

// ==========================
// PROGRESS BAR
// ==========================

function updateProgress() {
  const fill = document.getElementById("progress-fill");
  fill.style.width = `${(progress / bridgeGoal) * 100}%`;
}

// ==========================
// CHARACTER ANIMATIONS
// ==========================

function happyBounce() {
  gsap.fromTo(
    character,
    { y: 0 },
    { y: -12, duration: 0.18, repeat: 1, yoyo: true }
  );
}

function sadBounce() {
  gsap.fromTo(
    character,
    { rotation: 0 },
    { rotation: -10, duration: 0.15, repeat: 3, yoyo: true }
  );
}

// ==========================
// WALK TO HOUSE (win state)
// ==========================

function walkCharacter() {

  disableChoices(true);

  const house =
    document.querySelector(".house");

  const characterRect =
    character.getBoundingClientRect();

  const houseRect =
    house.getBoundingClientRect();

  const moveDistance =
    houseRect.left -
    characterRect.left -
    90;

  // walking bounce animation
  const bounceTween =
    gsap.to(character, {
      y: -6,
      duration: 0.18,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
      paused: true
    });

  gsap.to(character, {

    x: `+=${moveDistance}`,

    duration: 2.5,
    ease: "power1.inOut",

    onStart: () => {
      bounceTween.play();
    },

    onComplete: () => {

      // STOP bouncing
      bounceTween.kill();

      // reset feet to ground
      gsap.set(character, {
        y: 0
      });

      // tiny happy finish bounce
      gsap.fromTo(
        character,
        { scale: 1 },
        {
          scale: 1.08,
          duration: 0.18,
          repeat: 1,
          yoyo: true
        }
      );

      setTimeout(() => {
        showScreen(successScreen);
      }, 700);
    }
  });
}