//1) initialize the game.
  //a. Make a deck.
const page = document.querySelector('.page');
const board = document.createElement('div');
board.classList.add('board');
page.appendChild(board);
  //b. For each icon, make a card. Show cards closed.
const icons = ["fa-bomb","fa-bomb", "fa-trophy", "fa-trophy", "fa-phone",
"fa-phone", "fa-camera-retro", "fa-camera-retro", "fa-cloud", "fa-cloud",
"fa-truck", "fa-truck", "fa-beer", "fa-beer", "fa-spinner", "fa-spinner"];
for (icon of icons) {
  const newCard = document.createElement('div');
  newCard.classList.add("card", "fa", icon, "closed", "in-game");
  board.appendChild(newCard);
};
  //c. Shuffle the cards.
function shuffle() {
    for (let i = board.children.length; i >= 0; i--) {
      board.appendChild(board.children[Math.random() * i | 0]);
    }
  };
shuffle();
let isGameRunning = false;
let timeRunning;
let picked = [];
let moves = 0;
//2) Run matching functionality.
  //a. On click of card -
document.addEventListener('click', function matchingFunctionality(e) {
    if (e.target.classList.contains("in-game")) {
  //b. If it's the first click:
      console.log(e.target);
      if (isGameRunning === false) {
        //  i. start the timer.
        timeRunning = setInterval(countSeconds,1000);
        let seconds = 0;
        function countSeconds() {
          seconds+=1;
          function displayTime() {
            let timer = document.querySelector(".timer");
            let formattedTime = ("0" + (Math.floor(seconds/60)).toString()).slice(-2) + ":" + ("0" + (seconds % 60).toString()).slice(-2);
            timer.innerText = formattedTime;
          };
          displayTime();
        };
        //  ii. start counting the moves.
        mover = document.querySelector(".moves");
        mover.innerText = moves;
        //  iii. flip the "game in progress" switch.
        isGameRunning = true;
      };
  // If 2 cards are already open, do nothing.
  if (picked.length === 2) {
    null;
    //Check if the card is already picked. If it's open, close it and remove from picked array. If it's closed, open it and add it to the picked array.
} else if (e.target.classList.contains("closed")) {
    picked.push(e.target.classList.value);
    console.log(picked);
    e.target.classList.remove("closed");
  } else {
    e.target.classList.add("closed");
    openCardIndex = picked.indexOf(e.target.classList.value);
    picked.splice(openCardIndex, 1);
  };

/*
//  d. Check if another card is open. If it is,
    //  i. STOP EVERYTHING FOR 1 SECOND SO PLAYER CAN SEE IF THERE'S A MATCH!
    //  ii.  check if they match and add a move to the move counter and empty the picked array.
if (picked.length === 2) {
  setTimeout(ifTwoOpen(),800)
  function ifTwoOpen() {
  moves+=1;
  checkMatch();
  picked = [];
};
//  e. On match, add match and change classes to match and take off the event listener by removing the in-game class.
function checkMatch() {
  const openCards = document.querySelectorAll('.open');
  if (picked[0] === picked[1]) {
    matches+=1;
    for (card of openCards) {
      card.classList = ("card match");
    }
  } else {
    //  f. On not match, add class closed and remove class open.
      e.target.classList.add("closed");
      e.target.classList.remove("open");
  }
};
*/}});
//3) end the game.
  //a. run modal - win for win and lose for lose. Ask player if they want to play again.
//  b. make all cards nonfunctional.
//  c. stop timer.
//4) reset the game.
//a. picked is 0. moves is 0. matches is 0. timer is 0. shuffle the cards.
