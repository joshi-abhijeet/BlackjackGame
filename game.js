
let blackjakeGame = {
  you: { scorespam: "#youscore", div: "#youContainer", score: 0 },
  bot: { scorespam: "#botscore", div: "#botContainer", score: 0 },
  cards: ["2", "3", "4", "5", "6", "7", "8", "9","10", "K", "Q", "J", "A"],
  cardsMap: {"2":2, "3":3, "4":4, "5":5, "6":6, "7":7, "8":8, "9":9, "10":10, "K":10, "Q":10, "J":10, "A":[1,11] },
  wins : 0,
  loses :0,
  draws :0,
  turn : false,
  over : false,
};

const YOU = blackjakeGame['you']
const BOT = blackjakeGame['bot']

const hitSound = new Audio('sounds/swish.m4a');
const winSound = new Audio('sounds/cash.mp3');
const looseSound = new Audio("sounds/aww.mp3");

document.querySelector('#hitButton').addEventListener("click", blackjack);
document.querySelector('#standButton').addEventListener("click", botLogic);
document.querySelector('#dealButton').addEventListener("click", blackjackDeal);

function blackjack() {
  if (blackjakeGame['turn'] === false) {
    let card = randomCard();
    showCard(card , YOU);
    updateScore(card, YOU);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve,ms));
}

async function botLogic() {
  blackjakeGame["turn"] = true;

  while (BOT["score"] < 18 && blackjakeGame['turn'] === true) {
    let card = randomCard();
    showCard(card, BOT);
    updateScore(card, BOT);
    await sleep(100);
  }
  
  blackjakeGame['over'] = true;
  let result = winnerFunction();
  showResults(result);
}

function randomCard() {
  let randomIndex = Math.floor(Math.random() * 13);
  return blackjakeGame['cards'][randomIndex];
}

function showCard(card, activePlayer) {
  if (activePlayer['score'] <= 21){
    let cardImage = document.createElement("img");
    cardImage.src = `images/${card}.png`;
    document.querySelector(activePlayer["div"]).appendChild(cardImage);
    hitSound.play();
    winSound.play();
  }
}

function  blackjackDeal() {
  if (blackjakeGame['over'] === true) {

    blackjakeGame['turn'] = false;

    let yourImages = document.querySelector('#youContainer').querySelectorAll('img');
    let botImages = document.querySelector("#botContainer").querySelectorAll("img");
    
    for (let i = 0; i < yourImages.length; i++) {
      yourImages[i].remove();
    }
    
    for (let i = 0; i < botImages.length; i++) {
      botImages[i].remove();
    }
    
    YOU['score'] = 0;
    BOT['score'] = 0;
    
    document.querySelector('#youscore').textContent = 0;
    document.querySelector('#botscore').textContent = 0;
    
    document.querySelector("#resultsArea").textContent = 'Lets play';

    blackjakeGame['over'] = false;
  }
}

function updateScore(card , activePlayer) {
  if (card === 'A'){
    if (activePlayer['score'] + blackjakeGame['cardsMap'][card][1] <= 21){
      activePlayer['score'] += blackjakeGame['cardsMap'][card][1]; 
    }else{
      activePlayer['score'] += blackjakeGame['cardsMap'][card][0]; 
    }
  }else{
    activePlayer['score'] += blackjakeGame['cardsMap'][card];
  }
//bust or not
  if (activePlayer['score']> 21){
    document.querySelector(activePlayer['scorespam']).textContent = 'BUST'
  }else{
    document.querySelector(activePlayer['scorespam']).textContent = activePlayer['score']
  }
}

function winnerFunction() {
  let winner ;

  if (YOU['score'] <= 21){
    if (YOU['score'] > BOT['score'] || (BOT['score'] > 21)){
      //you will be the winner
      winner = YOU;
      winSound.play();
      blackjakeGame['wins']++;
    }else if (YOU['score'] < BOT['score']){
      //bot will be the winner
      winner = BOT;
      looseSound.play();
      blackjakeGame['loses']++;
    }else if (YOU['score'] === BOT['score']) {
      //match will be drawn
    blackjakeGame['draws']++;      
    }
  }else if (YOU['score'] > 21 && BOT['score'] <= 21) {
    //bot will the match
    winner = BOT;
    looseSound.play();
    blackjakeGame['loses']++;
  }else if (YOU['score'] >21 && BOT['score'] > 21) {
    //match will be drawn
    blackjakeGame['draws']++;
  }
  return winner;
}

function showResults(winner) {
  if (blackjakeGame['over'] === true) {
    if (winner === YOU) {
      show = 'You won';
      document.querySelector('#win').textContent = blackjakeGame['wins'];
    } else if (winner === BOT) {
      show = "You lost";
      document.querySelector('#loose').textContent = blackjakeGame['loses'];
      
    }else{
      show = "Match Drawn";
      document.querySelector('#draw').textContent = blackjakeGame['draws'];
    }
    
    document.querySelector("#resultsArea").textContent = show;
  }
}
