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


function showScreen(screenEl) {
  document.querySelectorAll(".screen").forEach(s => s.classList.remove("active"));
  screenEl.classList.add("active");
}

// START GAME

startBtn.addEventListener("click", () => {
  showScreen(gameScreen);

  popup.classList.add("active-popup");

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

  sadBounce();

  updateComment();
}

// CREATE BRICK

function createBrick() {

  const brick = document.createElement("div");
  brick.classList.add("brick");
  brick.innerText = positiveWords[progress];
  brick.style.background = brickColors[progress];

  bridge.appendChild(brick);

  gsap.fromTo(
    brick,
    { scale: 0, opacity: 0 },
    { scale: 1, opacity: 1, duration: 0.35, ease: "back.out(2)" }
  );
}

// BREAK LAST BRICK

function breakBrick() {

  const bricks = document.querySelectorAll(".brick");
  const lastBrick = bricks[bricks.length - 1];

  if (!lastBrick) return;

  gsap.to(lastBrick, {
    y: 50,
    opacity: 0,
    rotation: 20,
    duration: 0.4,
    onComplete: () => {
      lastBrick.remove();
    }
  });
}

// UPDATE COMMENT

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