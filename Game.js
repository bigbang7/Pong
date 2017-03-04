const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const MAX_SCORE=3;

var canvas;
var canvasContext;

var ballX = 50, ballY=30;
var speedBallX = 5, speedBallY = 5;
var ballAceleration=1.05;

var paddle1Y = 250;
var paddle2Y=250;

var p1Score=0,p2Score=0;
var WinScreen=false;


function moveAI(){
    var paddleCenter= paddle2Y+PADDLE_HEIGHT/2
    if(paddleCenter<ballY-35){
        paddle2Y+= 5;
    }else if(paddleCenter>ballY+35){
        paddle2Y-= 5;
    }

}

function ballReset(){
    if(p1Score>=MAX_SCORE || p2Score>=MAX_SCORE){
        p1Score=0;
        p2Score=0;
        WinScreen=true;
    }

    speedBallY=5;
    speedBallX= -speedBallX;
    ballY=canvas.height/2;
    ballX=canvas.width/2;

}

function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY= evt.clientY - rect.top - root.scrollTop;
    return{
        x:mouseX,
        y:mouseY
    };

}


function colorBall(x,y,r,color){
    canvasContext.fillStyle=color;
    canvasContext.beginPath();
    canvasContext.arc(x,y,r,0,Math.PI*2);
    canvasContext.fill();

}


function colorRect(x,y,width,height,color){
    canvasContext.fillStyle = color;
    canvasContext.fillRect(x,y,width,height);

}

function moveAll(){
    if(WinScreen){
        return;
    }

    moveAI();
    ballX+= speedBallX;
    ballY+= speedBallY;
    
    ballBounce();
  
    console.log(p1Score+':'+p2Score);

}

function ballBounce(){

    if(ballX>canvas.width-1){
        if(ballY>paddle2Y&&
           ballY<paddle2Y+PADDLE_HEIGHT){
            speedBallX*=ballAceleration;
            speedBallX= -speedBallX;
            
            var deltaY=ballY-(paddle2Y+PADDLE_HEIGHT/2);
            speedBallY=deltaY*0.35;

         }else{
            p1Score++;
            ballReset();
            speedBallX=-5;
        }
    }
    if(ballX<0){
        if(ballY>paddle1Y&&
           ballY<paddle1Y+PADDLE_HEIGHT){
            speedBallX*=ballAceleration;
            speedBallX= -speedBallX;

            var deltaY=ballY-(paddle1Y+PADDLE_HEIGHT/2);
            speedBallY=deltaY*0.2;
        }else{
            p2Score++;
            ballReset();
            speedBallX=5;
        }
    }

    if(ballY>canvas.height-1){
        speedBallY= -speedBallY;
    }
    if(ballY<0){
        speedBallY= -speedBallY;
    }

}


function drawAll(){
    //fondo
    colorRect(0,0,canvas.width,canvas.height,'black');
     if(WinScreen){
         canvasContext.fillStyle="white";
        canvasContext.fillText('Click para Continuar',100,90);
        if(p1Score>=p2Score){
            canvasContext.fillText('Gana el jugador 1',100,100);
        }
        else{
            canvasContext.fillText('Gana el jugador 2',100,100);
        }
        return;
    }
    //barra izq
    colorRect(0,paddle1Y,PADDLE_THICKNESS,100,'white');
    //barra der
    colorRect(canvas.width-PADDLE_THICKNESS, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
    //pelota
    colorBall(ballX,ballY,7,'white');

    canvasContext.fillText(p1Score,100,100);
    canvasContext.fillText(p2Score,canvas.width-100,100);

}

function handleMouseClick(evt){
    if(WinScreen){
        p1Score=0;
        p2Score=0;
        WinScreen=false;


    }
}

window.onload = function(){
                canvas = document.getElementById("gameCanvas");
                canvasContext = canvas.getContext('2d');

                var fPS=60;
                setInterval(function(){
                    moveAll();
                    drawAll();
                },1000/fPS);

                canvas.addEventListener('mousedown',handleMouseClick);

                canvas.addEventListener('mousemove',
                    function(evt){
                        var mousePos= calculateMousePos(evt);
                        paddle1Y=mousePos.y-(PADDLE_HEIGHT/2);
                        
                    });
                
}

