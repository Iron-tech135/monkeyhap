var PLAY = 1;
var END = 0;
var gameState = PLAY;

var monkey,monkey_running,monkey_collided;
var ground,invisibleGround,groundImage;
var banana,bananaImage,obstacle,obstacleImage
var FoodGroup,obstacleGroup
var score;

function preload()
{
  monkey_running =              loadAnimation("sprite_0.png","sprite_1.png","sprite_2.png","sprite_3.png","sprite_4.png","sprite_5.png","sprite_6.png","sprite_7.png","sprite_8.png")
  
  monkey_collided = loadImage("sprite_8.png")
  
  bananaImage = loadImage("banana.png");
  obstacleImage = loadImage("obstacle.png");
  
  groundImage = loadImage("ground2.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
  
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
}

function setup() 
{
  createCanvas(600,200);
  
  monkey = createSprite(40,170,20,50);
  monkey.addAnimation("running", monkey_running);
  
  monkey.scale = 0.1; 
  
  ground = createSprite(200,170,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  ground.velocityX = -4
  
  invisibleGround = createSprite(200,190,600,10);
  invisibleGround.visible = false;
  
  bananaGroup = createGroup();
  obstaclesGroup = createGroup();
  
  monkey.setCollider("rectangle",5,5,monkey.width,monkey.height);
  monkey.debug = false;
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
}

function draw() 
{
  background("white");
  
  //displaying score
  text("Survival Time: "+ score,450,30);
  
  monkey.collide(invisibleGround);
  
  if(gameState === PLAY)
  {
    gameOver.visible = false;
    restart.visible = false;

    //scoring
    score = score + Math.round(frameCount/60); 
    
    if (ground.x < 0)
    {
      ground.x = ground.width/2;
    }
     
    //jump when the space key is pressed
    if(keyDown("space")&& monkey.y >= 100) 
    {
      monkey.velocityY = -20;
      jumpSound.play();
    }
    
    //add gravity
    monkey.velocityY = monkey.velocityY + 0.4
  
    //spawn the banana
    spawnBanana();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(monkey))
    {
      gameState = END;
      dieSound.play() 
      monkey.changeImage("collision",monkey_collided);
    }
  }
   else if (gameState === END)
   {
     gameOver.visible = true;
     restart.visible = true;
    
     ground.velocityX = 0;
     monkey.velocityY = 0     
     
     //set lifetime of the game objects so that they are never destroyed
     
     obstaclesGroup.setLifetimeEach(-1);
     bananaGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     bananaGroup.setVelocityXEach(0);    
     
     if(mousePressedOver(restart)) 
     {
       reset();
     }
   }
    
  if(ground.x < 0)
  {
    ground.x = ground.width/2;
  } 
    
  if(keyDown("space"))
  {
    monkey.velocityY = -8
    jumpSound.play();
  }     
    
  monkey.velocityY = monkey.velocityY + 0.8
  
  drawSprites();
}

function spawnObstacles()
{
  if (frameCount % 120 === 0)
  {
    obstacle = createSprite(600,160,20,50);
    obstacle.addImage("obstacle.png", obstacleImage);  
    obstacle.velocityX = -4 
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) 
    {
      case 1: obstacle.addImage(obstacleImage);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle.           
    obstacle.scale = 0.1;
    obstacle.lifetime = 150;
   
    //add each obstacle to the group.
    obstaclesGroup.add(obstacle);
  }  
}

function spawnBanana() 
{
  if (frameCount % 80 === 0) 
  {
    var banana = createSprite(600,100,40,10);
    banana.y = Math.round(random(80,90));
    banana.addImage(bananaImage);
    banana.velocityX = -4;
    
    //assign lifetime to the variable
    banana.scale = 0.1;
    banana.lifetime = 150;
    
    //adjust the depth
    banana.depth = monkey.depth;
    monkey.depth = monkey.depth + 1;
    
    //add each cloud to the group
    bananaGroup.add(banana);
  }
}

function reset()
{
  gameState = PLAY
  gameOver.visible = false
  restart.visible = false
  obstaclesGroup.destroyEach();
  bananaGroup.destroyEach();
  ground.velocityX = -4
  monkey.changeAnimation("running", monkey_running);
  score = 0
}