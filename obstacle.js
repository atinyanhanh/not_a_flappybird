class Obstacle{
    constructor(game, x){
        this.game = game;
        this.spriteWidth = 180;
        this.spriteHeight = 180;
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
        this.x = x;
        this.y = Math.random()* (this.game.height - this.scaledHeight);
        this.collisionX;
        this.collisionY;
        this.collisionRadius = this.scaledWidth*0.4; 
        this.speedY = Math.random() <0.5? -1 * this.game.ratio : 2*this.game.ratio;
        this.markedForDeletion = false;
        this.image = document.getElementById("obstacle");
        this.frameX = Math.floor(Math.random()*4);
    }

    update(){
        this.x -= this.game.speed;
        this.y += this.speedY;
        this.collisionX = this.x + this.scaledWidth*0.5;
        this.collisionY = this.y + this.scaledHeight * 0.5

        if(!this.game.gameOver){ 
            if(this.y <= 0 || this.y >= this.game.height - this.scaledHeight)
            {
                this.speedY *= -1;
            }
        }else{
            if (this.game.audio.mainTheme.paused === false) {
                this.game.audio.mainTheme.pause();
            }
            this.speedY +=2;
        }
       
        if(this.isOffScreen()){
            this.markedForDeletion = true;
            this.game.obstacles = this.game.obstacles.filter(obstacle => !obstacle.markedForDeletion);
            console.log(this.game.obstacles.length);
            this.game.score++;
            if(this.game.obstacles.length <= 0 ) this.game.gameOver = true;
        }
        if (this.game.checkCollision(this.game.player, this)){
            this.game.gameOver = true;
            this.game.player.collided = true;
            this.game.player.stopCharge();
        }

    }
    draw(){
        this.game.ctx.drawImage(this.image, this.frameX * this.spriteWidth, 0, this.spriteWidth, this.spriteHeight, this.x, this.y, this.scaledWidth, this.scaledHeight);
        this.game.ctx.beginPath();
        this.game.ctx.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI*2);
        //this.game.ctx.stroke();
    }
    resize(){
        this.scaledWidth = this.spriteWidth * this.game.ratio;
        this.scaledHeight = this.spriteHeight * this.game.ratio;
    }
    isOffScreen(){
        return this.x < -this.scaledWidth || this.y < -this.scaledHeight;y > this.scaledHeight;
    }
}