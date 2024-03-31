window.saveDataAcrossSessions = false;

let context;
let canvas;
let targetPoint;
let eyePoint;

// set up the canvas
canvas = document.getElementById('canvas');
context = canvas.getContext('2d');

var window_width = window.innerWidth;
var window_height = window.innerHeight;

canvas.width = window_width;
canvas.height = window_height;

// call after the whole page is loaded
window.onload = async function() {
    // start the webgazer tracker
    let bufferX = [];
    let bufferY = [];
    let bufferSize = 4; // Size of the moving window for the moving average, adjust as needed

    await webgazer.setGazeListener(function(data, elapsedTime) {
        if (data === null) {
            console.log("fail to track the eye");
            return;
        }
        
        let xprediction = data.x; 
        let yprediction = data.y; 

        // Update the moving averages.
        bufferX.push(xprediction);
        bufferY.push(yprediction);
        if(bufferX.length > bufferSize) bufferX.shift(); // Remove the oldest value
        if(bufferY.length > bufferSize) bufferY.shift(); // Remove the oldest value

        // Compute smoothed predictions
        let xSmoothed = bufferX.reduce((a, b) => a + b, 0) / bufferX.length;
        let ySmoothed = bufferY.reduce((a, b) => a + b, 0) / bufferY.length;

        // Update the eye coordinates with remediated data
        eyePoint.update(xSmoothed, ySmoothed);

    }).begin();

    // webgazer.setRegression("linear"); 
    webgazer.setTracker("facedetection");

    webgazer.showVideoPreview(true);
    webgazer.showPredictionPoints(true);

    console.log(webgazer.getRegression()) // Confirm current regression model
    console.log(webgazer.getTracker()) // Confirm current tracker model

};

window.addEventListener('keypress', (event) => {
    if (event.key === 'e') {
        webgazer.pause();
    } else if (event.key === 'r') {
        webgazer.resume();
    }
});

class Circle{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = 10;
        this.dy = 10;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        context.fillStyle = `rgb(${this.color.r}, ${this.color.g}, ${this.color.b})`;
        context.fill();
    }

    update(x,y){
        this.x = x;
        this.y = y;
        this.draw();
    }

    reset(){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
    }

    move(direction){
        switch(direction){
            case "down":
                if(this.y + this.radius < canvas.height){
                    this.y += this.dy;
                } else {
                    this.reset();
                }
                break;
            case "up":
                if(this.y - this.radius > 0){
                this.y -= this.dx;
                } else {
                    this.reset();
                }
                break;
            case "left":
                this.x -= this.dx;
                if(this.x - this.radius < 0){
                    this.reset();
                }
                break;
            case "right":
                if(this.x += this.radius < canvas.width){
                    this.x += this.dx;
                } else {    
                    this.reset();
                }
                break;
        }
        this.draw();
        
    }
}

class Area {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    getCoordinates() {
        return {
            topLeft: { x: this.x, y: this.y },
            topRight: { x: this.x + this.width, y: this.y },
            bottomLeft: { x: this.x, y: this.y + this.height },
            bottomRight: { x: this.x + this.width, y: this.y + this.height }
        };
    }
}

// set the start point
var middleX = window.innerWidth / 2;
var middleY = window.innerHeight / 2;

targetPoint = new Circle(middleX, middleY, 10, 'red');
eyePoint = new Circle(300, 300, 30, 'yellow');
targetPoint.draw();
eyePoint.draw();

// Create the animate function
function animate() {
    // clear the canvas before each frame
    context.fillStyle = 'rgba(255, 255, 255)';
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    context.fillStyle = 'rgba(255, 0, 255)';

    // randomly pick one direction to move
    var directions = ["up", "down", "left", "right"];
    var randomDirection = directions[Math.floor(Math.random() * directions.length)];
    targetPoint.move(randomDirection);
    
    eyePoint.draw();
    
    // calcualte the distance between the target point and the eye point
    var distance = Math.sqrt(Math.pow(targetPoint.x - eyePoint.x, 2) + Math.pow(targetPoint.y - eyePoint.y, 2));
    
    // if distance is less than 10, then the target point is reached
    if(distance < 50){
        // reset the target point to the middle
        targetPoint.reset();
        alert("You catched me!");
    }
    requestAnimationFrame(animate);
}

// Define the grid structure
var rows = 5;
var cols = 5;
var cellWidth = canvas.width / cols;
var cellHeight = canvas.height / rows;


// Define the position and dimensions of the specific area
var rowPosition = 3;  // 0-based index
var colPosition = 0;  // starting from the first column
var areaWidthInCells = 2; // width of 2 columns

// Create four areas
var leftArea = new Area(0, 2*cellHeight, 2*cellWidth, cellHeight, 'blue');
var rightArea = new Area(3*cellWidth, 2*cellHeight, 2*cellWidth, cellHeight, 'green');
var topArea = new Area(2*cellWidth, 0, cellWidth, 2*cellHeight, 'red');
var bottomArea = new Area(2*cellWidth, 3*cellHeight, cellWidth, 2*cellHeight, 'yellow');


// Call the animate function
animate();