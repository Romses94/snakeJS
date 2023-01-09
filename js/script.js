const config = {
    mapWidth: 10, // количество клеток по оси X, не менять, требуется доработка скелета функционала для корректного изменения значений
    mapHeight: 10, // количество клеток по оси Y, не менять, требуется доработка скелета функционала для корректного изменения значений
    speed: 500, // скорость игры, можно менять
    tails: 1, // количество клеток "хвоста" змейки, в текущем виде поддерживает значения от 0 до 5 включительно
    walls: true, // включает непроходимость границ поля, по умолчанию включено
    increaseSpeed: true // увеличивает скорость с каждым набранным очком, по умолчанию включено
}

let score = 0;
let record = localStorage.getItem('score');

scoreSet(score);

function scoreSet(score) {
    let points = record;
    if (points == 'NaN') {
        let points = 0; 
    }
    else if (score > record) {
        let points = score;
    }
    document.querySelector('.progress').innerText = score + ' points';
    document.querySelector('.record').innerText = points + ' points';
}

function scoreUpdate() {
    score++;
    scoreSet(score)
    if (score > record)
    localStorage.setItem('score', score);
}

mapGenerator(config.mapWidth, config.mapHeight);

function mapGenerator(mapWidth, mapHeight) {
    let x = 1;
    let y = 1;
    for (j = 0; j < mapWidth * mapHeight; j++) {
        let list = document.querySelector('.map');
        let elem = document.createElement('div');
        list.appendChild(elem);
        elem.classList.add('field');
        if (x > 10) {
            x = 1;
            y++;
        }
        elem.setAttribute('x', x);
        elem.setAttribute('y', y);
        x++;
    }
}

function createSnake() {
    let x = 6;
    let y = 5;
    snake = [document.querySelector('.field[x="' + x + '"][y="' + y + '"]')];

    for (i = 1; i <= config.tails; i++) {
        x--; 
        snake.push(document.querySelector('.field[x="' + x + '"][y="' + y + '"]'));
    }
    for (j = 0; j < snake.length; j++) {
        snake[j].classList.add("snakeBody");
    }
    snake[0].classList.add("snakeHead");
}


function createApple(mapWidth, mapHeight) {
    let x = getRandomInt(mapWidth) + 1;
    let y = getRandomInt(mapHeight) + 1;
    let elem = document.querySelector('.field[x="' + x + '"][y="' + y + '"]');
    if (elem.classList.contains('snakeBody') || elem.classList.contains('snakeHead')) {
        createApple(mapWidth, mapHeight);
        return;
    }
    elem.classList.add('apple');
}

function pickApple() {
    document.querySelector('.apple').classList.remove('apple');
    createApple(config.mapWidth, config.mapHeight);
    scoreUpdate();
    if (config.increaseSpeed == true) {
        clearInterval(game);
        config.speed = config.speed - 10;
        game = setInterval(move, config.speed);
    }
}



function move() {
    let snakePosition = [
        x = Number(snake[0].getAttribute('x')),
        y = Number(snake[0].getAttribute('y'))
    ]; 
    snake[0].classList.remove('snakeHead'); 
    snake[snake.length - 1].classList.remove('snakeBody'); 
    snake.pop(); 

    if (dir == 'right') {
        if (snakePosition[0] == 10) {
            if (config.walls == true) {
                defeat();
                return;
            }
            else {
                snake.unshift(document.querySelector('.field[x="1"][y="' + snakePosition[1] + '"]'));
            }
        } 
        else {
            snake.unshift(document.querySelector('.field[x="' + (snakePosition[0] + 1) + '"][y="' + snakePosition[1] + '"]'));
        }
    }
    else if (dir == 'down') {
        if (snakePosition[1] == 10) {
            if (config.walls == true) {
                defeat();
                return;
            }
            else {
                snake.unshift(document.querySelector('.field[x="' + snakePosition[0] + '"][y="1"]')); 
            }
        }
        else {
            snake.unshift(document.querySelector('.field[x="' + snakePosition[0] + '"][y="' + (snakePosition[1] + 1) + '"]'));          
        }
    }
    else if (dir == 'left') {
        if (snakePosition[0] == 1) {
            if (config.walls == true) {
                defeat();
                return;
            }
            else {
                snake.unshift(document.querySelector('.field[x="10"][y="' + snakePosition[1] + '"]'));
            }
        }
        else {
            snake.unshift(document.querySelector('.field[x="' + (snakePosition[0] - 1) + '"][y="' + snakePosition[1] + '"]'));        
        }
    }
    else if (dir == 'up') {
        if (snakePosition[1] == 1) {
            if (config.walls == true) {
                defeat();
                return;
            }
            else {
                snake.unshift(document.querySelector('.field[x="' + snakePosition[0] + '"][y="10"]')); 
            }
        }
        else {
            snake.unshift(document.querySelector('.field[x="' + snakePosition[0] + '"][y="' + (snakePosition[1] - 1) + '"]'));        
        }
    }

    let apple = document.querySelector('.apple');

    if (snake[0].getAttribute('x') === apple.getAttribute('x') && snake[0].getAttribute('y') === apple.getAttribute('y')) {
        pickApple();
        let x = snake[snake.length - 1].getAttribute('x');
        let y = snake[snake.length - 1].getAttribute('y');
        snake.push(document.querySelector('.field[x ="' + x + '"][y ="' + y + '"]'));
    }

    if (snake[0].classList.contains('snakeBody')) {
        defeat();
    }

    snake[0].classList.add('snakeHead');
    for (let i = 0; i < snake.length; i++) {
        snake[i].classList.add("snakeBody");
    }
    flag = true;
}

isStarted = false;

document.querySelector('.map').addEventListener('click', function(){
    if (!isStarted)
        startGame();
});

document.querySelector('.restart').addEventListener('click', function(){
    score = 0;
    scoreSet(score);
    startGame();
})

function startGame() {
    dir = 'right';
    flag = false; 
    if (isStarted) {
        clearInterval(game);
    }
    let fields = document.querySelectorAll('.field');
    for (i = 0; i < fields.length; i++) {
        if (fields[i].classList.contains('apple')) {
            fields[i].classList.remove('apple');
        }
        if (fields[i].classList.contains('snakeHead')) {
            fields[i].classList.remove('snakeHead');
        }
        if (fields[i].classList.contains('snakeBody')) {
            fields[i].classList.remove('snakeBody');
        }
        if (fields[i].classList.contains('death')) {
            fields[i].classList.remove('death');
        }
    }
    createSnake();
    createApple(config.mapWidth, config.mapHeight);
    game = setInterval(move, config.speed);
    isStarted = true;
}

function defeat() {
    snake[0].classList.add('death');
    clearInterval(game);
    setTimeout(function() {
        if (score < record) {
            var text = 'Вы проиграли! Ваш текущий счёт: ' + score; 
        }
        else {
            var text = 'Поздравляем, вы установили новый рекорд!'
        }
        alert(text);
    }, 500);
}

window.addEventListener('keydown', (KeyboardEvent) => {
    if (flag == true) {
        if (KeyboardEvent.keyCode == 37 && dir != 'right') {
            dir = 'left';
            flag = false;
        } else if (KeyboardEvent.keyCode == 38 && dir != 'down') {
            dir = 'up';
            flag = false;
        } else if (KeyboardEvent.keyCode == 39 && dir != 'left') {
            dir = 'right';
            flag = false;
        } else if (KeyboardEvent.keyCode == 40 && dir != 'up') {
            dir = 'down';
            flag = false;
        }
    }

});

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}