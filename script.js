const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let score = 0;

// let x = canvas.width / 2;
// let y = canvas.height - 30;
// const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 50;
const ballRadius = 12;

console.log(`value of x ${x} value of y ${y}`)
console.log(`value of width ${canvas.width } value of height ${canvas.height}`)
let dx = 2;
let dy = -2;

let interval = 0;




// paddle draw 
// const paddleHeight = 10;
// const paddleWidth = 75;
// let paddleX = (canvas.width - paddleWidth) / 2;

const paddleWidth = 120;
const paddleHeight = 12;
let paddleX = (canvas.width - paddleWidth) / 2;
// for padle control buttons select the direction
let rightPressed = false;
let leftPressed = false;


// Brick variables 
// const brickRowCount = 3;
// const brickColumnCount = 5;
// const brickWidth = 75;
// const brickHeight = 20;
// const brickPadding = 10;
// const brickOffsetTop = 30;
// const brickOffsetLeft = 30;

const brickRowCount = 5; // More rows
const brickColumnCount = 8; // More columns
const brickWidth = 80; // Slightly wider bricks
const brickHeight = 25;
const brickPadding = 12;
const brickOffsetTop = 50;
const brickOffsetLeft = 40;

// let bricks = [];

// for (let c = 0; c < brickColumnCount; c++) {
//   bricks[c] = [];
//   for (let r = 0; r < brickRowCount; r++) {
//     bricks[c][r] = { x: 0, y: 0, status: 1 };
//   }
// }

const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#1A535C', '#F7FFF7'];

// Initialize bricks
let bricks = [];
initializeBricks();

function initializeBricks() {
  bricks = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      const colorIndex = Math.floor(Math.random() * colors.length);
      bricks[c][r] = { 
        x: 0, 
        y: 0, 
        status: 1, 
        color: colors[colorIndex],
        points: (brickRowCount - r) * 10 // Top rows worth more points
      };
    }
  }
}


 

function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

  function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
  }

//   function drawBricks() {
//     for (let c = 0; c < brickColumnCount; c++) {
//       for (let r = 0; r < brickRowCount; r++) {
//         if (bricks[c][r].status === 1) {
//           const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
//           const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
//           bricks[c][r].x = brickX;
//           bricks[c][r].y = brickY;
//           ctx.beginPath();
//           ctx.rect(brickX, brickY, brickWidth, brickHeight);
//           ctx.fillStyle = "#0095DD";
//           ctx.fill();
//           ctx.closePath();
//         }
//       }
//     }
//   }

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        if (bricks[c][r].status === 1) {
          const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
          const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
          bricks[c][r].x = brickX;
          bricks[c][r].y = brickY;
          
          // Draw brick main body
          ctx.beginPath();
          ctx.roundRect(brickX, brickY, brickWidth, brickHeight, 4);
          ctx.fillStyle = bricks[c][r].color;
          ctx.fill();
          ctx.closePath();
          
          // Draw brick highlight
          ctx.beginPath();
          ctx.roundRect(brickX + 2, brickY + 2, brickWidth - 4, brickHeight/2 - 2, 2);
          const gradient = ctx.createLinearGradient(0, brickY, 0, brickY + brickHeight/2);
          gradient.addColorStop(0, "rgba(255, 255, 255, 0.4)");
          gradient.addColorStop(1, "rgba(255, 255, 255, 0)");
          ctx.fillStyle = gradient;
          ctx.fill();
          ctx.closePath();
        }
      }
    }
  }

  function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
      for (let r = 0; r < brickRowCount; r++) {
        const b = bricks[c][r];
        if (b.status === 1) {
          if (
            x > b.x &&
            x < b.x + brickWidth &&
            y > b.y &&
            y < b.y + brickHeight
          ) {
            dy = -dy;
            b.status = 0;
            score++;
             // Create brick breaking effect
          createBrickParticles(b.x + brickWidth/2, b.y + brickHeight/2, b.color);
            if (score === brickRowCount * brickColumnCount) {
                alert("YOU WIN, CONGRATULATIONS!");
                document.location.reload();
                clearInterval(interval); // Needed for Chrome to end game
              }
          }
        }
      }
    }
  }

  function drawScore() {
    ctx.font = "bold 20px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText(`Score: ${score}`, 30, 30);
    
  }

 

 


  // Particles for breaking bricks
