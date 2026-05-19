// SCREEN REFERENCES
const welcomeScreen = document.getElementById("welcome-screen");

const gameScreen = document.getElementById("game-screen");

const successScreen = document.getElementById("success-screen");

// BUTTONS
const startBtn = document.getElementById("start-btn");

const playBtn = document.getElementById("play-btn");

const patientBtn = document.getElementById("patient-btn");

const angryBtn = document.getElementById("angry-btn");

const giveupBtn = document.getElementById("giveup-btn");

const popup = document.getElementById("instruction-popup");

const bridge = document.getElementById("bridge");

const character = document.getElementById("character");

const meanComment = document.getElementById("mean-comment");

const brickTray = document.getElementById("brick-tray");  

// GAME DATA

const comments = [
  "Go Away!",
  "Too Small!",
  "No One Likes You!",
  "You Can't Do It!",
  "Why Try?",
  "It's Impossible!",
  "You're Not Good Enough!"
];

const positiveWords = [
  "Hope",
  "Patience",
  "Smile",
  "Kindness",
  "Courage",
  "Trust",
  "Joy"
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

// GAME STATE

let progress = 0;
const bridgeGoal = 7;
let gameCompleted = false;

// ── CHARACTER MOVEMENT 
// Total horizontal distance the character walks across the bridge.
// Adjust this value to match how wide your bridge grows in CSS.
const TOTAL_WALK_PX = 336; // 7 bricks × ~48px each

function moveCharacter() {
  const targetX = (progress / bridgeGoal) * TOTAL_WALK_PX;
  gsap.to(character, {
    x: targetX,
    duration: 0.45,
    ease: "power2.out"
  });
}


function showScreen(screenEl) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screenEl.classList.add("active");
}

// START GAME
startBtn.addEventListener("click", () => {
  showScreen(gameScreen);
  popup.classList.add("active-popup");
  renderBrickTray();
  updateComment();
});

// CLOSE POPUP
playBtn.addEventListener("click", () => {
  popup.classList.remove("active-popup");
});

// PATIENT BUTTON (CORRECT)

patientBtn.addEventListener("click", () => {

  if (gameCompleted) return;
  if (progress >= bridgeGoal) return;
  createBrick();
  progress++;
  updateProgress();
  moveCharacter(); // move forward
  happyBounce();
  if (progress < bridgeGoal) {
    updateComment();
  }
  if (progress === bridgeGoal) {
    gameCompleted = true;
    meanComment.innerText = "You Did It!";
    walkCharacter();
  }
});

// WRONG BUTTONS

angryBtn.addEventListener("click", wrongChoice);
giveupBtn.addEventListener("click", wrongChoice);

// WRONG CHOICE LOGIC

function wrongChoice() {
  if (gameCompleted) return;
  if (progress === 0) {
    meanComment.innerText = "Think rationally. Try staying patient.";
    sadBounce();
    setTimeout(() => {
      updateComment();
    }, 1800);
    return;
  }
  breakBrick();

  progress--;

  updateProgress();
  moveCharacter(); // step back
  sadBounce();

  updateComment();
}

// CREATE BRICK

// CREATE BRICK — slides up from below into its pre-rendered slot position

function createBrick() {

  const trayBrick =
    document.querySelector(
      `.tray-brick[data-index="${progress}"]`
    );

  if (!trayBrick) return;

  const trayRect =
    trayBrick.getBoundingClientRect();

  // create moving clone
  const flyingBrick =
    trayBrick.cloneNode(true);

  document.body.appendChild(flyingBrick);

  flyingBrick.style.position = "fixed";
  flyingBrick.style.left =
    `${trayRect.left}px`;

  flyingBrick.style.top =
    `${trayRect.top}px`;

  flyingBrick.style.zIndex = "999";
  flyingBrick.style.margin = "0";

  // hide original brick
  trayBrick.style.visibility = "hidden";

  // create target bridge brick
  const bridgeBrick =
    document.createElement("div");

  bridgeBrick.classList.add("brick");

  bridgeBrick.innerText =
    positiveWords[progress];

  bridgeBrick.style.background =
    brickColors[progress];

  bridgeBrick.style.opacity = "0";

  bridge.appendChild(bridgeBrick);

  const bridgeRect =
    bridgeBrick.getBoundingClientRect();

  // animate tray → slot
  gsap.to(flyingBrick, {
    left: bridgeRect.left,
    top: bridgeRect.top,
    scale: 1.05,
    duration: 0.75,
    ease: "power3.out",

    onComplete: () => {

      bridgeBrick.style.opacity = "1";

      flyingBrick.remove();

      gsap.fromTo(
        bridgeBrick,
        {
          scale: 0.7
        },
        {
          scale: 1,
          duration: 0.25,
          ease: "back.out(2)"
        }
      );
    }
  });
}

function renderBrickTray() {

  brickTray.innerHTML = "";

  positiveWords.forEach((word, index) => {

    const brick = document.createElement("div");

    brick.classList.add("tray-brick");

    brick.innerText = word;

    brick.style.background = brickColors[index];

    brick.dataset.index = index;

    brickTray.appendChild(brick);
  });
}

function updateComment() {
  const randomComment = comments[Math.floor(Math.random() * comments.length)];
  meanComment.innerText = randomComment;
}
 
function updateProgress() {
  const fill = document.getElementById("progress-fill");
  const percent = (progress / bridgeGoal) * 100;
  fill.style.width = `${percent}%`;
}
 
// CHARACTER ANIMATIONS
 
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
 
// WALK TO HOUSE
 
function walkCharacter() {
 
  patientBtn.disabled = true;
  angryBtn.disabled = true;
  giveupBtn.disabled = true;
 
  const house = document.querySelector(".house");
  const characterRect = character.getBoundingClientRect();
  const houseRect = house.getBoundingClientRect();
 
  const moveDistance = houseRect.left - characterRect.left - 120;
 
  gsap.killTweensOf(character);
  gsap.set(character, { rotation: 0 });
 
  gsap.to(character, {
    x: moveDistance,
    duration: 3,
    ease: "power1.inOut",
 
    onUpdate: () => {
      gsap.to(character, {
        y: -4,
        duration: 0.15,
        repeat: 1,
        yoyo: true
      });
    },
 
    onComplete: () => {
      meanComment.innerText = "Great job!";
      setTimeout(() => {
        showScreen(successScreen);
      }, 800);
    }
  });
}
 
