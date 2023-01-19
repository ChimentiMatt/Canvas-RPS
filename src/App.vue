<template>
  <div id='control-panel'>
    <div>
      <label name='rounds'>Select the number of rounds</label>
      <br/> 
      <input type='number' v-model='totalRounds'/>
      <button @click='updateTotalRounds'>Submit</button>
    </div>

    <div id='current-scores'>
      <h1>Current Scores</h1>  
      <p>Wins</p>
      <p>Human: {{this.outcomes.human.wins}} </p>
      <p>Computer: {{this.outcomes.computer.wins}} </p>
      <p>Ties: {{this.outcomes.tie}}</p>
    </div>
    
    <h3>Running Totals</h3>

    <br/> 

    <p>Computer</p> 
    <p>Rounds Won: {{this.outcomes.computer.roundsWon}}</p>
    <p>Rounds Lost: {{this.outcomes.computer.roundsLost}}</p>
    <p>Total Wins: {{this.outcomes.computer.totalWins}}</p>
    <p>Total Losses: {{this.outcomes.computer.totalLosses}}</p>

    <br/> 

    <p>Human</p> 
    <p>Rounds Won: {{this.outcomes.human.roundsWon}}</p>
    <p>Rounds Lost: {{this.outcomes.human.roundsLost}}</p>
    <p>Total Wins: {{this.outcomes.human.totalWins}}</p>
    <p>Total Losses: {{this.outcomes.human.totalLosses}}</p>

  </div>
  <canvas></canvas>
</template>

<script>
import Button from './constructors/Button'
import RPS from './constructors/RPS'

