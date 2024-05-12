class Game{
    constructor(canvas, context){
        this.canvas = canvas;
        this.ctx = context;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.baseHeight = 720;
        this.ratio = this.height/this.baseHeight;
        this.background = new Background(this);
        this.player = new Player(this);
        this.gravity;
        this.speed;

        this.resize(window.innerWidth, window.innerHeight);

    // resize the canvas as we resize the window
        window.addEventListener("resize", e => {
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight);
        });
        // mouse controls
        this.canvas.addEventListener("mousedown", e => {
            console.log(e);
            this.player.flap(); 
        });
        // keyboard controls
        this.canvas.addEventListener("keydown", e => {
            console.log(e.key);
            if(e.key === " "|| e.key==="Enter"){
                this.player.flap();
            }
    });
}
//--------------------------------------------------------------------------------------------------------------------------
    
    // scale all variables as changing screen size
    resize(width, height){
        this.canvas.width = width;
        this.canvas.height = height;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ratio = this.height/this.baseHeight;
        
        this.gravity = 0.5 * this.ratio;
        this.speed = 2*this.ratio;
        this.background.resize();
        this.player.resize();
    
    }
    render(){
        this.background.update();
        this.background.draw();
        this.player.update();
        this.player.draw();
    }
}
//--------------------------------------------------------------------------------------------------------------------------

window.addEventListener("load", function(){
    const canvas = document.getElementById("canvas1");
    const ctx = canvas.getContext("2d");
    canvas.width = 720;
    canvas.height = 720;

    const game = new Game(canvas, ctx);
    game.render();

    function animate(){
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render();
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});