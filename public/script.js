let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let socket = io();

let countBLock = 30;
let snakes = Object();
let food = {x:10,y:10};

let sizeBox = 20;

canvas.width = countBLock*sizeBox; 
canvas.height = countBLock*sizeBox;

socket.emit('start',1);

function draw() {
    ctx.fillStyle = "#181818";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    
    ctx.fillStyle = '#eb3b5a';
    for(snake in snakes) {
        let currenSnake = snakes[snake];
        
        for(let i = 0; i<currenSnake.pos.length; i++) {
            ctx.fillRect(currenSnake.pos[i].x*sizeBox,currenSnake.pos[i].y*sizeBox,sizeBox - 1,sizeBox - 1);
        }
        
    }
    
    ctx.fillStyle = "#78e08f";
    ctx.fillRect(food.x*sizeBox,food.y*sizeBox,sizeBox - 1,sizeBox - 1);
    
}
setInterval(draw,25);

socket.on('snakes',function(msg) {
    snakes = JSON.parse(msg);
});

socket.on('food',function(msg) {
    food = JSON.parse(msg);
});

document.addEventListener('keydown', function(event) {
    if (event.code == 'KeyW') {
        socket.emit('keyDown', 'U');
    }
    if (event.code == 'KeyA') {
        socket.emit('keyDown', 'L');
    }
    if (event.code == 'KeyD') {
        socket.emit('keyDown', 'R');
    }
    if (event.code == 'KeyS') {
        socket.emit('keyDown', 'D');
    }
});