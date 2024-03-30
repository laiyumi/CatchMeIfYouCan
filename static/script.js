let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');

var window_width = window.innerWidth;
var window_height = window.innerHeight;

canvas.width = window_width;
canvas.height = window_height;

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


let targetPoint = new Circle(100, 100, 50, 'red');
let eyePoint = new Circle(200, 200, 10, 'black');
targetPoint.draw();
eyePoint.draw();

// add event listener to the mouse move
canvas.addEventListener('mousemove', (event) => {
    let x = event.clientX ;
    let y = event.clientY;
    // made target point moves
    targetPoint.autoMove();
    // update eye point coordinate based on the mouse position
    eyePoint.update(x, y);
    console.log("eye position = " + x + " " + y);
});

// Create the animate function
function animate() {
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);

    targetPoint.autoMove();
    eyePoint.draw();

    requestAnimationFrame(animate);
}

// Call the animate function
animate();