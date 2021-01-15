var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var PLAY = 1;
var END = 0;
var gameState = PLAY;

var restart, restart_image;
var gameOver,gameOver_image;

var backGrnd,backGrndImg;


function preload(){

  backGrndImg = loadImage("Desert.jpg");

  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadImage("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  restart_image = loadImage("restart.png")
  gameOver_image = loadImage("gameOver.png")
  
}

function setup() {
 
  createCanvas(displayWidth -20 ,displayHeight -30);


  backGrnd = createSprite(displayWidth/2,camera.position.y+200,500,500);
  backGrnd.addImage("back",backGrndImg);
  backGrnd.scale=5;

  backGrnd.x=backGrnd.width/2
  backGrnd.velocityX = -2


  trex = createSprite(100,500,10,10);

  camera.position.x = trex.position.x+500;
  camera.position.y = trex.position.y;
  
 
  trex.addAnimation("running", trex_running);
  trex.scale = 0.9;
  trex.addAnimation("trex_collided",trex_collided);
  
  ground = createSprite(displayWidth/2 ,camera.position.y+400,displayWidth+1500,10);
  ground.addImage("ground",groundImage);
  ground.scale=2
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  invisibleGround = createSprite(displayWidth/2 ,camera.position.y+400,displayWidth,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  
gameOver = createSprite(camera.x-100,camera.y-100);
restart = createSprite(camera.x-100,camera.y);
gameOver.addImage("gameOver",gameOver_image);
gameOver.scale = 0.9;
restart.addImage("restart",restart_image);
restart.scale = 0.9;
  
gameOver.visible = false;
restart.visible = false;

}

function draw() {
  background(180);
  textSize(25)
  
  
  if(gameState===PLAY){
      
  score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6+3*score/100)
    backGrnd.velocityX = -(3+3*score/1000)
    
  if(keyDown("space")&& trex.y >= camera.position.y+330) {
    trex.velocityY = -15;
  }

  if (backGrnd.x < 0){
    backGrnd.x = backGrnd.width/2;
  }

  trex.velocityY = trex.velocityY + 0.8
  
  if (ground.x < 0){
    ground.x = ground.width/2;
  }
  spawnClouds();
  spawnObstacles();
    
      if(obstaclesGroup.isTouching(trex)){
      gameState = END;
      }
  }
   else if(gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    backGrnd.velocityX = 0
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("trex_collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);


  
  
  if(mousePressedOver(restart)) {
    reset();
  }
   }
  
  trex.collide(invisibleGround);
  drawSprites();
  fill("Gray");
  text("Score: "+ score, 1000,50);

}


function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 100 === 0) {
    var cloud = createSprite(1500,120,40,10);
    cloud.y = Math.round(random(200,400));
    cloud.addImage(cloudImage);
    cloud.scale = 0.9;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 500;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 80 === 0) {
    var obstacle = createSprite(displayWidth/2 +500,camera.position.y+370,displayWidth,10);
    obstacle.velocityX =-(6+3*score/100)
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.8;
    obstacle.lifetime = 500;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}