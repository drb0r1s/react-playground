import snakeFruit1 from "./images/snake-fruit-1.webp";
import snakeFruit2 from "./images/snake-fruit-2.png";
import snakeFruit3 from "./images/snake-fruit-3.png";
import snakeFruit4 from "./images/snake-fruit-4.png";
import snakeFruit5 from "./images/snake-fruit-5.png";

const allFruit = [
    snakeFruit1, snakeFruit2, snakeFruit3,
    snakeFruit4, snakeFruit5
];

let isDarkGreen = false;

export class SnakeIG {
    constructor() {
        this.block = 50;
        this.x = 0;
        this.y = 0;
        this.width = this.block;
        this.height = this.block;
        this.moveX = this.block;
        this.moveY = 0;
        this.snakeLength = -1;
        this.tailPosition = [];
    }

    draw(ctx, canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = "#80ff00";
        ctx.fillRect(this.x, this.y, this.width, this.height);

        for(let i = 0; i < this.tailPosition.length; i++) {
            ctx.fillStyle = isDarkGreen ? "#80ff00" : "#3b991f";
            isDarkGreen = !isDarkGreen;
            ctx.fillRect(this.tailPosition[i].x, this.tailPosition[i].y, this.width, this.height);
        }
    }

    move(canvas) {
        if(this.y < 0) this.y = canvas.height;
        if(this.x > canvas.width) this.x = 0;
        if(this.y > canvas.height) this.y = 0;
        if(this.x < 0) this.x = canvas.width;
        
        this.tailPosition[this.snakeLength] = { x: this.x, y: this.y };

        for(let i = 0; i < this.tailPosition.length - 1; i++) {
            if(
                this.tailPosition[i].x === this.x &&
                this.tailPosition[i].y === this.y
            ) return;
            
            this.tailPosition[i] = this.tailPosition[i + 1];
        }
        
        this.x += this.moveX;
        this.y += this.moveY;
    }
    
    changeDirection(direction) {
        switch(direction) {
            case "ArrowUp":
                this.moveX = 0;
                this.moveY = -this.block;

                break;
            case "ArrowRight":
                this.moveX = this.block;
                this.moveY = 0;
                
                break;
            case "ArrowDown":
                this.moveX = 0;
                this.moveY = this.block;

                break;
            case "ArrowLeft":
                this.moveX = -this.block;
                this.moveY = 0;
                
                break;
            default: console.log("No such key!");
        }
    }

    increase() {
        this.snakeLength++;
    }
}

export class FruitIG {
    constructor(rows, columns) {
        this.block = 50;
        this.x = Math.floor(Math.random() * rows) * this.block;
        this.y = Math.floor(Math.random() * columns) * this.block;
        this.width = this.block;
        this.height = this.block;
        this.newImage = allFruit[Math.floor(Math.random() * allFruit.length)];
    }

    draw(ctx, image) {
        ctx.drawImage(
            image,
            this.x,
            this.y,
            this.width,
            this.height
        );

        image.src = this.newImage;
    }

    redraw(rows, columns, ctx, image) {
        this.x = Math.floor(Math.random() * rows) * this.block;
        this.y = Math.floor(Math.random() * columns) * this.block;
        this.newImage = allFruit[Math.floor(Math.random() * allFruit.length)];

        image.src = "";
        
        ctx.drawImage(
            image,
            this.x,
            this.y,
            this.width,
            this.height
        );

        image.src = this.newImage;
    }
}