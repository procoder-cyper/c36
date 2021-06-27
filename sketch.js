var dog, sadDog, happyDog, database;
var foodS, foodStock;
var fedTime, lastFed;
var feed, addFood;
var foodObj;


function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("Feed the dog");
  feed.position(700,120);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,120);
  addFood.mousePressed(addFoods);

  var input = createInput("Rename the Dog");
  var button = createButton("Name");
  var greeting = createElement("h3");

  input.position(900,120);
  button.position(1060,120);
    
  button.mousePressed(function(){
    

    var name = input.value();
    greeting.html("Your Dog's name is now: "+name);
    greeting.position(700,400);
  });
}

function draw() {
  background(46,139,87);
  foodObj.display();

  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
 
  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed : "+ lastFed % 12 + " PM", 350,55);
  }else if(lastFed==0){
     text("Last Feed : 12 AM",350,55);
  }else{
     text("Last Feed : "+ lastFed + " AM", 350,55);
  }
 
  drawSprites();
}

function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS 
  })
}