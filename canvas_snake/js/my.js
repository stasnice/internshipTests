
const canvas = document.getElementById('cv');
const ctx = canvas.getContext('2d');

const headStartX = 150;
const headStartY = 50;
const defPartRadius = 20;
const snakeStartLength = 4;
const canvasWidth = 600;
const canvasHeight = 600;

let score = 0;
let timerId;
let needFood = true;

let userName = '';
let usrMoveX = defPartRadius;
let usrMoveY = 0;
/*Direction values are:  0 - left, 1 - top, 2-right, 3-down*/
let direction = 2;
let snakeArr = [];
let foodArr = [];

gameProcess();

function gameProcess() {
    addListener();
    addSnakeParts();
    startGame();
}

function Circle(x, y, color, borderColor) {
    this.x = x;
    this.y = y;
    this.add = function () {
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.strokeStyle = borderColor;
        ctx.arc(this.x, this.y, defPartRadius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    };
}

/*get user input and start game loop*/
function startGame() {
    let startBtn = document.getElementById('startGame');
    startBtn.addEventListener('click', () => {
        userName = document.getElementById('usrNameInput').value;
        let nameDiv = document.getElementById('userName').innerText = userName;
        let modal = document.getElementById('modalContainer');
        modal.style.display = 'none';
        timerId = setInterval(gameLoop, 100);
    });
}

function endGame() {
    clearInterval(timerId);
    let gameOverDiv = document.getElementById('gameOver');
    gameOverDiv.style.display = 'block';
    gameOverDiv.innerText = gameOverDiv.innerText + ' ' + score;
}

function addSnakeParts() {
    for (let i = 0; i < snakeStartLength; i++){
        let currentPart;
        if (i === 0){
                currentPart = new Circle(headStartX, headStartY, 'green', 'black');
        }else {
            currentPart = new Circle(
                snakeArr[i-1].x - defPartRadius,
                headStartY,
                'green', 'black'
            )
        }
        snakeArr.push(currentPart);
        currentPart.add();
    }
}

function getRandom(min, max) {
    return Math.round(min + Math.random() * (max - min));
}

function addFood() {
    let foodX = getRandom(defPartRadius, canvasWidth - defPartRadius);
    let foodY = getRandom(defPartRadius, canvasHeight - defPartRadius);
    let food = new Circle(foodX, foodY, 'brown', 'black');
    food.add();
    foodArr.push(food);
    needFood = false;
}

function gameLoop() {
    ctx.fillStyle = 'grey';
    ctx.fillRect(0,0,600,600);
    if (needFood) addFood();

    snakeArr.unshift(
        new Circle(snakeArr[0].x + usrMoveX, snakeArr[0].y + usrMoveY, 'green', 'black')
    );
    /*do ton delete part if snake eat*/
    if (!eatFood()) snakeArr.pop();

    for (let i = snakeArr.length -1; i > -1; i--){
        snakeArr[i].add();
    }
    for (let j = 0; j < foodArr.length; j++){
        foodArr[j].add();
    }
    if (crashDetect(snakeArr[0])) endGame();

}

function updateScore() {
    let scoreDiv = document.getElementById('score');
    scoreDiv.innerText = '' + score;
}

function eatFood() {
    for (let i = 0; i < foodArr.length; i++){
        let distanceX = snakeArr[0].x - foodArr[i].x;
        let distanceY = snakeArr[0].y - foodArr[i].y;
        if (distanceX > -20 && distanceX < 20 && distanceY > -20 && distanceY < 20){
            foodArr.pop();
            needFood = true;
            score++;
            updateScore();
            return true;
        }
    }
    return false;
}

function crashDetect(head) {
    let topBorder = head.y - defPartRadius;
    let bottomBorder = head.y + defPartRadius;
    let leftBorder = head.x - defPartRadius;
    let rightBorder = head.x + defPartRadius;

    /*check desc borders*/
    if ( topBorder <= -1 || bottomBorder >= 601 || rightBorder >=601 || leftBorder <= -1){
        return true;
    }

    /*check snake tale*/
    for (let i = 4; i < snakeArr.length; i++){
        if (head.x === snakeArr[i].x && head.y === snakeArr[i].y) {
           return true;
        }
    }

    return false;
}

/* usr control block */
function addListener() {
    window.addEventListener('keydown', (e) => {
        /*left*/
        if (e.keyCode === 37 && direction !== 2){
            usrMoveX = -defPartRadius;
            usrMoveY = 0;
            direction = 0;
        }
        /*right*/
        if (e.keyCode === 39 && direction !== 0){
            usrMoveX = defPartRadius;
            usrMoveY = 0;
            direction = 2;
        }
        /*top*/
        if (e.keyCode === 38 && direction !== 3){
            usrMoveX = 0;
            usrMoveY = -defPartRadius;
            direction = 1;
        }
        /*down*/
        if (e.keyCode === 40 && direction !== 1){
            usrMoveX = 0;
            usrMoveY = defPartRadius;
            direction = 3;
        }
    });
}