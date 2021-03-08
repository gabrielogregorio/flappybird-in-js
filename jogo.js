console.log("Flappy Bird");
console.log("code written by gabriel gregorio. ");

let fps = 0;
let maxScore = 0;
const soundColision = new Audio();
const soundAmbience = new Audio();

soundColision.src = './efeitos/game_over.wav';
soundAmbience.src = './efeitos/ambience.mp3';

if (typeof soundAmbience.loop == 'boolean')
{ soundAmbience.loop = true; }
else
{
  soundAmbience.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);
}
soundAmbience.play();


const sprites = new Image();
sprites.src = "./sprites.png";



const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');




const background = {
  srcX: 390,
  srcY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,
  draw () {
    context.fillStyle = '#70c5ce';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sprites,
      background.srcX, background.srcY,
      background.width, background.height,
      background.x, background.y,
      background.width, background.height,
    ); 

    context.drawImage(
      sprites,
      background.srcX, background.srcY,
      background.width, background.height,
      (background.x + background.width), background.y,
      background.width, background.height,
    ); 
  }
};

function createGround() {
  const floor = {
    srcX: 0, srcY: 610,
    width: 224, height: 112,
    x: 0, y: canvas.height - 112,

    update() {
      const groundMovement = 1;

      if (floor.x > -112) { floor.x = floor.x - groundMovement; }
      else { floor.x = -1; }
    },

    draw() {
      context.drawImage(
        sprites,
        floor.srcX, floor.srcY,
        floor.width, floor.height,
        floor.x, floor.y,
        floor.width, floor.height,
      ); 

      context.drawImage(
        sprites,
        floor.srcX, floor.srcY,
        floor.width, floor.height,
        (floor.x + floor.width), floor.y,
        floor.width, floor.height,
      ); 
    }
  };
  return floor;
}

function makeCollision(flappyBird, floor) {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  const floorY = floor.y;

  if (flappyBirdY >= floorY) { return true; }
  return false;
};

function createFlappyBird() {
  const flappyBird = {
    srcX: 0, srcY: 0,
    width: 33, height: 24,
    x: 10, y: 50,
    velocity: 0,
    gravity: 0.25,
    jump: 4.6,
    pula() {
      flappyBird.velocity = - flappyBird.jump;
    },
    update() {
      if (makeCollision(flappyBird, global.floor)) {
        soundColision.play();
        changeScreen(gameScreens.GAMEOVER);
        return;
      }
      flappyBird.velocity = flappyBird.velocity + flappyBird.gravity;
      flappyBird.y = flappyBird.y + flappyBird.velocity;
    },

    movements: [
      { srcX: 0, srcY: 0 },  // flappy bird /\
      { srcX: 0, srcY: 26 }, // flappy bird --
      { srcX: 0, srcY: 52 }, // flappy bird \/
      { srcX: 0, srcY: 26 }  // flappy bird --
    ],
    frameCurrent: 0,
    updateFrame() {
      const intervalFps = 10;
      const passedOn = fps % intervalFps == 0;
     
      if (passedOn) {
        const baseIncrement = 1;
        const increment = baseIncrement + flappyBird.frameCurrent;
        const baseRepetition = flappyBird.movements.length;
        flappyBird.frameCurrent = increment % baseRepetition;  
      }
    },

    draw() {
      flappyBird.updateFrame();
      const {srcX, srcY} = flappyBird.movements[flappyBird.frameCurrent];

      context.drawImage(
        sprites,
        srcX, srcY,
        flappyBird.width, flappyBird.height,
        flappyBird.x, flappyBird.y,
        flappyBird.width, flappyBird.height,
      ); 
    }
  };
  return flappyBird;
}

const homScreen = {
  srcX: 134, srcY: 0,
  width: 174, height: 152,
  x: (canvas.width / 2) - 174 / 2, y: 50,

  draw () {
    context.drawImage(
      sprites,
      homScreen.srcX, homScreen.srcY,
      homScreen.width, homScreen.height,
      homScreen.x, homScreen.y,
      homScreen.width, homScreen.height,
    ); 
  }
};

function createMedal() {
  const medal = {
    draw() {
      /* positions of medals */
      iron = { srcX: 48, srcY: 78, width: 44, height: 44, x: 73, y: 137 }
      bronze = { srcX: 48, srcY: 124, width: 44, height: 44, x: 73, y: 137 }
      silver = { srcX: 0, srcY: 78, width: 44, height: 44, x: 73, y: 137 }
      gold = { srcX: 0, srcY: 124, width: 44, height: 44, x: 73, y: 137 }

      let medalType;

      /* Rules for medals */
      if ( global.score.punctuation < 7 ) { medalType = iron; }
      else if ( global.score.punctuation < 20 ) { medalType = bronze; }
      else if ( global.score.punctuation < 35 ) { medalType = silver; }
      else { medalType = gold; }

      context.drawImage(
        sprites,
        medalType.srcX, medalType.srcY,
        medalType.width, medalType.height,
        medalType.x, medalType.y,
        medalType.width, medalType.height,
      ); 
    },
    update() {
    }
  };

  return medal;
}


