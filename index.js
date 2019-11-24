let app = require('express')();
let http = require('http').Server(app);
let io = require('socket.io')(http);
let port = process.env.PORT || 3000;

let snakes = Object();
let food = {x:10,y:10};
let countBLock = 30;

app.get('/',function(req,res){
    res.sendFile(__dirname + '/public/index.html');
});
app.get('/script.js',function(req,res){
    res.sendFile(__dirname + '/public/script.js');
});
app.get('/socket.io.js',function(req,res){
    res.sendFile(__dirname + '/public/socket.io.js');
});

io.on('connection', function(socket) {
    
    socket.on('start',function() {
        snakes[socket.id] = {move:'R',pm:'R',pos:[{x:3,y:3},{x:3,y:3},{x:3,y:3}]};
        socket.emit('food',JSON.stringify(food));
    });
    
    socket.on('disconnect', function() {
        delete snakes[socket.id];
    });
    
    socket.on('keyDown',function(msg) {
        if(snakes.hasOwnProperty(socket.id)) {
            snakes[socket.id].pm = msg;
        }
    });
    
});

function step() {
    
    firstWhile : for(snake in snakes) {
        
        let currentSnake = snakes[snake];
        
        let x = currentSnake.pos[0].x;
        let y = currentSnake.pos[0].y;
    
        if ((currentSnake.pm == 'R' && currentSnake.move != 'L') || (currentSnake.pm == 'L' && currentSnake.move != 'R') || (currentSnake.pm == 'U' && currentSnake.move != 'D') || (currentSnake.pm == 'D' && currentSnake.move != 'U')) {
            currentSnake.move = currentSnake.pm;
        }
        
        if (currentSnake.move == 'R') {
            x++;
        }
        if (currentSnake.move == 'L') {
            x--;
        }
        if (currentSnake.move == 'U') {
            y--;
        }
        if (currentSnake.move == 'D') {
            y++;
        }
        
        currentSnake.pos.pop();
        currentSnake.pos.unshift({x:x,y:y});
        
        for (snakeOther in snakes) {
            for (let i = 0; i < snakes[snakeOther].pos.length; i++) {
                if(snakes[snakeOther].pos[i].x == x && snakes[snakeOther].pos[i].y == y) {
                   if (snakeOther == snake && i == 0) {
                       continue;
                    }
                    delete snakes[snake];
                    continue firstWhile;
                }
            }
        }
        
        if (x > countBLock || x < 0 || y < 0 || y > countBLock) {
            delete snakes[snake];
        }
        
        
        if (food.x == x && food.y == y) {
            food = {x:getRandomInt(countBLock), y:getRandomInt(countBLock)};
            io.sockets.emit('food', JSON.stringify(food));
            currentSnake.pos.push({x:x,y:y});
        }
        
    }
    
    io.sockets.emit('snakes',JSON.stringify(snakes));
    
}
setInterval(step,200);
    
    
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

http.listen(port);