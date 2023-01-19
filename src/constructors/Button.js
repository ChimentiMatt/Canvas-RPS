class Button {
  constructor(xLocation, name, ctx) {
    this.xLocation = xLocation;
    this.yLocation = 700;
    this.width = 100;
    this.height = 50;
    this.name = name;
    this.ctx = ctx;
    this.textHeight = 70;
    this.text = '';
  }

  draw = function() {
    if (this.name === 'rock') this.text = '👊';
    else if (this.name === 'paper') this.text = '📝';
    else if (this.name === 'scissors') this.text = '✂️';

    this.ctx.font = `${this.textHeight}px Arial`;
    this.ctx.fillText(this.text, this.xLocation, this.yLocation + this.textHeight  , this.width, this.height);
  }


  mouseCheck = function(mouseX, mouseY) {
    if (mouseX >= this.xLocation && mouseX <= this.xLocation + this.width)
       if (mouseY >= this.yLocation && mouseY <= this.yLocation + this.height + this.textHeight) {
        return this.name;
    }
    return false;
  }
  
  toCreatePayload () {
    return {
      name: this.name
    }
  }
}

export default Button