var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 5},
            debug: false
        },
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

let player;
let trump;
let enter;
let shot;
let xSpeed = 0;
let ySpeed = 0;
const ACCEL = 8;
let accuracy = 50;
let score = 0;
let scoreText = "";
let timerText = "";
let timer = 0;
let interval;
let gameover = false;
let a = 0;
let r = 200;
let x0 = 400;
let y0 = 300;


function preload() {
    this.load.image('background', 'assets/background.jpg');
    this.load.image('crosshair', 'assets/crosshair.png');
    this.load.image('trump', 'assets/duck.png');
    this.load.audio('backgroundMusic', 'assets/backgroundmusic.mp3');
    this.load.audio('shoot', 'assets/shoot.mp3');
    this.load.audio('hitSound', 'assets/shot.mp3');
    this.load.image('pr', 'assets/paradise.jpg')
}

function create() {
    bk = this.add.image(400, 300, 'background');
    scoreText = this.add.text(250, 16, 'score: 0', {fontSize: '32px', fill: '#000'});
    timerText = this.add.text(600, 16, 'timer: 0', {fontSize: '32px', fill: '#000'});

    trump = this.physics.add.sprite(200, 150, 'trump');
    trump.scaleX = .1;
    trump.scaleY = .1;
    trump.setCollideWorldBounds(true);

    player = this.physics.add.sprite(400, 300, 'crosshair');
    player.scaleX = .2;
    player.scaleY = .2;
    player.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();
    enter = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    shot = this.sound.add('shoot');
    backgroundMusic = this.sound.add('backgroundMusic');
    hitSound = this.sound.add('hitSound');

    backgroundMusic.play();

    interval = setInterval(function () {
        timer += 1;
        timerText.setText('timer: ' + timer);
        if (timer > 60) {
            gameover = true;

        }
    }, 1000);
}

function gameOver() {
    interval = clearInterval();
    bk.destroy();
    trump.destroy();
    player.destroy();
}

function update() {
    if (gameover) {
        gameOver();
        a = this.add.image(400, 300, 'background');
        end = this.add.text(220, 200, 'GAME OVER', {fontSize: '64px', fill: '#000'});
        score1 = this.add.text(150, 290, 'Final Score: ' + score, {fontSize: '60px', fill: '#000'});
        game.destroy();
        return;
    }

    a += 0.06;
    trump.x = x0 + r * Math.cos(a);
    trump.y = y0 + r * Math.sin(a);


    //Player
    if (cursors.left.isDown) {
        xSpeed = xSpeed - ACCEL;
        player.setVelocityX(xSpeed);
    }
    if (cursors.right.isDown) {
        xSpeed = xSpeed + ACCEL;
        player.setVelocityX(xSpeed);
    }
    if (cursors.up.isDown) {
        ySpeed = ySpeed - ACCEL;
        player.setVelocityY(ySpeed);
    }
    if (cursors.down.isDown) {
        ySpeed = ySpeed + ACCEL;
        player.setVelocityY(ySpeed);
    }

    if (Phaser.Input.Keyboard.JustDown(enter)) {
        shot.play();
        if (Math.abs(player.x - trump.x) < accuracy && Math.abs(player.y - trump.y) < accuracy) {
            hit();
        } else {
            miss();
        }
    }

    function hit() {
        hitSound.play();
        score = score + 10;
        scoreText.setText('Score: ' + score);
        resetPlayer();
    }

    function miss() {
        score = score - 5;
        scoreText.setText('Score: ' + score);
    }

    function resetPlayer() {
        player.x = 400;
        player.y = 300;
        player.setVelocityX(0);
        player.setVelocityY(0);
        xSpeed = 0;
        ySpeed = 0;
    }

    function endGame() {
        trump.destroy();
        player.destroy();
        timerText.setText('');
        clearInterval(interval);
    }
}
