'use strict';
// Helper functions
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const render = (sprite, x, y) => ctx.drawImage(Resources.get(sprite), x, y);
const yCenter = (coord) => 83 * (coord - 1/2);
const xCenter = (coord) => coord * 100;
const getScore = (moves, time) => Math.round(moves / time / 2 * 500);

// DOM variables
const modal = document.getElementById('modal');
const scoreDisplay = document.getElementById('modal__score');
const playBtn = document.getElementById('modal__btn');
let score = 0;
let isModalShown = false;

// DOM manipulation
// Updates score at 60 frames per second
const displayScore = score => {
    // 1000 / 60 = 16.66667 (milliseconds per frame)
    const milliPerFrame = 16.66667;
    const duration = 1250;
    const increment = score / (duration / milliPerFrame);
    scoreDisplay.textContent = 0;
    const interval = setInterval(() => {
        let newNum = Math.round(parseInt(scoreDisplay.textContent) + increment)
        newNum = newNum > score ? score : newNum
        scoreDisplay.textContent = newNum
        if (newNum === score) clearInterval(interval)
    }, milliPerFrame);
}

const toggleModal = () => {
    modal.classList.toggle('visible');
    setTimeout(() => displayScore(score), 250);
    isModalShown = !isModalShown;
    if (!isModalShown) score = 0
};

playBtn.addEventListener('click', toggleModal);
modal.addEventListener('click', e => e.target.id === 'modal' ? toggleModal() : null);

// Parent Class;
class PositionedThing {
    constructor(sprite, x, y) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
    }
}

// Enemies our player must avoid
class Enemy extends PositionedThing {
    constructor(
        sprite = 'images/enemy-bug.png',
        x = xCenter(-1),
        y = yCenter(randomInRange(1, 3))
    ) {
        super(sprite, x, y);
        this.speed = randomInRange(300, 600);
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
    
        // Reset enemies
        if (this.x > xCenter(5)) {
            this.x = xCenter(-1);
            this.y = yCenter(randomInRange(1, 3));
            this.speed = randomInRange(300, 600);
        }
    
        // Lose condition
        if (
            this.x < player.x + 40
            && this.x > player.x - 40
            && this.y === player.y
        ) {
            score -= 500;
            const { x, y } = player.initialCoordinates;
            player.update(x, y);
        }
        this.x += this.speed * dt;
    }

    // Draw the enemy on the screen, required method for game
    render() {
        render(this.sprite, this.x, this.y);
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player extends PositionedThing {
    constructor(
        sprite = 'images/char-boy.png',
        x = xCenter(2),
        y = yCenter(5)
    ) {
        super(sprite, x, y);
        this.initialCoordinates = { x, y };
        this.boundaries = {
            up: yCenter(-1),
            down: yCenter(6),
            left: xCenter(-1),
            right: xCenter(5),
            win: yCenter(0)
        };
        this.moves = 0;
        this.start = null;
        this.end = null;
    }

    reset() {
        this.end = Date.now();
        score += getScore(this.moves, (this.end - this.start) / 1000);

        this.moves = 0;
        this.start = null;
        const { x, y } = this.initialCoordinates;
        this.update(x, y);
    }

    update(x, y) {
        if (x !== undefined && y) {
            this.x = x;
            this.y = y;
        }
    }

    render() {
        render(this.sprite, this.x, this.y);
    }

    handleInput(direction) {
        if (isModalShown) return;
        const { boundaries } = this;
        if (direction) this.moves++;
        if (this.moves === 1) this.start = Date.now();
        switch (direction) {
            case 'up':
                if (this.y -83 === boundaries.win) {
                    toggleModal();
                    this.reset();
                } else if (this.y - 83 > boundaries.up) {
                    this.update(this.x, this.y - 83);
                }
                break;
            case 'down':
                if (this.y + 83 < boundaries.down) {
                    this.update(this.x, this.y + 83);
                }
                break;
            case 'left':
                if (this.x - 100 > boundaries.left) {
                    this.update(this.x - 100, this.y);
                }
                break;
            case 'right':
                if (this.x + 100 < boundaries.right) {
                    this.update(this.x + 100, this.y);
                }
        }
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = [];
for (let i = 0; i < 3; i++) {
    allEnemies.push(new Enemy());
}
// Place the player object in a variable called player
const player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
