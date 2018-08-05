// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = -1 * 100
    this.y = 83 * ((Math.floor(Math.random() * 3) + 1) - 1/2)
    this.speed = Math.floor(Math.random() * (600 - 300 + 1)) + 300
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    // Reset enemies
    if (this.x > 5 * 100) {
        this.x = -1 * 100
        this.y = 83 * ((Math.floor(Math.random() * 3) + 1) - 1/2)
        this.speed = Math.floor(Math.random() * (600 - 300 + 1)) + 300
    }

    // Lose condition
    if (
        this.x < player.x + 5
        && this.x > player.x - 5
        && this.y === player.y
    ) {
        const { x, y } = player.initialCoordinates
        player.update(x, y)
    }
    this.x += this.speed * dt
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
    constructor() {
        this.initialCoordinates = {
            x: 2 * 100,
            y: 83 * (5 - 1/2)
        }
        this.x = this.initialCoordinates.x
        this.y = this.initialCoordinates.y
        this.sprite = 'images/char-boy.png'
    }
    update(x, y) {
        if (x && y) {
            this.x = x
            this.y = y
        }
    }
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }
    handleInput(direction) {
        switch (direction) {
            case 'up':
                if (this.y -83 === 83 * (0 - 1/2)) {
                    const { x, y } = this.initialCoordinates
                    this.update(x, y)
                } else if (this.y - 83 > 83 * (-1 - 1/2)) {
                    this.update(this.x, this.y - 83)
                }
                break;
            case 'down':
                if (this.y + 83 < 83 * (6 - 1/2)) {
                    this.update(this.x, this.y + 83)
                }
                break;
            case 'left':
                if (this.x - 100 > -1 * 100) {
                    this.update(this.x - 100, this.y)
                }
                break;
            case 'right':
                if (this.x + 100 < 5 * 100) {
                    this.update(this.x + 100, this.y)
                }
        }
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
const allEnemies = []
for (let i = 0; i < 3; i++) {
    allEnemies.push(new Enemy())
}
// Place the player object in a variable called player
const player = new Player()



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
