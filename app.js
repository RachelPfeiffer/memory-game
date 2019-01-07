    let runTime = null;
// A = Model: card names, number of matches, which cards are currently picked, how many stars, how much time since game started, if game is not started, in progress, won, or lost

const Model = {
  icons : ['fa-bomb', 'fa-trophy',
   'fa-phone',
  'fa-camera-retro',  'fa-cloud',
   'fa-truck',  'fa-beer',
   'fa-spinner'],

  matches : 0,

  picked : [],

  stars : 3,

  time: 0,

  moves: 0,

  status : "not started",

  reset : function () {
    this.matches = 0;
    this.stars = 3;
    this.time = 0;
    this.moves = 0;
    this.status = "not started";
  }
}

const Controller = {
  sound : function (src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.style.display = "none";
    this.play = function() {
   this.sound.play();
 };
},

  getCardPics : function () {
    const cardsToCreate = [];
    for (icon of Model.icons) {
      cardsToCreate.push(icon);
      cardsToCreate.push(icon);
    };
    return cardsToCreate;
  },

  getStars : function () {
    return Model.stars;
  },

  getMoves : function () {
    return Model.moves;
  },

  getPicked1 : function () {
    return Model.picked[0];
  },

  getPicked2 :  function () {
    return Model.picked[1];
  },

  updateStars : function () {
    if (Model.moves === 13 || Model.moves === 18 || Model.moves === 23) {
      Model.stars -= 1;
      View.removeStar();
    }
  },

  endMove : function () {
    Model.moves +=1;
    View.updateMoves();
    Controller.updateStars();
    if (Model.moves >= 25) {
      Controller.endGame();
      View.lose();
    };
    if (Model.matches >= 8) {
      Controller.endGame();
      View.win();
    }
  },

  endGame : function () {
    View.endGame();
    Model.reset();
    clearInterval(runTime);
  },

  onClick : function () {

      document.addEventListener('click',  function (e) {
        function countSeconds() {
          Model.time += 1;
          View.updateTime();
        };
        // when you click on a card
        if (e.target.classList.contains('in')) {

          const click = new Controller.sound("sounds/click.mp3");
          click.play();
          // if it's the first click, start the timer.
          if (Model.status === "not started") {
            const backgroundMusic = new Controller.sound('sounds/music.mp3');
            backgroundMusic.play();
              Model.status = "in progress";
              runTime = setInterval(countSeconds, 1000);
            }
          // check if it's open or closed. if closed, open and add value to picked array. if open, close.
          if (e.target.classList.contains('closed')) {
            View.openCard(e);
            Model.picked.push(e.target);
            // now check if there are 2 cards in the picked array.
            if (Model.picked.length === 2) {
              let selectedCards = Model.picked;
              Model.picked = [];
              // if there are, check if they match
              if (selectedCards[0].classList.value === selectedCards[1].classList.value) {
                const matchNoise = new Controller.sound("sounds/bell.mp3");
                matchNoise.play();
                setTimeout(function () {
                  View.onMatch(selectedCards);
                },400)
                Model.matches +=1;
              } else {
                setTimeout(function () {
                  View.onNoMatch(selectedCards);
                },400);
              }
            Controller.endMove();
            }

          } else {
            // if only one card was open, close it and remove it from the picked array.
            View.closeCard(e);
            Model.picked.pop();
          }
        } else if (e.target.classList.contains('again') || e.target.classList.contains("reset")) {
          Controller.endGame();
          View.init();
        }
      })
  }


}
const board = document.querySelector('.board');

const View = {
  init : function () {
    View.createCards();
    let starList = document.querySelector('ul');
    starList.innerHTML = '';
    View.createStars();
    View.shuffleCards();
    View.createTimer();
    View.createMoves();
  },

  createCards : function () {
    for (icon of Controller.getCardPics()) {
      const newCard = document.createElement('div');
      newCard.classList = 'card in fa ' + icon + ' closed';
      board.appendChild(newCard);
    }
  },

  shuffleCards : function () {
    for (let i = board.children.length; i >= 0; i--) {
      board.appendChild(board.children[Math.random()
      * i | 0]);
    }
  },

  createStars :  function () {
    const starsToCreate = Controller.getStars();
    for (i = 0; i < starsToCreate; i++) {
      const starList = document.querySelector('.starlist');
      const newStar = document.createElement('li');
      newStar.classList = 'fa fa-star';
      starList.appendChild(newStar);
  }
},

  createTimer : function () {
    const timer = document.querySelector('.timer');
    timer.innerText = '00:00';
  },

  createMoves : function () {
    const mover = document.querySelector('.moves');
    mover.innerText = 0;
  },

  removeStar : function () {
    const starToRemove = document.querySelector('li');
    starToRemove.parentNode.removeChild(starToRemove);
  },

  openCard : function (e) {
    e.target.classList.remove('closed');
    e.target.classList.add('open');
  },

  closeCard : function (e) {
    e.target.classList.add('closed');
    e.target.classList.remove('open');
  },

  onMatch : function (e) {
    for (card of e) {
      card.classList = "card match";
    }
  },

  onNoMatch : function (e) {
        for (card of e) {
        card.classList.add('closed');
        card.classList.remove('open');
      }
  },

  endGame : function () {
    board.innerHTML = '';

  },

  lose : function () {
    const loseBox = document.createElement('div');
    loseBox.innerHTML = '<h1>Sorry, you lose.</h1><button class="again">Play Again?</button>';
    loseBox.className = "win";
    board.appendChild(loseBox);
  },

  win : function () {
    const loseBox = document.createElement('div');
    const gameTime = document.querySelector('.timer').innerText;
    const mover = document.querySelector('.moves').innerText;
    const stars = document.querySelectorAll('.fa-star').length;
    loseBox.innerHTML = '<h1>You Win!</h1><div class="stats"><span>Your Stats:</span><br></br><span>Moves: '+mover+'</span><br></br><span>Stars: '+stars+'</span><br></br><span>Time: '+ gameTime + '</span></div><button class="again">Play Again?</button>';
    loseBox.className = "win";
    board.appendChild(loseBox);
    const applause = new Controller.sound("sounds/applause.mp3");
    applause.play();
  },

  updateTime : function () {
    let timer = document.querySelector('.timer');
    let formattedTime = ('0' + (Math.floor(Model.time/60)).toString()).slice(-2) + ':' + ('0' + (Model.time % 60).toString()).slice(-2);
    timer.innerText = formattedTime;
  },

  updateMoves : function () {
    const moveSection = document.querySelector('.moves');
    moveSection.innerText = Model.moves;
  }

}
View.init();
Controller.onClick();
