let width = 10;
let numberOfMines = 10;
let numberOfFlags = 0;
let sweepersFlags = numberOfMines;

let tiles = [];
let isGameOver = false;
let time_counter = 0;
let isCounting = false;
let isBoardCreated = false;


const timer = document.querySelector('#timer');
const container = document.querySelector('#container');
const grid = document.querySelector('.grid');
const icon_alive = document.querySelector('#alive');
const icon_dead = document.querySelector('#dead');
const icon_winner = document.querySelector('#winner');
const toolbar_icon = document.querySelector('#toolbar_icon');

// Helpers for directions
const isRightEdge = (i) => (i % width === width - 1);
const isLeftEdge = (i) => (i % width === 0);

const N = (i) => (i - width);
const NE = (i) => (i - width + 1);
const E = (i) => (i + 1);
const SE = (i) => (i + width + 1);
const S = (i) => (i + width);
const SW = (i) => (i + width - 1);
const W = (i) => (i - 1);
const NW = (i) => (i - width - 1);

// Set Timer
let idTimer;

function startTimer() {
  time_counter++;
  if (time_counter < 10) {
    timer.innerText = `00${time_counter}`;
  } else if (time_counter > 9 && time_counter < 100) {
    timer.innerText = `0${time_counter}`;
  } else {
    timer.innerText = `${time_counter}`
  }
}

// Clear Timer
function stopTimer() {
  clearInterval(idTimer);
  time_counter = 0;
}


// Create the board
function createBoard() {

  if (isBoardCreated === true) {
    return;
  }

  isGameOver = false;
  isCounting = false;
  sweepersFlags = numberOfMines;
  numberOfFlags = 0;
  container.style.display = 'flex';
  icon_alive.style.display = 'block';
  icon_winner.style.display = 'none';
  icon_dead.style.display = 'none';
  toolbar_icon.style.display = 'none';
  const classNamesArr = createMines();
  timer.innerText = `000`;

  setFlagCounter();

  for (let i=0; i < width * width; i++) {
    const tile = document.createElement('div');
    tile.setAttribute('id', i);
    tile.classList.add(classNamesArr[i], 'tile');

    grid.appendChild(tile);
    tiles.push(tile);

    // Left Click
    tile.addEventListener('click', function(e) {
      click(tile);
      document.querySelector('#new_game_box').classList.remove('show');
    });
    
    tile.addEventListener('click', () => {
      
      if (!isCounting) {
        idTimer = setInterval(startTimer, 1000);
        isCounting = true;
      }
    })

    // Right Click
    tile.addEventListener('contextmenu', e => {
      e.preventDefault();
      toggleFlag(tile);

       if (!isCounting) {
        idTimer = setInterval(startTimer, 1000);
        isCounting = true;
      }
    });     
  }

  getMinesAround();
  isBoardCreated = true;
  toolbar_icon.style.display = 'flex';
}

// Create mines
function createMines() {
  const mines = Array(numberOfMines).fill('mine');
  const safeTiles = Array(width*width - numberOfMines).fill('empty');

  const shuffledArr = [...mines, ...safeTiles].sort(() => Math.random() -0.5);

  return shuffledArr;
} 

// set flag counter
function setFlagCounter() {
  const flag_counter = document.querySelector('#flag-counter');

  if (sweepersFlags < 10) {
    flag_counter.innerText = `00${sweepersFlags}`;
  } else {
    flag_counter.innerText = `0${sweepersFlags}`;
  }
}

