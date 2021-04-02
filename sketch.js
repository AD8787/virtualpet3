var foodObj;
var foodS, foodStock;
var fedTime, lastFed, feed, addFood;
var bedroom, garden, washroom;

function preload(){
  sadDog = loadImage("images/dogImg.png");
  bedroom = loadImage("virtual pet images/Bed Room.png");
  garden = loadImage("virtual pet images/Garden.png");
  bathroom = loadImage("virtual pet images/Wash Room.png");
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
  database = firebase.database();
  createCanvas(1000, 400);

  foodObj = new Food();

  foodStock = database.ref('Food');
  foodStock.on("value", readStock);

  fedTime = database.ref('FeedTime');
  fedTime.on("value", function (data){
    lastFed = data.val();
  })

  readState = database.ref('gameState');
  readState.on("value", function(data){
    gameState = data.val();
  });

  dog = createSprite(500, 200, 150, 150);
  dog.addImage(sadDog);
  dog.scale = 0.15;
  
  feed = createButton("Feed The Dog");
  feed.position(700, 95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800, 95);
  addFood.mousePressed(addFoods);
}


function draw() {
  currentTime = hour();
  if(currentTime==(lastFed+1)) {
    update("Playing");
    foodObj.garden();
  }
  else if(currentTime==(lastFed+2)) {
    update("Sleeping");
    foodObj.bedroom();
  }
  else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)) {
    update("Bathing");
    foodObj.bathroom()
  }  
  else {
    update("Hungry");
    foodObj.display();
  }

  if(gameState!="Hungry") {
    feed.hide();
    addFood.hide();
    dog.remove();
  }
  else {
    feed.show();
    addFood.show();
    dog.addImage(sadDog);
  }

  drawSprites();

}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog() {
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food: foodObj.getFoodStock(),
    FeedTime : hour(),
    gameState : "Hungry"
  })

}

function addFoods() {
  foodS++;
  database.ref('/').update({
    Food: foodS
  })
}

function update(state) {
  database.ref('/').update({
    gameState: state
  });
}