const canvas = document.getElementById('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const gravity = 1.1;

class Player {
    constructor ({position, velocity, color, offset, energy, health, isLeftPlayer}) {
        this.position = position;
        this.velocity = velocity;
        this.energyCap = 100;
        this.energy = energy;
        this.jumpCap = 2;
        this.width = 50;
        this.height = 150;
        this.color = color;
        this.lastKey;
        this.healthStock = 200;
        this.health = health;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50
        };
        this.isAttacking;
        this.isLeftPlayer = isLeftPlayer;
    }

    draw() {
        // Player sprite
        c.fillStyle = this.color;
        c.fillRect(this.position.x, this.position.y, this.width, this.height);
        
        // Attack box
        if (this.isAttacking) { 
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        }

        // Health bar
        c.fillStyle = "#BF3F3F";
        if (this.isLeftPlayer) {
            c.fillRect(this.health.x - 200, this.health.y, 400, 30);
        } else {
            c.fillRect(this.health.x, this.health.y, 400, 30);
        }
        c.fillStyle = "#447433";
        if (this.isLeftPlayer) {
            c.fillRect(this.health.x + 200 - this.healthStock * 2, this.health.y, this.healthStock * 2, 30);
        } else {
            c.fillRect(this.health.x, this.health.y, this.healthStock * 2, 30);
        }

        // Energy bar
        c.fillStyle = "#BF3F3F";
        c.fillRect(this.energy.x, this.energy.y, 200, 25);
        c.fillStyle = "#085868";
        if (this.isLeftPlayer) {
            c.fillRect(this.energy.x + 200 - this.energyCap * 2, this.energy.y, this.energyCap * 2, 25);
        } else {
            c.fillRect(this.energy.x, this.energy.y, this.energyCap * 2, 25); 
        }
    }

    attack() {
        this.isAttacking = true;
        setTimeout(() => {
            this.isAttacking = false;
        }, 100);
    }

    energyReg() {
        if (this.energyCap <= 100) {
            this.energyCap += .5;
        }
    }

    update() {
        this.draw();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y;
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        // Floor collision
        if (this.position.y + this.height + this.velocity.y <= canvas.height) {
            this.velocity.y += gravity;
        } else this.velocity.y = 0;

        // Energy regeneration
        if (this.energyCap <= 100) {
            setTimeout(() => {
                setTimeout(() => {
                    this.energyReg();
                }, 1000);
            }, 1000);
        }

        // Regeneration double jump
        if (this.velocity.y === 0) { 
            this.jumpCap = 2;
        }

        //walls
        if (this.position.x <= 1) {
            this.position.x = 0;
        }
        if (this.position.x + this.width >= canvas.width) {
            this.position.x = canvas.width - this.width;
        }
    }
}

