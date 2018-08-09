'use strict';
// Helper functions
const randomInRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const render = (sprite, x, y) => ctx.drawImage(Resources.get(sprite), x, y);
const yCenter = (coord) => 83 * (coord - 1/2);
const xCenter = (coord) => coord * 100;

// Parent Class
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
            this.x < player.x + 5
            && this.x > player.x - 5
            && this.y === player.y
        ) {
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
    }

    reset() {
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
        const { boundaries } = this
        switch (direction) {
            case 'up':
                if (this.y -83 === boundaries.win) {
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
