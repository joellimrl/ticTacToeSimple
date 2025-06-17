/* eslint-disable no-unused-vars */
// Utility functions for the tic-tac-toe game

/**
 * Check if a move is valid
 * @param {Array} board - The game board
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @returns {boolean} - True if move is valid
 */
function isValidMove(board, row, col) {
  return board[row][col] === '';
}

/**
 * Get all available moves on the board
 * @param {Array} board - The game board
 * @returns {Array} - Array of available move objects {row, col}
 */
function getAvailableMoves(board) {
  const moves = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === '') {
        moves.push({ row, col });
      }
    }
  }
  return moves;
}

/**
 * Check for winning condition
 * @param {Array} board - The game board
 * @returns {string|null} - Winner ('X' or 'O') or null
 */
function checkWinner(board) {
  // Define all possible winning combinations
  const winPatterns = [
    // Rows
    [[0,0], [0,1], [0,2]],
    [[1,0], [1,1], [1,2]],
    [[2,0], [2,1], [2,2]],
    // Columns
    [[0,0], [1,0], [2,0]],
    [[0,1], [1,1], [2,1]],
    [[0,2], [1,2], [2,2]],
    // Diagonals
    [[0,0], [1,1], [2,2]],
    [[0,2], [1,1], [2,0]]
  ];

  // Check each winning pattern
  for (const pattern of winPatterns) {
    const [a, b, c] = pattern;
    const cellA = board[a[0]][a[1]];
    const cellB = board[b[0]][b[1]];
    const cellC = board[c[0]][c[1]];

    if (cellA && cellA === cellB && cellB === cellC) {
      return {
        winner: cellA,
        winningCells: pattern
      };
    }
  }
  return null;
}

/**
 * Check if the board is full (draw condition)
 * @param {Array} board - The game board
 * @returns {boolean} - True if board is full
 */
function isBoardFull(board) {
  return getAvailableMoves(board).length === 0;
}

/**
 * Create a deep copy of the board
 * @param {Array} board - The game board
 * @returns {Array} - Deep copy of the board
 */
function cloneBoard(board) {
  return board.map(row => [...row]);
}

/**
 * Get random element from array
 * @param {Array} array - Input array
 * @returns {*} - Random element
 */
function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Delay function for creating pauses
 * @param {number} ms - Milliseconds to delay
 * @returns {Promise} - Promise that resolves after delay
 */
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
