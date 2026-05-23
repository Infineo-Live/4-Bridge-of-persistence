# Bridge of Persistence — Game Flow Architecture

## Game Objective
Help **Ganesha cross a broken path** by choosing **positive actions** when faced with mean comments. The game teaches **patience, resilience, and persistence**.

---

# Screen 1 — Welcome + Moral Message

## Purpose
Introduce the story and moral lesson.

## Flow

```txt
Open Game
    ↓
Welcome Screen
    ↓
Read the question
    ↓
Click "Start Journey"
    ↓
Go to Game Screen
```

## Screen Content

### Visuals
- Cute Boy
- Soft temple/path background
- Warm pastel environment

### Message
Sometimes people say unkind things.

But Ganesha teaches us to stay patient and keep trying.

### Moral
> “Patience helps us move forward.”

### CTA
**Start Journey**

---

# Screen 2 — Main Game

## Purpose
Player helps Ganesha build a bridge using positive values.

## Game Start

### Instruction Popup

```txt
How to Play

People may say unkind things,
but we do not stop.

Choose the best action
to help Ganesha move forward.

Correct choices build the bridge!
```

**Button:** Begin Game

---

## Main Gameplay Flow

```txt
Show Mean Comment
        ↓
Ask:
"What should Ganesha do?"
        ↓
Player selects from 3 buttons
        ↓
Correct?
     /      \
   YES       NO
    ↓         ↓
Build Brick  Friendly Feedback
    ↓         ↓
Bridge Full? Retry
   /    \
 NO      YES
 ↓         ↓
Next Round Ganesha Walks
               ↓
       Success Screen
```

---

## Gameplay Elements

### Character
**Ganesha** standing before a broken path.

### Obstacle
A **gap in the bridge** with a mean comment.

Examples:
- “Go Away!”
- “Too Small!”
- “No Time!”

### 3 Choice Buttons

#### Positive Choice (Correct)
**Stay Patient**

#### Negative Choice (Wrong)
**Get Angry**

#### Negative Choice (Wrong)
**Give Up**

---

## Correct Answer Flow

```txt
Player clicks:
"Stay Patient"
        ↓
Positive value brick added
        ↓
Bridge grows
        ↓
Encouraging feedback shown
```

### Brick Values
Each success adds one value brick:

- Hope
- Patience
- Smile

After enough bricks:

```txt
Bridge Completed
        ↓
Ganesha walks across
        ↓
Move to Success Screen
```

---

## Wrong Answer Flow

If player chooses:

- Get Angry
- Give Up

Show kind feedback:

```txt
That may not help us move forward.
Try again!
```

Player retries the same round.

No punishment.

---

# Screen 3 — Success + Moral Reinforcement

## Purpose
Celebrate success and reinforce learning.

## Flow

```txt
Ganesha crosses bridge
        ↓
Celebration screen appears
        ↓
Great Job message
        ↓
Moral reinforced
        ↓
Play Again option
```

## Screen Content

### Celebration
- Happy Ganesha
- Stars / confetti
- Success animation

### Message

**Great Job!**

You helped Ganesha stay patient and move forward.

### Moral Learned

> “When people are unkind, we stay patient and keep trying.”

### Values Used

```txt
Hope • Patience • Smile
```

### CTA
**Play Again**

---

# Complete Game Journey

```txt
Screen 1
Welcome + Moral
        ↓
Screen 2
Instructions
        ↓
Choose Positive Actions
        ↓
Build Bridge
        ↓
Ganesha Walks
        ↓
Screen 3
Great Job + Moral Learned
```