export default {
  name: 'App',

  data () {
    return {
      canvas: {},
      ctx: {},
      buttons: [],
      animations: [],
      mouseX: 0,
      mouseY: 0,
      selection: '',
      computerSelection: '',
      message: '',
      outcomes: 
        {
          computer: {wins: 0, losses:0, roundsWon: 0, roundsLost: 0, totalWins: 0, totalLosses: 0}, 
          human: {wins: 0, losses:0,  roundsWon: 0, roundsLost: 0, totalWins: 0, totalLosses: 0}, 
          tie: 0
        },
      round : 0,
      totalRounds: 5,
      winner: '',
      turnWinner: '',
      playAgainPrompt: false,
      myReq: {},
    }
  },

  methods: {
    updateTotalRounds(){
      this.clearMessages();
      this.roundMessage();
    },

    createCanvas() {
      this.canvas = document.querySelector('canvas');
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      this.ctx = this.canvas.getContext('2d');
    },

    drawText() {
      this.ctx.font = '70px Arial';
      const text = 'Rock Paper Scissors';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(text, (this.canvas.width / 2) - (this.ctx.measureText(text).width /2), 100);
    },

    drawButtons() {
      const buttonWidth = 100;
      const xPositionOffset = 200;
      const names = ['rock', 'paper', 'scissors'];
      let xLocation =  (window.innerWidth  / 2) - xPositionOffset - (buttonWidth * 0.5);

      for (let i = 0; i < 3; i++){
        const buttonObject =  new Button(xLocation, names[i], this.ctx);
        this.buttons.push(buttonObject);
        this.buttons[i].draw();
        xLocation += xPositionOffset;
      }
    },

    computerChoice() {
      const options = ['rock', 'paper', 'scissors']
      this.computerSelection = options[Math.floor(Math.random() * (2 - 0 + 1) + 0)]
    },

    clickRPS() {
   
      // !this.playAgainPrompt stops selection of RPS after round
      if (!this.playAgainPrompt){
        for (let i = 0; i < 3; i++){
          const btnChecks = this.buttons[i].mouseCheck(this.mouseX, this.mouseY);
          
          if (btnChecks){
            this.selection = btnChecks;
            this.animationLogic();
          }
        }
      }
    },

    clickPlayAgain() {
      const buttonY = 430;
      const buttonHeight = 100;
      const buttonWidth = 275;

      if (this.playAgainPrompt){
         if (this.mouseX >= ((this.canvas.width / 2) - (this.ctx.measureText(`Play Again?`).width /2)) - 10 && this.mouseX <= (this.canvas.width / 2) - (this.ctx.measureText(`Play Again?`).width /2) +  buttonWidth -10 &&
          this.mouseY >= buttonY &&  this.mouseY <= buttonY + buttonHeight){
            this.resetGame();
         }
      }
    },

    resetGame() {
      this.outcomes.human.wins = 0;
      this.outcomes.tie = 0;
      this.outcomes.computer.wins = 0;
      this.outcomes.tie = 0;
      this.round = 0;
      this.clearMessages();
      this.roundMessage();
    },

    gameLogic() {
      this.computerChoice()

      if (this.selection === this.computerSelection) {
        this.message = 'Tie' ;
        this.outcomes.tie += 1;
        this.turnWinner = 'tie';
      }
      else if (this.selection === 'rock'){
        if (this.computerSelection === 'paper') {
          this.turnWinner = 'computer';
          this.message ='You lose this round: Paper beats Rock';;
          this.outcomes.computer.wins += 1;
          this.outcomes.computer.totalWins += 1;
          this.outcomes.human.losses += 1;
          this.outcomes.human.totalLosses += 1;
        }
        else  {
          this.turnWinner = 'human';
          this.message ='You win this round: Rock beats Scissors';
          this.outcomes.human.wins += 1;
          this.outcomes.human.totalWins += 1;
          this.outcomes.computer.losses += 1;
          this.outcomes.computer.totalLosses += 1;
        }
      }
      else if (this.selection === 'paper'){
        if (this.computerSelection === 'scissors') {
          this.turnWinner = 'computer';
          this.message = 'You lose this round: Scissors beats Paper';
          this.outcomes.computer.wins += 1;
          this.outcomes.computer.totalWins += 1;
          this.outcomes.human.losses += 1;
          this.outcomes.human.totalLosses += 1;
        }
        else {
          this.turnWinner = 'human';
          this.message ='You win this round: Paper beats Rock';
          this.outcomes.human.wins += 1;
          this.outcomes.human.totalWins += 1;
          this.outcomes.computer.losses += 1;
          this.outcomes.computer.totalLosses += 1;
        }
      }
      else if (this.selection === 'scissors'){
        if (this.computerSelection === 'rock') {
          this.turnWinner = 'computer';
          this.message = 'You lose this round: Rock beats Scissors';
          this.outcomes.computer.wins += 1;
          this.outcomes.computer.totalWins += 1;
          this.outcomes.human.losses += 1;
          this.outcomes.human.totalLosses += 1;
        }
        else {
          this.turnWinner = 'human';
          this.message ='You win this round: Scissors beats Paper';
          this.outcomes.human.wins += 1;
          this.outcomes.human.totalWins += 1;
          this.outcomes.computer.losses += 1;
          this.outcomes.computer.totalLosses += 1;
        }
      }
    },

    animationLogic() {
      this.gameLogic();

      /**
      * Separated conditionals from gameLogic to 
      * stop animations for interfering from the log
      */
      if (this.selection === this.computerSelection) {
        this.drawRPS('tie', 'tie');
      }
      else if (this.selection === 'rock'){
        if (this.computerSelection === 'paper') {
          this.drawRPS('rock', 'paper');
        }
        else  {
          this.drawRPS('rock', 'paper');
        }
      }
      else if (this.selection === 'paper'){
        if (this.computerSelection === 'scissors') {
          this.drawRPS('paper', 'scissors');
        }
        else {
          this.drawRPS('paper', 'scissors');
        }
      }
      else if (this.selection === 'scissors'){
        if (this.computerSelection === 'rock') {
          this.drawRPS('scissors', 'rock');
        }
        else {
          this.drawRPS('scissors', 'rock');
        }
      }
    },

    gameOverCheck() {
      if (this.round === this.totalRounds){
        if (this.outcomes.human.wins > this.outcomes.computer.wins){
          this.outcomes.human.roundsWon += 1;
          this.outcomes.computer.roundsLost += 1;
          this.winner = 'Human';
          this.clearMessages();
          this.matchWonMessage();
          this.playAgainMessage() ;
        }
        else if (this.outcomes.human.wins < this.outcomes.computer.wins) {
          this.outcomes.computer.roundsWon += 1;
          this.outcomes.human.roundsLost += 1;
          this.winner = 'Computer';
          this.clearMessages();
          this.matchWonMessage();
          this.playAgainMessage();
        }
        else{
          this.winner = 'Tie';
          this.clearMessages();
          this.matchWonMessage();
          this.playAgainMessage();
        }
      }
      else if (this.outcomes.human.wins > this.totalRounds / 2) {
        this.outcomes.human.roundsWon += 1;
        this.outcomes.computer.roundsLost += 1;
        this.winner = 'Human';
        this.clearMessages();
        this.matchWonMessage();
        this.playAgainMessage();
      }
      else if (this.outcomes.computer.wins > this.totalRounds / 2) {
        this.outcomes.computer.roundsWon += 1;
        this.outcomes.human.roundsLost += 1;
        this.winner = 'Computer';
        this.clearMessages();
        this.matchWonMessage();
        this.playAgainMessage();
      }

    },  

    clearMessages() {

      // clear winner message
      this.ctx.fillStyle = '#1a1a1a';
      this.ctx.rect(0 , 300 - 48, this.canvas.width, 48 + 10);
      this.ctx.fill();

      // clear round message
      this.ctx.fillStyle = '#1a1a1a';
      this.ctx.rect(0 , 200 - 48, this.canvas.width, 48 + 10);
      this.ctx.fill();

      if (this.playAgainPrompt){
        this.playAgainPrompt = false;

        // clear play again btn 
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.rect(0, 430, this.canvas.width , 100);
        this.ctx.fill();
      }
    },

    clearRPS() {
      this.ctx.fillStyle = '#1a1a1a';
      this.ctx.rect(0 , 400 , this.canvas.width, 100);
      this.ctx.fill();
    },

    promptMessage() {
      this.ctx.font = '48px Arial';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(`Make your selection`, (this.canvas.width / 2) - (this.ctx.measureText('Make your selection').width /2), 650);
    },

    roundMessage() {
      this.ctx.font = '48px Arial';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(`Round ${this.round +1} of ${this.totalRounds}`, (this.canvas.width / 2) - (this.ctx.measureText(`Round ${this.round +1}  of ${this.totalRounds}`).width /2), 200);
    },

    roundResultsMessage() {
      this.ctx.font = '48px Arial';
      this.ctx.fillStyle = 'white';
      this.ctx.fillText(this.message, (this.canvas.width / 2) - (this.ctx.measureText(this.message).width /2), 300);
    },
    
    matchWonMessage() {
      this.ctx.font = '48px Arial';
      this.ctx.fillStyle = 'white';
      if (this.winner === 'Tie') {
        this.ctx.fillText('Match Over Tie Game', (this.canvas.width / 2) - (this.ctx.measureText('Match Over Tie Game.').width /2), 300);
      }
      else{
        this.ctx.fillText(`Match Over ${this.winner} wins!`, (this.canvas.width / 2) - (this.ctx.measureText(`Match Over ${this.winner} wins`).width /2), 300);
      }
    },

    playAgainMessage() {
      this.playAgainPrompt = true
      this.ctx.fillRect((this.canvas.width / 2) - (this.ctx.measureText(`Play Again?`).width /2) - 10, 430, 275, 100)
      this.ctx.fillStyle = 'black';
      this.ctx.fillText(`Play Again?`, (this.canvas.width / 2) - (this.ctx.measureText(`Play Again?`).width /2), 500);

    },

    createRPS() {
      this.animations = []
      const buttonWidth = 100;
      const xLocation1 =  (window.innerWidth  / 2) - 100 - (buttonWidth * 0.5);
      const xLocation2 =  (window.innerWidth  / 2) + 100 - (buttonWidth * 0.5);
      this.animations.push(new RPS(xLocation1, this.ctx));
      this.animations.push(new RPS(xLocation2, this.ctx));
    },

    drawRPS(selection, selection2) {
      const buttonWidth = 100;
      const xLocation1 =  (window.innerWidth  / 2) - 100 - (buttonWidth * 0.5);
      const xLocation2 =  (window.innerWidth  / 2) + 100 - (buttonWidth * 0.5);
      this.animations[0].drawOrigin(selection, xLocation1);
      this.animations[1].drawOrigin(selection2, xLocation2);
      this.animateRPS();
    },

    animateRPS() {
      this.myReq = requestAnimationFrame(this.animateRPS);
      this.clearRPS();
      const animationOver1 = this.animations[0].collideAnimation('human', this.selection, this.canvas.width / 2, this.turnWinner);
      const animationOver2 = this.animations[1].collideAnimation('computer', this.computerSelection, this.canvas.width / 2, this.turnWinner );

      if (animationOver1) {
        cancelAnimationFrame(this.myReq)
        this.stopRPS();
        this.gameOverCheck();
      }
      if (animationOver2) {
        cancelAnimationFrame(this.myReq)
        this.stopRPS();
        this.gameOverCheck();
      }
    },
    
    stopRPS() {
      this.clearMessages();
      this.roundMessage();
      this.roundResultsMessage();

      if (this.message !== 'Tie') this.round += 1
      else this.animations[0].drawTie()
    },

    cursorOnHover() {
      const buttonY = 430;
      const buttonHeight = 100;
      const buttonWidth = 275;
      const btnCheck1 = this.buttons[0].mouseCheck(this.mouseX, this.mouseY);
      const btnCheck2 = this.buttons[1].mouseCheck(this.mouseX, this.mouseY);
      const btnCheck3 = this.buttons[2].mouseCheck(this.mouseX, this.mouseY);
      
      if (btnCheck1 || btnCheck2 || btnCheck3) document.querySelector('canvas').style.cursor = 'pointer';

      // check play again button
      else if (this.playAgainPrompt){
        if (this.playAgainPrompt){
          if (this.mouseX >= ((this.canvas.width / 2) - (this.ctx.measureText(`Play Again?`).width /2)) - 10 && this.mouseX <= (this.canvas.width / 2) - (this.ctx.measureText(`Play Again?`).width /2) +  buttonWidth -10 &&
            this.mouseY >= buttonY &&  this.mouseY <= buttonY + buttonHeight){
              document.querySelector('canvas').style.cursor = 'pointer';
          }
          else document.querySelector('canvas').style.cursor = 'default';
        }
      }
      else document.querySelector('canvas').style.cursor = 'default';

    },

    initialization() {
      this.createCanvas();
      this.drawText();
      this.drawButtons();
      this.promptMessage();
      this.roundMessage();
      this.createRPS();
    },

  },
  mounted(){
    this.initialization();
    
    addEventListener('mousemove', (event) => {
      this.mouseX = event.x;
      this.mouseY = event.y;
      this.cursorOnHover();
    });

    addEventListener('click', () => {
      this.clickRPS();
      this.clickPlayAgain();
    });

    addEventListener('resize', () => {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;

      this.createCanvas();
      this.drawText();
      this.drawButtons();
      this.promptMessage();
      this.roundMessage();
      if (this.playAgainPrompt) this.playAgainMessage();

      /**
      * Update RPS Class Button Locations
      * based on the passed-in tag name
      */
      const buttonWidth = 100;
      const xPositionOffset = 200;
      let xLocation =  (window.innerWidth  / 2) - xPositionOffset - (buttonWidth * 0.5);
      for (let i = 0; i < 3; i++){
        this.buttons[i].xLocation = xLocation
        xLocation += xPositionOffset;
      }
    });
  },
}
</script>

