let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

var window_width = window.innerWidth;
var window_height = window.innerHeight;

canvas.width = window_width;
canvas.height = window_height;

class Circle{
    constructor(x, y, radius, color){
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.direction = "vertical";//starts vertical
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


    autoMove(){
        if(this.direction == "vertical"){
            if(this.y + this.radius >= canvas.height || this.y - this.radius < 0){
                this.dy = -this.dy;
            }
            if(this.y - this.radius <= 0){
                this.direction = "horizontal";
                this.reset();
            }else{
                this.y += this.dy;//makes circle advance up/down
             }
        }
        if(this.direction == "horizontal"){
            if(this.x + this.radius >= canvas.width || this.x - this.radius < 0){
                this.dx = -this.dx;
            }
            if(this.x - this.radius <= 0){
                this.direction = "diagonal";
                this.reset();
            }
            else{
                this.x += this.dx;
            }
         }

        if(this.direction == "diagonal"){ //does not work yet.....
            if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
                this.dx = -this.dx;
            }
            else if (this.y + this.radius >= canvas.height || this.y - this.radius <= 0) {
                this.dy = -this.dy;
            }
        
            else if (this.x - this.radius <= 0 && this.y - this.radius <= 0) {
                this.dx = -this.dx;
                this.dy = -this.dy;
            }
        
            else if (this.x + this.radius >= canvas.width && this.y - this.radius <= 0) {
                this.dx = -this.dx;
                this.dy = -this.dy;
            }
        
            else if (this.x - this.radius <= 0 && this.y + this.radius >= canvas.height) {
                this.dx = -this.dx;
                this.dy = -this.dy;
            }
        
            else if (this.x + this.radius >= canvas.width && this.y + this.radius >= canvas.height) {
                this.dx = -this.dx;
                this.dy = -this.dy;
            }
        }

        this.draw();
        
    }
}


let targetPoint = new Circle(100, 100, 50, 'red');
let eyePoint = new Circle(200, 200, 10, 'black');
targetPoint.draw();
eyePoint.draw();

// add event listener to the mouse move
canvas.addEventListener('mousemove', (event) => {
    let x = event.clientX ;
    let y = event.clientY;

    targetPoint.autoMove();
    // update eye point coordinate based on the mouse position
    eyePoint.update(x, y, "");
    console.log("eye position = " + x + " " + y);
});

// Create the animate function
function animate() {
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    //targetPoint.reset();
    targetPoint.autoMove();
    eyePoint.draw();

    requestAnimationFrame(animate);
}

// Call the animate function
animate();