let particles = [];

function createBrickParticles(x, y, color) {
  for (let i = 0; i < 10; i++) {
    particles.push({
      x: x,
      y: y,
      dx: (Math.random() - 0.5) * 4,
      dy: (Math.random() - 0.5) * 4,
      radius: Math.random() * 4 + 1,
      color: color,
      alpha: 1
    });
  }
  playSound('brick');
}

function drawParticles() {
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fillStyle = p.color;
    ctx.fill();
    ctx.closePath();
    ctx.globalAlpha = 1;
    
    // Update particle position
    p.x += p.dx;
    p.y += p.dy;
    p.alpha -= 0.02;
    
    // Remove faded particles
    if (p.alpha <= 0) {
      particles.splice(i, 1);
      i--;
    }
  }
}


function playSound(soundName) {
  const audio = new Audio(`${soundName}.wav`);
  audio.play().catch(error => console.error("Audio playback error:", error));
}
 
   
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBall();
    drawPaddle();
    drawBricks();
    drawParticles();
    collisionDetection();
    drawScore();
     
    if(x+dx < ballRadius || x + dx > canvas.width-ballRadius){
        dx = -dx
    }

    if (y + dy < ballRadius) {
        dy = -dy;
      } else if (y + dy > canvas.height - ballRadius) {
        if (x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            playSound('paddle');
          } else {
            showGameOver();
            
            clearInterval(interval);

            return;
          }
      }


    if (rightPressed) {
        paddleX = Math.min(paddleX + 7, canvas.width - paddleWidth);
      } else if (leftPressed) {
        paddleX = Math.max(paddleX - 7, 0);
      }

    if (rightPressed) {
        paddleX += 4;
      } else if (leftPressed) {
        paddleX -= 4;
      }

    x += dx;
    y += dy;

   
  }

  function showGameOver() {
    playSound("gameover")
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Background
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Game Over text
    ctx.font = "60px 'Segoe UI'";
    ctx.fillStyle = "#FF6B6B";
    ctx.textAlign = "center";
    ctx.fillText("GAME OVER", canvas.width/2, canvas.height/2 - 50);
    
    // Final score
    ctx.font = "30px 'Segoe UI'";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(`Final Score: ${score}`, canvas.width/2, canvas.height/2);
    
    // Play again message
    ctx.font = "20px 'Segoe UI'";
    ctx.fillText("Refresh to play again", canvas.width/2, canvas.height/2 + 50);
    
    // Enable start button again
    document.getElementById("runButton").disabled = false;
    // document.getElementById("runButton").textContent = "PLAY AGAIN";
  }

  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);

  function keyDownHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = true;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = true;
    }
  }
  
  function keyUpHandler(e) {
    if (e.key === "Right" || e.key === "ArrowRight") {
      rightPressed = false;
    } else if (e.key === "Left" || e.key === "ArrowLeft") {
      leftPressed = false;
    }
  }


document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft;
  paddleX = Math.max(0, Math.min(relativeX - paddleWidth / 2, canvas.width - paddleWidth));
}

  function startGame() {
    score = 0;
    
    
    // Reset ball and paddle
    x = canvas.width / 2;
    y = canvas.height - 30;
    dx = 4;
    dy = -4;
    paddleX = (canvas.width - paddleWidth) / 2;
    
    // Initialize bricks
    initializeBricks();
    
    // Start game loop
    if (interval) {
      clearInterval(interval);
    }
    interval = setInterval(draw, 10);
    
  }

  document.getElementById("runButton").addEventListener("click", function () {
    startGame();
    this.disabled = true;
  });