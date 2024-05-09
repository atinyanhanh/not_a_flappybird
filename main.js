class Game{
    constructor(canvas, context){
        this.canvas = canvas;
        this.ctx = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.baseHeight = 720;
        this.ratio = this.height/this.baseHeight;
        this.background = new Background(this);
        this.obstacles = [];
        this.numberOfObstacles = 10;
        this.player = new Player(this);
        this.gravity;
        this.speed;
        this.minSpeed;
        this.maxSpeed;
        this.gameOver;
        this.timer;
        this.message1;
        this.message2;
        this.barSize;


        this.resize(window.innerWidth, window.innerHeight);

//--------------------------------------------------------------------------------------------------------------------------    
    // resize the canvas as we resize the window
        window.addEventListener("resize", e => {
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
        });
        // mouse controls
        this.canvas.addEventListener("mousedown", e => {
            this.player.flap(); 
        });
        // keyboard controls
        window.addEventListener("keydown", e => {
            console.log(e.key);
            if (e.key === " ") {
                this.player.flap();
            }
            if (e.key === "Shift" || e.key.toLowerCase() === "c") {
                this.player.startCharge();
            }
        });
}
//--------------------------------------------------------------------------------------------------------------------------
    
    // scale all variables as changing screen size
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.ctx.font = '15px Bungee';
        this.ctx.textAlign = 'right';
        this.ctx.lineWidth = 3;
        this.ctx.strokeStyle = 'white';
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ratio = this.height/this.baseHeight;
        
        this.gravity = 0.15 * this.ratio;
        this.speed = 2*this.ratio;
        this.minSpeed = this.speed;
        this.maxSpeed = this.speed * 5;
        this.background.resize();
        this.player.resize();
        this.createObstacles();
        this.obstacles.forEach(obstacles => {
            obstacles.resize();
        });
        this.score = 0;
        this.gameOver = false;
        this.timer = 0;
    
    }
    render(deltaTime){
        if(!this.gameOver) this.timer += deltaTime;
        this.background.update();
        this.background.draw();
        this.drawStatusText();
        this.player.update();
        this.player.draw();
        this.obstacles.forEach(obstacles => {
            obstacles.update();
            obstacles.draw();
        })

    }

    createObstacles(){
        this.obstacles = [];
        const firstX = this.baseHeight * this.ratio;
        const obstacleSpacing = 600 * this.ratio;
        for (let i = 0; i<this.numberOfObstacles; i++){
            this.obstacles.push(new Obstacle(this, firstX + i * obstacleSpacing));
        }
    }
    checkCollision(a, b){
        const dx = a.collisionX - b.collisionX;
        const dy = a.collisionY - b.collisionY;
        const distance = Math.hypot(dx, dy);
        const sumOfRadii = a.collisionRadius + b.collisionRadius;
        return distance <= sumOfRadii;
    }
    formatTimer(){
        return (this.timer* 0.001).toFixed(1)
    }

    drawStatusText(){
        this.ctx.save();
        this.ctx.fillText("Score: "+ this.score, this.width - 10 , 30);
        this.ctx.textAlign = 'left';
        this.ctx.fillText("Timer: "+ this.formatTimer() , 10 , 30);
        if(this.gameOver){
            if(this.player.collided){
                this.message1 = "Getting rusty?";
                this.message2 = "Collision time " + this.formatTimer() + " seconds";
            }else if(this.obstacles.length <=0){
                this.message1 = "You nailed it!";
                this.message2 = "Can you do it faster than " + this.formatTimer() + " seconds?";
            }
            this.ctx.textAlign = 'center';
            this.ctx.font = '50px Bungee';
            this.ctx.fillText(this.message1, this.width*0.5, this.height*0.5 -40);
            this.ctx.font = '15px Bungee';
            this.ctx.fillText(this.message2, this.width*0.5, this.height*0.5 -20);
            this.ctx.fillText("Press 'R' to try again!", this.width*0.5, this.height*0.5);
        }
        if(this.player.energy <= 20) this.ctx.fillStyle = 'red';
        else if(this.player.energy >= this.player.maxEnergy) this.ctx.fillStyle = 'green';
        for (let i = 0; i < this.player.energy; i++){
            this.ctx.fillRect(10, this.height - 10 - i*this.player.barSize, this.player.barSize, this.player.barSize);
        }
        
        
        this.ctx.restore();
       }
    }

//--------------------------------------------------------------------------------------------------------------------------

window.addEventListener("load", function(){
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 720;
    canvas.height = 720;

    const game = new Game(canvas, ctx);
    
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(deltaTime);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});