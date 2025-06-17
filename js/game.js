// Main game logic and state management

// Game state
let gameState = {
  board: [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
  ],
  currentPlayer: 'X',
  gameActive: true,
  winner: null,
  isComputerTurn: false
};

// DOM elements
const gameGrid = document.getElementById('gameGrid');
const gameStatus = document.getElementById('gameStatus');
const resetBtn = document.getElementById('resetBtn');
const restartBtn = document.getElementById('restartBtn');
const cells = document.querySelectorAll('.cell');

// Initialize the game
function initGame() {
  // Add event listeners to cells
  cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
    cell.addEventListener('mouseenter', handleCellHover);
    cell.addEventListener('mouseleave', handleCellLeave);
  });
  // Add reset button listener
  resetBtn.addEventListener('click', resetGame);
  // Add restart button listener
  restartBtn.addEventListener('click', restartGame);

  // Initialize button visibility
  restartBtn.style.display = 'inline-block';
  resetBtn.style.display = 'none';

  // Start the game
  updateGameStatus('Your turn');
}

// Handle cell click events
async function handleCellClick(event) {
  if (!gameState.gameActive || gameState.isComputerTurn) {
    return;
  }

  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  // Check if move is valid
  if (!isValidMove(gameState.board, row, col)) {
    return;
  }

  // Make player move
  makeMove(row, col, 'X');
    
  // Check game state after player move
  if (checkGameEnd()) {
    return;
  }

  // Computer's turn
  gameState.isComputerTurn = true;
  updateGameStatus('Computer is thinking...');
    
  // Add delay for better UX
  await delay(300);
    
  // Get computer move and execute it
  const computerMove = getBestMove(gameState.board);
  if (computerMove) {
    makeMove(computerMove.row, computerMove.col, 'O');
    checkGameEnd();
  }
    
  gameState.isComputerTurn = false;
  if (gameState.gameActive) {
    updateGameStatus('Your turn');
  }
}

// Handle cell hover for preview effect
function handleCellHover(event) {
  if (!gameState.gameActive || gameState.isComputerTurn) {
    return;
  }

  const cell = event.target;
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  // Only show preview on empty cells
  if (isValidMove(gameState.board, row, col)) {
    cell.classList.add('hover-preview');
  }
}

// Handle cell leave to remove preview
function handleCellLeave(event) {
  const cell = event.target;
  cell.classList.remove('hover-preview');
}

// Make a move on the board
function makeMove(row, col, player) {
  // Update game state
  gameState.board[row][col] = player;
    
  // Update UI
  const cellElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
  cellElement.textContent = player;
  cellElement.classList.add('occupied', player.toLowerCase());
    
  // Switch current player
  gameState.currentPlayer = player === 'X' ? 'O' : 'X';
}

// Check if game has ended
function checkGameEnd() {
  const result = checkWinner(gameState.board);
    
  if (result) {
    // We have a winner
    gameState.winner = result.winner;
    gameState.gameActive = false;
        
    // Highlight winning cells
    result.winningCells.forEach(([row, col]) => {
      const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
      cell.classList.add('winning');
    });
        
    // Update status and show reset button
    const winnerText = result.winner === 'X' ? 'You win!' : 'Computer wins!';
    updateGameStatus(winnerText);
    showResetButton();
        
    // Add game-over class to prevent hover effects
    gameGrid.classList.add('game-over');
        
    return true;
  } else if (isBoardFull(gameState.board)) {
    // It's a draw
    gameState.winner = 'draw';
    gameState.gameActive = false;
    updateGameStatus("It's a draw!");
    showResetButton();
    gameGrid.classList.add('game-over');
    return true;
  }
    
  return false;
}

// Update game status display
function updateGameStatus(message) {
  gameStatus.textContent = message;
}

// Show reset button and hide restart button (game over state)
function showResetButton() {
  resetBtn.style.display = 'inline-block';
  restartBtn.style.display = 'none';
}

// Reset the game
function resetGame() {
  // Reset game state
  gameState = {
    board: [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ],
    currentPlayer: 'X',
    gameActive: true,
    winner: null,
    isComputerTurn: false
  };

  // Reset UI
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('occupied', 'x', 'o', 'winning', 'hover-preview');
  });
  // Reset game container
  gameGrid.classList.remove('game-over');
    
  // Hide reset button, show restart button, and update status
  resetBtn.style.display = 'none';
  restartBtn.style.display = 'inline-block';
  updateGameStatus('Your turn');
}

// Restart the game (can be called anytime during gameplay)
function restartGame() {
  // If computer is thinking, we need to wait or interrupt
  if (gameState.isComputerTurn) {
    gameState.isComputerTurn = false;
  }
  
  // Reset game state
  gameState = {
    board: [
      ['', '', ''],
      ['', '', ''],
      ['', '', '']
    ],
    currentPlayer: 'X',
    gameActive: true,
    winner: null,
    isComputerTurn: false
  };

  // Reset UI
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('occupied', 'x', 'o', 'winning', 'hover-preview');
  });
  // Reset game container
  gameGrid.classList.remove('game-over');
    
  // Hide reset button, show restart button, and update status
  resetBtn.style.display = 'none';
  restartBtn.style.display = 'inline-block';
  updateGameStatus('Your turn');
}

// Keyboard accessibility
document.addEventListener('keydown', (event) => {
  if (!gameState.gameActive || gameState.isComputerTurn) {
    return;
  }

  // Allow keyboard navigation with number keys 1-9
  const keyMap = {
    '1': { row: 2, col: 0 }, '2': { row: 2, col: 1 }, '3': { row: 2, col: 2 },
    '4': { row: 1, col: 0 }, '5': { row: 1, col: 1 }, '6': { row: 1, col: 2 },
    '7': { row: 0, col: 0 }, '8': { row: 0, col: 1 }, '9': { row: 0, col: 2 }
  };

  if (keyMap[event.key]) {
    const { row, col } = keyMap[event.key];
    const cell = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
    if (cell && isValidMove(gameState.board, row, col)) {
      cell.click();
    }
  }

  // Reset game with 'R' key
  if (event.key.toLowerCase() === 'r' && !gameState.gameActive) {
    resetGame();
  }
});

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', initGame);
