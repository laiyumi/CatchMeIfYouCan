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



class Circle{
    constructor(x, y, radius, color){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        // this.direction = "vertical";
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
                if(this.x -= this.radius < 0){
                    this.x -= this.dx;
                } else {
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

        // if(direction == "horizontal"){
        //     if(this.x + this.radius >= canvas.width || this.x - this.radius < 0){
        //         this.dx = -this.dx;
        //     }
        //     if(this.x - this.radius <= 0){
        //         // this.direction = "diagonal";
        //         this.reset();
        //     }
        //     else{
        //         this.x += this.dx;
        //     }
        //  }

        // if(direction == "diagonal"){ //does not work yet.....
        //     if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
        //         this.dx = -this.dx;
        //     }
        //     else if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
        //         this.dy = -this.dy;
        //     }
        
        //     else if (this.x - this.radius <= 0 && this.y - this.radius <= 0) {
        //         this.dx = -this.dx;
        //         this.dy = -this.dy;
        //     }
        
        //     else if (this.x + this.radius >= canvas.width && this.y - this.radius <= 0) {
        //         this.dx = -this.dx;
        //         this.dy = -this.dy;
        //     }
        
        //     else if (this.x - this.radius <= 0 && this.y + this.radius >= canvas.height) {
        //         this.dx = -this.dx;
        //         this.dy = -this.dy;
        //     }
        
        //     else if (this.x + this.radius >= canvas.width && this.y + this.radius >= canvas.height) {
        //         this.dx = -this.dx;
        //         this.dy = -this.dy;
        //     }
        // }

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
targetPoint = new Circle(middleX, middleY, 10, 'black');

// Create the animate function
function animate() {
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);


    leftArea.draw();
    rightArea.draw();
    topArea.draw();
    bottomArea.draw();

    targetPoint.move("right");
    eyePoint.draw();

    console.log("ball position = " + targetPoint.x + " " + targetPoint.y);
    console.log("eye position = " + eyePoint.x + " " + eyePoint.y);



    requestAnimationFrame(animate);
}



function checkIfEyeInArea(eyePoint, area){
    let coordinates = area.getCoordinates();
    if(eyePoint.x >= coordinates.topLeft.x && eyePoint.x <= coordinates.topRight.x && eyePoint.y >= coordinates.topLeft.y && eyePoint.y <= coordinates.bottomLeft.y){
        return true;
    }
    return false;
}

var countdownElement = document.getElementById("countdown");
function startCountdown() {
    var countdown = setInterval(function() {
        console.log(count);
        count--;
    }, 1000);
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



eyePoint = new Circle(400, 400, 30, 'yellow');
targetPoint.draw();
eyePoint.draw();

var count = 5;
// Check if the eye point is in right area
while(checkIfEyeInArea(eyePoint, rightArea)){
    // start counting down for 5 seconds
    startCountdown();
    
}
if(count === 0){
    clearInterval(countdown);
    console.log("Good Job!");
}


// Call the animate function
animate();