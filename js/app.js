function init() {//1) initialize the game.
  //a. Make a deck.
const page = document.querySelector('.page');
board = document.createElement('div');
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
  //d. Add 3 stars to the star-list.
const starList = document.querySelector(".starlist");
function createStars() {
const newStar = document.createElement('li');
newStar.classList.add("fa", "fa-star");
starList.appendChild(newStar);
};
createStars();
createStars();
createStars();
starCounter  = (document.querySelectorAll('li')).length;
}

//necessary globals for the rest of the gqme:
let isGameRunning = false;
let timeRunning;
let picked = [];
let moves = 0;
let mover;
let matches = 0;
let timer;
let starCounter;
let board;
let starList;

//2) Run matching functionality.
  //a. On click of card -
document.addEventListener('click', function matchingFunctionality(e) {
    if (e.target.classList.contains("in-game")) {
  //b. If it's the first click:
      if (isGameRunning === false) {
        //  i. start the timer.
        timeRunning = setInterval(countSeconds,1000);
        let seconds = 0;
        function countSeconds() {
          seconds+=1;
          function displayTime() {
            timer = document.querySelector(".timer");
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
  // If 2 cards are already open, do not allow to open any more cards.
  const openCards = document.querySelectorAll(".open");
  if (openCards.length === 2) {
    null;
  } else {
    //otherwise, check if the card is already open.
    if (e.target.classList.contains("open")) {
      //if it's open, this is the second click on the same card and it needs to be closed and removed from picked array.
      e.target.classList.add("closed");
      e.target.classList.remove("open");
      openCardIndex = picked.indexOf(e.target.classList.value);
      picked.splice(openCardIndex, 1);
    } else {
      //if it's closed, open the card and add to picked array.
      e.target.classList.add("open");
      e.target.classList.remove("closed");
      picked.push(e.target.classList.value);
    }
  }
  //We now how 2 open cards. Time to check for a match!
  function checkMatch() {
    if (picked[0] === picked[1]) {
      const onMatch = function() {
        const clickedCards = document.querySelectorAll(".open");
        for (card of clickedCards) {
          card.classList = ("card match");
          console.log(card);
        }
        matches += 1;
      };
      onMatch();
      endMove();
      updateStars();
    } else {
      const notMatch = function() {
        const clickedCards = document.querySelectorAll(".open");
        for (card of clickedCards) {
          card.classList.add("closed");
          card.classList.remove('open');
        }

      };
      notMatch();
      endMove();
      updateStars();
    };
    function endMove() {
      picked = [];
      moves += 1;
      mover.innerText = moves;
      isGameOver();
    }

    function updateStars() {
      if (moves === 16 || moves === 22 || moves === 26) {
        const starToRemove = document.querySelector('li');
        starToRemove.parentNode.removeChild(starToRemove);
        starCounter-=1;
      };
    };
  };
if (picked.length === 2) {
  setTimeout(checkMatch,600);
};

}});
//3) end the game.
const isGameOver = function isGameOver() {
if (matches === 8 || moves === 28) {
  if (matches === 8) {
  youWin();
} else if (moves === 28) {
  youLose();
};
//stop the timer
clearInterval(timeRunning);
};
};
  //a. run modal - win for win and lose for lose. Ask player if they want to play again.
  function youWin() {
    const winBox = document.createElement("div");
    winBox.classList.add("win");
    winBox.innerHTML = "<div><header>You win!</header><p>YOUR STATS <br><br> Moves: " + mover.innerText + " <br> Star Rating: " + starCounter + "<br> Time: " + timer.innerText + "</p><button class=\"button\">Play<br>again?</button></div>";
    board.appendChild(winBox);
  };


    function youLose() {
        const loseBox = document.createElement("div");
        loseBox.classList.add("win");
        loseBox.innerHTML = "<span>You lose.</span><br><button class=\"button\">Play<br>again?</button>";
        board.appendChild(loseBox);
        let cards = document.querySelectorAll('.card');
        for (card of cards) {
          //card.classList.remove = ("inGame");
          card.classList = ("card closed");
    }
  }

//4) reset the game.
//a. picked is 0. moves is 0. matches is 0. timer is 0. remove the board.
function resetGame() {
  picked = [];
  moves = 0;
  mover = document.querySelector('.moves');
  mover.innerText = "";
  seconds = 0;
  timer = document.querySelector('.timer');
  timer.innerText = "00:00";
  matches = 0;
  board.parentElement.removeChild(board);
  starCounter = 0;
  starList = document.querySelector('ul');
  starList.innerHTML = "";
}

const refresh = function() {
  resetGame();
  init();
}

const buttons = document.querySelectorAll('.button');
for (button of buttons) {
  button.addEventListener('click', refresh);
};

init();
