var bananaImage, obstacleImage
var obstacleGroup,bananaGroup
var obstacle
var ground, groundImage
var score = 0
var PLAY = 1
var END = 0
var gameState = PLAY 
var gameOver,restart
var count = 0

function preload() {
  monkeyImage = loadAnimation("Monkey_01.png", "Monkey_02.png", "Monkey_03.png", "Monkey_04.png", "Monkey_05.png", "Monkey_06.png", "Monkey_07.png", "Monkey_08.png", "Monkey_09.png", "Monkey_10.png") 

  bananaImage = loadImage("banana.png")
  groundImage = loadImage("jungle.jpg")
  obstacleImage = loadImage("stone.png")
  over = loadImage("download.png")
  restartImage = loadImage("download2.png")
}

function setup() {
  createCanvas(600, 300);

  //Creating Scrolling ground
  ground = createSprite(0, 40);
  ground.addImage("background", groundImage);
  ground.scale = 0.8
  ground.x = ground.width/3;

  //creating player sprite
  monkey = createSprite(50, 240, 20, 50);
  monkey.addAnimation("running", monkeyImage);
  monkey.scale = 0.1;

  //Creating invisible ground to support monkey
  invisibleGround = createSprite(200,280,400,10);
  invisibleGround.visible = false;
  
  restart = createSprite(300,200);
  restart.addImage("restart",restartImage);
  restart.scale = 1.2;
  restart.visible = false;
  
  gameOver = createSprite(300,130);
  gameOver.addImage("gameOver",over);
  gameOver.scale = 1;
  gameOver.visible = false;
  
  //Creating banana and obstacle group
  bananaGroup = new Group();
  obstacleGroup = new Group();  
}

function draw() {
  background(220);

  if(gameState === PLAY) {
    //move the ground
    ground.velocityX = - (4 + 2*score/6);
    
    if (ground.x < 200){
    ground.x = ground.width/2.5;
    }
        
    //jump when the space key is pressed
    if(keyDown("space") && monkey.y >= 220){
      monkey.velocityY = -17 ; 
    }
    
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.8;
    
    if (monkey.isTouching(bananaGroup)) {
      bananaGroup.destroyEach();
      score = score+2;
    }
  
    //spawn food and obstacles
    food();
    stones();
    
    switch(score) {
      case 10: monkey.scale = 0.12;
        break;
      case 20: monkey.scale = 0.14;
        break;
      case 30: monkey.scale = 0.16;
        break;
      case 40: monkey.scale = 0.18;
        break;
      case 50: monkey.scale = 0.2;
        break;
        default:break;
     }
    
    //End the game when monkey is touching the obstacle
    if(obstacleGroup.isTouching(monkey)) {
      count = count+1
      obstacleGroup.destroyEach();
    } 
    
    if(count === 1) {
      monkey.scale = 0.1;
      
    }

    if(count === 2) {
      gameState = END;    
    }
  }
  
  else if(gameState === END) {
    //set velocity of each game object to 0
    ground.velocityX = 0;
    monkey.velocityY = 0;
    obstacleGroup.setVelocityXEach(0);
    bananaGroup.setVelocityXEach(0);
    
    //Destroy each game object
    bananaGroup.destroyEach();
    obstacleGroup.destroyEach();
      
    restart.visible = true;
    gameOver.visible = true;
    monkey.visible = false;
  }
  
  if (mousePressedOver(restart)) {
    reset();
  }
  
  monkey.collide(invisibleGround);
  monkey.debug = true
  console.log(count)

  drawSprites();
  
  //display scores
  stroke("black");
  strokeWeight(3);
  textStyle(BOLD);
  textSize(22);
  fill("white");
  text ("Score: " + score,50,50)
}

function reset() {
  gameState = PLAY;
  
  restart.visible = false;
  gameOver.visible = false;
  monkey.visible = true;
  
  score = 0;
  count = 0;
}

function food() {
  //Code to spawn banana after every 80 frames
  if (frameCount % 140 === 0) {
    var banana = createSprite(600,100);
    banana.addAnimation("banana",bananaImage);
    banana.scale = 0.05;
    banana.velocityX = - (4 + 2*score/6);
    banana.setCollider("rectangle",0,0,banana.width,400);
    
    //Giving random y position to spawn
    banana.y = random(80,170);
    
    //assign lifetime to the variable
    banana.lifetime = 180;
    
    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    
    //add each banana to the group
    bananaGroup.add(banana);
  }
}

function stones() {
  if(frameCount % 180 === 0) {
    obstacle = createSprite(600,250,10,40);
    obstacle.velocityX = - (4 + 2*score/6);
    obstacle.addAnimation("Stone",obstacleImage);
    obstacle.setCollider("circle",0,0,170);
      
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.16;
    obstacle.lifetime = 180;
    
    //add each obstacle to the group
    obstacleGroup.add(obstacle);
  }
}