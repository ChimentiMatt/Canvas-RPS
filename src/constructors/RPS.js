class RPS {
    constructor(xLocation,ctx) {
        this.xLocation = xLocation;
        this.yLocation = 400;
        this.width = 100;
        this.height = 50;
        this.ctx = ctx;
        this.textHeight = 70;
        this.text = '';
        this.collision = false;
        this.animationOver = false;
        this.originalXLocation = xLocation;
    }
  
    drawOrigin = function(selection, xOrigin) {
      this.xLocation = this.originalXLocation;
      if ('rock' === selection) this.text = '👊';
      else if ('paper' === selection)  this.text = '📝';
      else if ('scissors' === selection) this.text = '✂️';
  
      this.ctx.font = `${this.textHeight}px Arial`;
      this.ctx.fillText( this.text, xOrigin, this.yLocation + this.textHeight  , this.width, this.height);
    }
  
    draw = function(selection) {
      if ('rock' === selection) this.text = '👊';
      else if ('paper' === selection)  this.text = '📝';
      else if ('scissors' === selection) this.text = '✂️';
  
      this.ctx.font = `${this.textHeight}px Arial`;
      this.ctx.fillText( this.text, this.xLocation, this.yLocation + this.textHeight  , this.width, this.height);
    }

    drawTie = function() {
      this.ctx.font = `${this.textHeight}px Arial`;
      this.ctx.fillText('👔', (window.innerWidth / 2) - (this.ctx.measureText('👔').width /2), this.yLocation + 70);
    }

    collideAnimation = function(role, selection, middleOfScreen, winner) {
      if (winner === 'tie'){
        this.animationOver = false;
        
        return true;
      }
      else{
        if (role === 'human' && winner === 'computer') {
          this.xLocation -= 25;
          if (this.xLocation <= 0){
            this.animationOver = true;
            this.collision = false;
          }
        }
        else if (role === 'computer' && winner === 'human'){
          this.xLocation += 25;
          if (this.xLocation >= middleOfScreen * 2){
            this.animationOver = true;
            this.collision = false;
          }
        }
        if (this.animationOver) {
          this.animationOver = false;
          return true;
        }
      }
      this.draw(selection);
    }
  
    mouseCheck = function(mouseX, mouseY) {
      if (mouseX >= this.xLocation && mouseX <= this.xLocation + this.width);
         if (mouseY >= this.yLocation && mouseY <= this.yLocation + this.height + this.textHeight) {
          return this.name;
      }
      return false
    }
    
    toCreatePayload() {
      return {
        name: this.name
      }
    }
  }
  
  export default RPS