const playerOne = new Player({
    position: {
        x: canvas.width / 2 - 350,
        y: canvas.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: '#085868',
    offset: {
        x: 0,
        y: 0
    },
    energy: {
        x: canvas.width / 2 - 200,
        y: 30
    },
    health: {
        x: canvas.width / 2 - 200,
        y: 0
    },
    isLeftPlayer: true
});

const playerTwo = new Player({
    position: {
        x: canvas.width / 2 + 300,
        y: canvas.height / 2
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: '#FFE44B',
    offset: {
        x: -50,
        y: 0
    },
    energy: {
        x: canvas.width / 2,
        y: 30
    },
    health: {
        x: canvas.width / 2,
        y: 0
    },
    isLeftPlayer: false
});

// Keys status
const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    space: {
        pressed: false
    },
    arrowRight: {
        pressed: false
    },
    arrowLeft: {
        pressed: false
    }
};

function rectCollision({ rect1, rect2 }) {
    return (
        rect1.attackBox.position.x + rect1.attackBox.width >= rect2.position.x &&
        rect1.attackBox.position.x <= rect2.position.x + rect2.width &&
        rect1.attackBox.position.y <= rect2.position.y + rect2.height &&
        rect1.attackBox.position.y + rect1.attackBox.height >= rect2.position.y
    );
}

let timer = 60;
let timerId;
let playerOneWins = 0;
let playerTwoWins = 0;

//win count
function updateWinCounters() {
    const playerOneWinsContainer = document.getElementById('playerOneWins');
    const playerTwoWinsContainer = document.getElementById('playerTwoWins');
    
    playerOneWinsContainer.innerHTML = '';
    playerTwoWinsContainer.innerHTML = '';

    for (let i = 0; i < playerOneWins; i++) {
        const dot = document.createElement('span');
        playerOneWinsContainer.appendChild(dot);
    }

    for (let i = 0; i < playerTwoWins; i++) {
        const dot = document.createElement('span');
        playerTwoWinsContainer.appendChild(dot);
    }
}

//reset positions
function resetPlayersPositions() {
    playerOne.position.x = canvas.width / 2 - 350;
    playerOne.position.y = canvas.height / 2;
    playerTwo.position.x = canvas.width / 2 + 300;
    playerTwo.position.y = canvas.height / 2;
}

//winner display
function displayWinner(message) {
    const winnerDiv = document.getElementById('winner');
    winnerDiv.innerText = message;
    winnerDiv.style.display = 'block';
    resetPlayersPositions();
    setTimeout(() => {
        winnerDiv.style.display = 'none';
    }, 1000); 

    if (message.includes("Перший гравель здобув перемогу!!!")) {
        playerOneWins++;
    } else if (message.includes("Другий гравель здобув перемогу!!!")) {
        playerTwoWins++;
    }

    updateWinCounters();
} 

//final winner display
function displayFinalWinner() {
    const finalWinnerDiv = document.getElementById('final-winner');
    if (playerOneWins > playerTwoWins) {
        finalWinnerDiv.innerText = "Перший гравець набрав більше перемог!";
    } else if (playerTwoWins > playerOneWins) {
        finalWinnerDiv.innerText = "Другий гравець набрав більше перемог!";
    } else {
        finalWinnerDiv.innerText = "Нічия!";
    }
}
   
//final display
function decreaseTimer() {
    if (timer > 0) {
        timerId = setTimeout(decreaseTimer, 1000);
        timer--;
        document.getElementById('timer').innerText = timer;
    } else {
        document.getElementById('end-game').style.display = 'block';
        displayFinalWinner();
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);
    playerOne.update();
    playerTwo.update();

    //reset health    
    if (playerOne.healthStock <= 0) {
        displayWinner("Другий гравель здобув перемогу!!!");
        playerOne.healthStock = 200;
        playerTwo.healthStock = 200;
    } else if (playerTwo.healthStock <= 0) {
        displayWinner("Перший гравель здобув перемогу!!!");
        playerOne.healthStock = 200;
        playerTwo.healthStock = 200;
    }

    // Player one control
    playerOne.velocity.x = 0;
    if (keys.a.pressed) {
        playerOne.velocity.x = -5;
    } else if (keys.d.pressed) {
        playerOne.velocity.x = 5;
    } else playerOne.velocity.x = 0;

    // Player two control
    playerTwo.velocity.x = 0;
    if (keys.arrowLeft.pressed) {
        playerTwo.velocity.x = -5;
    } else if (keys.arrowRight.pressed) {
        playerTwo.velocity.x = 5;
    } else playerTwo.velocity.x = 0;

    // Detection of collision
    if (rectCollision({
        rect1: playerOne,
        rect2: playerTwo
    }) && playerOne.isAttacking) {
        playerOne.isAttacking = false;
        playerTwo.healthStock -= 25;
    }

    if (rectCollision({
        rect1: playerTwo,
        rect2: playerOne
    }) && playerTwo.isAttacking) {
        playerTwo.isAttacking = false;
        playerOne.healthStock -= 25;
    }

    //attack back
    if (playerOne.position.x > playerTwo.position.x + playerTwo.width) {
        playerOne.attackBox.offset.x = -50;
    } else playerOne.attackBox.offset.x = 0;

    if (playerTwo.position.x + playerTwo.width < playerOne.position.x) {
        playerTwo.attackBox.offset.x = 50;
    } else playerTwo.attackBox.offset.x = -50;
}

decreaseTimer();
animate();

//final display button
document.getElementById('reset-button').addEventListener('click', function() {
    window.location.href = "game.html";
});

document.getElementById('exit-button').addEventListener('click', function() {
    window.location.href = "index.html";
});



// Player one keydown
addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'w': // W
        if (playerOne.jumpCap > 0 && playerOne.energyCap >= 15) {
            playerOne.velocity.y -= 20;
            playerOne.energyCap -= 15;
            playerOne.jumpCap -= 2;
        }
            break;
        case 'a': // Left
            keys.a.pressed = true;
            playerOne.lastKey = 'a';
            break;
        case 's': // Down
            break;
        case 'd': // Right
            keys.d.pressed = true;
            playerOne.lastKey = 'd';
            break;
        case 'W': // W
        if (playerOne.jumpCap > 0 && playerOne.energyCap >= 15) {
            playerOne.velocity.y -= 20;
            playerOne.energyCap -= 15;
            playerOne.jumpCap -= 2;
        }
            break;
        case 'A': // Left
            keys.a.pressed = true;
            playerOne.lastKey = 'a';
            break;
        case 'S': // Down
            break;
        case 'D': // Right
            keys.d.pressed = true;
            playerOne.lastKey = 'd';
            break;
        case ' ': // Space
            if (playerOne.energyCap >= 15) {
                playerOne.attack();
                playerOne.energyCap -= 15;
            }
            break;
        case 'Shift': // Shift
            if (playerOne.energyCap >= 25) {
                playerOne.velocity.x *= 20;
                playerOne.energyCap -= 25;
            }
            break;
    }
});