const gameOver = {
  srcX: 134, srcY: 153,
  width: 226, height: 200,
  x: (canvas.width / 2) - 226 / 2, // centralize
  y: 50,

  draw () {
    context.drawImage(
      sprites,
      gameOver.srcX, gameOver.srcY,
      gameOver.width, gameOver.height,
      gameOver.x, gameOver.y,
      gameOver.width, gameOver.height,
    ); 
  }
};

function createPipes() {
  const pipes = {
    width: 52, height: 400,
    floor: { srcX:0, srcY:169 },
    sky: { srcX: 52, srcY: 169 },

    draw() {
      pipes.pairs.forEach(function(pair) {
        const yRandom = pair.y;
        const spaceBetweenPipes = 100;
        const skyTubeX = pair.x;
        const skyTubeY = yRandom;
  
        context.drawImage (
          sprites,
          pipes.sky.srcX, pipes.sky.srcY,
          pipes.width, pipes.height,
          skyTubeX, skyTubeY,
          pipes.width, pipes.height
        )

        const pipeFloorX = pair.x;
        const pipeFloorY = pipes.height + spaceBetweenPipes + yRandom;

        context.drawImage(
          sprites,
          pipes.floor.srcX, pipes.floor.srcY,
          pipes.width, pipes.height,
          pipeFloorX, pipeFloorY,
          pipes.width, pipes.height
        ),

        pair.skyTube = { x: skyTubeX, y: pipes.height + skyTubeY }
        pair.pipeFloor = { x: pipeFloorX, y: pipeFloorY }
    })
   },

    hasCollisionFlapp(pair) {
      const FlappyBirdHead = global.flappyBird.y;
      const standingFlappyBird = global.flappyBird.y + global.flappyBird.height;

      if ((global.flappyBird.x + global.flappyBird.width-10) >= pair.x) {
        if (FlappyBirdHead+4 <= pair.skyTube.y) { return true; }
        if (standingFlappyBird-4 >= pair.pipeFloor.y) { return true; }
      }
      return false;
    },
    pairs: [],
    update() {
      const passedOn100fps = fps % 100 == 0;

      if (passedOn100fps) {
        pipes.pairs.push({ x: canvas.width, y: -150 * (Math.random() + 1) })
      }

      pipes.pairs.forEach(function(pair) {
        pair.x = pair.x - 2;

        if (pipes.hasCollisionFlapp(pair)) {
          soundColision.play();
          changeScreen(gameScreens.GAMEOVER);
          return;
        }

        if (pair.x + pipes.width <= 0) {
          pipes.pairs.shift();
          if (global.score.punctuation != null){
            global.score.punctuation += 1;
            if (global.score.punctuation > maxScore) {
              maxScore = global.score.punctuation;
            }
  
          }

          
        }
      })
    }
  }
  return pipes;
} 

let activeScreen = {};
const global = {};

function changeScreen(novaTela) {
    activeScreen = novaTela;

    if (activeScreen.initialize) { activeScreen.initialize(); }
};

function createScore() {
  const score = {
    punctuation: 0,
    draw() {
      context.font = '35px "VT323"';
      context.fillStyle = '#fff';
      context.textAlign = 'right';
      context.fillText(`${score.punctuation}`, canvas.width - 35, 35);
    },
    update() {
    }
  }
  return score;
}

function createFinalScore() {
  const finalScore = {
    draw() {
      context.font = '20px "VT323"';
      context.fillStyle = '#d7a84c';
      context.textAlign = 'right';
      context.fillText(`${global.score.punctuation}`,  canvas.width - 75, 145);
      context.fillText(`${maxScore}`, canvas.width - 75, 185);
    },
    update() {
    }
  }
  return finalScore;
}



const gameScreens = {
  HOME: {
    initialize() {
      global.flappyBird =  createFlappyBird();
      global.pipes = createPipes();
      global.floor = createGround();
    },
    draw() {
      background.draw();
      global.flappyBird.draw();
      global.floor.draw();
      homScreen.draw();
    },
    click() { changeScreen(gameScreens.GAME); },
    update() { global.floor.update(); }
  },

  GAME: {
    initialize() { global.score = createScore(); },
    draw() {
      background.draw();
      global.flappyBird.draw();
      global.pipes.draw();
      global.floor.draw();
      global.score.draw();
    },
    click() { global.flappyBird.pula(); },
    update() {
      global.flappyBird.update();
      global.pipes.update();
      global.floor.update();
      global.score.update();
    }
  },

  GAMEOVER: {
    initialize() {
      global.Medal = createMedal();
      global.FinalScore = createFinalScore();
    },

    draw() {
      gameOver.draw();
      global.Medal.draw();
      global.FinalScore.draw();
    
    },

    update() {
      global.Medal.update();
    },

    click() {  changeScreen(gameScreens.HOME) }
  }
};

function loop() {
  activeScreen.draw();
  activeScreen.update();
  fps = fps + 1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
  if (activeScreen.click) { activeScreen.click(); };
});

changeScreen(gameScreens.HOME)
loop();