// Check neighbors and set minesAround data-attribute
function getMinesAround() {

  for (let i = 0; i < tiles.length; i++) {
    let minesAround = 0;
    
    if (tiles[i].classList.contains('empty')) {

      // North
      if (i > 9 && tiles[N(i)].classList.contains('mine')) {
        minesAround++;
      }
  
      // North-East
      if (i > 9 && !isRightEdge(i) && tiles[NE(i)].classList.contains('mine') ) {
        minesAround++;
      }
      
      // East 
      if (i > -1 && !isRightEdge(i) && tiles[E(i)].classList.contains('mine')) {
        minesAround++;
      }

      // South-East
      if (i < 89 && !isRightEdge(i) && tiles[SE(i)].classList.contains('mine') ) {
        minesAround++;
      }

      // South
      if (i < 90 && tiles[S(i)].classList.contains('mine')) {
        minesAround++;
      }

      // South-West
      if (i < 90 && !isLeftEdge(i) && tiles[SW(i)].classList.contains('mine')) {
        minesAround++;
      }

      // West
      if (i > 0 && !isLeftEdge(i) && tiles[W(i)].classList.contains('mine')) {
        minesAround++;
      }

      // North-West
      if (i > 10 && !isLeftEdge(i) && tiles[NW(i)].classList.contains('mine')) {
        minesAround++;
      }

      tiles[i].setAttribute('mines', minesAround);
    }
  }
}

// Click functionality
function click(tile) {
  let currentID = +tile.id;

  if (isGameOver) {
    return;
  }
  if (tile.classList.contains('checked') || tile.classList.contains('flag')) {
    return;
  }
  if (tile.classList.contains('mine')) {
    gameOver(tile);
  } else {
    let totalMinesAround = +tile.getAttribute('mines');
    if (totalMinesAround !== 0 && !tile.classList.contains('mine')) {
      tile.classList.add('checked');
      tile.innerText = tile.getAttribute('mines');
      return;
    }
    checkNeighbors(tile, currentID);
  }
  tile.classList.add('checked');
}


// minesAround === 0; check neighbors, reveal them
function checkNeighbors(tile, currentID) {

  setTimeout(() => {
    // North 
    if (currentID > 9) {
      const newID = tiles[N(currentID)].id;
      const newTile = document.getElementById(newID);
      click(newTile);
    }
  
    // North-East
    if (currentID > 9 && !isRightEdge(currentID)) {
      const newID = tiles[NE(currentID)].id;
      const newTile = document.getElementById(newID);
      click(newTile);
    }
  
    // East
    if (currentID > -1 && !isRightEdge(currentID)) {
      const newID = tiles[E(currentID)].id;
      const newTile = document.getElementById(newID);
      click(newTile);
    }
  
    // South-East
    if (currentID < 89 && !isRightEdge(currentID)) {
      const newID = tiles[SE(currentID)].id;
      const newTile = document.getElementById(newID);
      click(newTile);
    }
  
    // South
    if (currentID < 90) {
      const newID = tiles[S(currentID)].id;
      const newTile = document.getElementById(newID);
      click(newTile);
    }
  
    // South-West
    if (currentID < 90 && !isLeftEdge(currentID)) {
      const newID = tiles[SW(currentID)].id;
      const newTile = document.getElementById(newID);
      click(newTile);
    }
  
    // West
    if (currentID > 0 && !isLeftEdge(currentID)) {
      const newID = tiles[W(currentID)].id;
      const newTile = document.getElementById(newID);
      click(newTile);
    }
  
    // North-West
    if (currentID > 10 && !isLeftEdge(currentID)) {
      const newID = tiles[NW(currentID)].id;
      const newTile = document.getElementById(newID);
      click(newTile);
    }
  }, 10);
}


// Game Over
function gameOver(tile) {
  isGameOver = true;
  stopTimer();

  tile.innerHTML = '<i class="fas fa-virus"></i>';
  tile.style.backgroundColor = 'red';
  tiles.forEach(tile => {
    if (tile.classList.contains('mine')) {
      tile.classList.add('checked');
      tile.innerHTML = '<i class="fas fa-virus"></i>';
    }
  });

  icon_alive.style.display = 'none';
  icon_dead.style.display = 'block';
}