// Player one keyup
addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'w': // W
            break;
        case 'a': // Left
            keys.a.pressed = false;
            playerOne.lastKey = 'a';
            break;
        case 's': // Down
            break;
        case 'd': // Right
            keys.d.pressed = false;
            playerOne.lastKey = 'd';
            break;
        case 'W': // W
            break;
        case 'A': // Left
            keys.a.pressed = false;
            playerOne.lastKey = 'a';
            break;
        case 'S': // Down
            break;
        case 'D': // Right
            keys.d.pressed = false;
            playerOne.lastKey = 'd';
            break;
        case ' ': // Space
            break;
        case 'Shift': // Shift
            break;
    }
});

// Player two keydown
addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp': // W
            if (playerTwo.jumpCap > 0 && playerTwo.energyCap >= 15) {
                playerTwo.velocity.y -= 20;
                playerTwo.energyCap -= 15;
                playerTwo.jumpCap -= 2;
            }
            break;
        case 'ArrowLeft': // Left
            keys.arrowLeft.pressed = true;
            playerTwo.lastKey = 'ArrowLeft';
            break;
        case 'ArrowDown': // Down
            break;
        case 'ArrowRight': // Right
            keys.arrowRight.pressed = true;
            playerTwo.lastKey = 'ArrowRight';
            break;
        case '/':
            if (playerTwo.energyCap >= 15) {
                playerTwo.attack();
                playerTwo.energyCap -= 15;
            }
            break;
        case '.': // Shift
            if (playerTwo.energyCap >= 25) {
                playerTwo.velocity.x *= 20;
                playerTwo.energyCap -= 25;
            }
            break;
    }
});

// Player two keyup
addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'ArrowUp': // W
            break;
        case 'ArrowLeft': // Left
            keys.arrowLeft.pressed = false;
            playerTwo.lastKey = 'ArrowLeft';
            break;
        case 'ArrowDown': // Down
            break;
        case 'ArrowRight': // Right
            keys.arrowRight.pressed = false;
            playerTwo.lastKey = 'ArrowRight';
            break;
    }
});