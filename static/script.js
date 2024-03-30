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




window.onload = async function() {

    // start the webgazer tracker
    await webgazer.setGazeListener(function(data, elapsedTime) {
        if (data == null) {
            console.log("fail to track the eye");
            return;
        }
        var xprediction = data.x; //these x coordinates are relative to the viewport
        var yprediction = data.y; //these y coordinates are relative to the viewport
        console.log(elapsedTime); //elapsed time is based on time since begin was called
        console.log("eye prediction = " + xprediction + " " + yprediction);

        // update eye point coordinate based on the webgazer prediction
        eyePoint.update(xprediction, yprediction);
    }).begin();

    webgazer.showVideoPreview(true); //shows all video canvsases
    webgazer.showPredictionPoints(true); //shows a square every 100 milliseconds where current prediction is




};

window.addEventListener('keypress', (event) => {
    if (event.key === 'e') {
        webgazer.pause();
    } else if (event.key === 'r') {
        webgazer.resume();
    }
});


// add event listener to the mouse move
// canvas.addEventListener('mousemove', (event) => {
//     let x = event.clientX ;
//     let y = event.clientY;
//     // made target point moves
//     targetPoint.autoMove();
//     // update eye point coordinate based on the mouse position
//     eyePoint.update(x, y);
//     console.log("eye position = " + x + " " + y);

// });


class Circle{
    constructor(x, y, radius, color){
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.dx = 2;
        this.dy = 2;
    }

    draw(){
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI); 
        context.fillStyle = this.color;
        context.fill();
    }

    update(x,y){
        this.x = x;
        this.y = y;
        this.draw();
    }

    autoMove(){
        if(this.x + this.radius > canvas.width || this.x - this.radius < 0){
            this.dx = -this.dx;
        }
        if(this.y + this.radius > canvas.height || this.y - this.radius < 0){
            this.dy = -this.dy;
        }
        this.x += this.dx;
        this.y += this.dy;
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

// Create the animate function
function animate() {
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    targetPoint.autoMove();
    eyePoint.draw();
    leftArea.draw();
    rightArea.draw();
    topArea.draw();
    bottomArea.draw();


    console.log("ball position = " + targetPoint.x + " " + targetPoint.y);
    console.log("eye position = " + eyePoint.x + " " + eyePoint.y);

    let distance = calDistance(eyePoint, targetPoint);
    let validDistance = 10;
    if(distance < validDistance){
        console.log("good job!");
    } else {
        console.log("try again!");
    }

    requestAnimationFrame(animate);
}

// calculate the distance of the eye point to the target point
function calDistance(eyePoint, targetPoint){
    let x = eyePoint.x - targetPoint.x;
    let y = eyePoint.y - targetPoint.y;
    return Math.sqrt(x*x + y*y);
}





// set the start point
var middleX = window.innerWidth / 2;
var middleY = window.innerHeight / 2;
targetPoint = new Circle(middleX, middleY, 10, 'black');


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



eyePoint = new Circle(400, 400, 30, 'yellow');
targetPoint.draw();
eyePoint.draw();

// Call the animate function
animate();