// Check for win
function checkForWin() {
  let matches = 0;

  for (let i = 0; i < tiles.length; i++) {
    if (tiles[i].classList.contains('flag') && tiles[i].classList.contains('mine')) {
      matches++;
    }
  }

  if (matches === numberOfMines) {
    isGameOver = true;
    stopTimer();
    icon_alive.style.display = 'none';
    icon_winner.style.display = 'block';
  }
}


// Toggle flag on right click
function toggleFlag(tile) {

  if (tile.classList.contains('checked') || isGameOver) return;

  if (!tile.classList.contains('checked') && (numberOfFlags < numberOfMines + 1)) {
    if (!tile.classList.contains('flag')) {
      if (sweepersFlags === 0) return;

      tile.classList.add('flag');
      tile.innerText = '🚩';
      numberOfFlags++;
      sweepersFlags--;
      checkForWin();
      setFlagCounter();
    } else {
      tile.classList.remove('flag');
      tile.innerText = '';
      numberOfFlags--;
      sweepersFlags++;
      setFlagCounter();
  
    }
  }
}

// Clean Board
function cleanBoard() {
  grid.innerHTML = '';
  tiles = [];
  isBoardCreated = false;
  stopTimer();
}

// Date & Time
function startClock() {
  const today = new Date();
  let hr = today.getHours();
  let min = today.getMinutes();

  min = checkTime(min);

  document.querySelector('#time').innerHTML = `${hr}:${min}`;


  let day = today.getUTCDate();
  let month = today.getMonth() + 1;
  let year = today.getFullYear();

  day = checkTime(day);
  month = checkTime(month);

  document.querySelector('#date').innerHTML = `${day}/${month}/${year}`;

  setTimeout(startClock, 1000);
}

function checkTime(i) {
  if (i < 10) {
    i = `0${i}`;
  }
  return i;
}

startClock()

// Event Listeners
  // Restart game
document.body.addEventListener('click', (e) => {
  if (e.target.id == 'dead') {
    cleanBoard();
    createBoard();
  }
});

document.body.addEventListener('click', (e) => {
  if (e.target.id == 'alive') {
    cleanBoard();
    createBoard();
  }
});

icon_winner.addEventListener('click', function() {
  cleanBoard();
  createBoard();
})

document.querySelector('#btn_new_game').addEventListener('click', function() {
  cleanBoard();
  createBoard();
  document.querySelector('#new_game_box').classList.remove('show');
})


// Back to Game 
document.querySelector('#btn_back_to_game').addEventListener('click', function() {
  document.querySelector('#new_game_box').classList.remove('show');
})

// Close Game with button
document.body.addEventListener('click', (e) => {
  if (e.target.id == 'btn_close' || e.target.id == 'btn_close_game' || e.target.id == 'close') {
    container.style.display = 'none';
    toolbar_icon.style.display = 'none';
    document.querySelector('#new_game_box').classList.remove('show');
    cleanBoard();
  }
})

// Minimize game-container
document.querySelector('#btn_minimize').addEventListener('click', function() {
  container.classList.add('minimized');
  toolbar_icon.style.display = 'flex';
  toolbar_icon.classList.add('tile');
  toolbar_icon.classList.remove('pool');
})

// Maximize game-container
toolbar_icon.addEventListener('click', function() {
  container.classList.remove('minimized');
  toolbar_icon.classList.remove('tile');
  toolbar_icon.classList.add('pool');
})

// Open container with stater icon 
document.querySelector('#starter_icon').addEventListener('dblclick', function() {
  createBoard();
  container.style.display = 'flex';
})

// Show rules
const rule_box = document.querySelector('#rule_box');

document.querySelector('#btn_rule').addEventListener('click', function() {
  rule_box.classList.add('show');
})

// Hide rules
document.querySelector('#btn_close_rules').addEventListener('click', function() {
  rule_box.classList.remove('show');
})

// Toggle Game options
document.querySelector('#btn_game').addEventListener('click', function() {
  document.querySelector('#new_game_box').classList.toggle('show');
})




