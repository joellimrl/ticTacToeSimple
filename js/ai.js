/* eslint-disable no-unused-vars */
// AI logic for the computer player (O)

/**
 * Main AI function to determine the best move
 * @param {Array} board - The current game board
 * @returns {Object} - Best move object {row, col}
 */
function getBestMove(board) {
  // Priority 1: Check if AI can win
  const winningMove = findWinningMove(board, 'O');
  if (winningMove) {
    return winningMove;
  }

  // Priority 2: Block player from winning
  const blockingMove = findWinningMove(board, 'X');
  if (blockingMove) {
    return blockingMove;
  }

  // Priority 3: Take center if available
  if (board[1][1] === '') {
    return { row: 1, col: 1 };
  }

  // Priority 4: Take a corner if available
  const corners = [
    { row: 0, col: 0 },
    { row: 0, col: 2 },
    { row: 2, col: 0 },
    { row: 2, col: 2 }
  ];
    
  const availableCorners = corners.filter(corner => 
    board[corner.row][corner.col] === ''
  );
    
  if (availableCorners.length > 0) {
    return getRandomElement(availableCorners);
  }

  // Priority 5: Take any available move
  const availableMoves = getAvailableMoves(board);
  return getRandomElement(availableMoves);
}

/**
 * Find a winning move for the specified player
 * @param {Array} board - The current game board
 * @param {string} player - The player ('X' or 'O')
 * @returns {Object|null} - Winning move object or null
 */
function findWinningMove(board, player) {
  const availableMoves = getAvailableMoves(board);
    
  for (const move of availableMoves) {
    // Create a temporary board with the potential move
    const tempBoard = cloneBoard(board);
    tempBoard[move.row][move.col] = player;
        
    // Check if this move results in a win
    const result = checkWinner(tempBoard);
    if (result && result.winner === player) {
      return move;
    }
  }
    
  return null;
}

/**
 * Advanced AI using minimax algorithm (optional enhancement)
 * @param {Array} board - The current game board
 * @param {number} depth - Current depth in the search tree
 * @param {boolean} isMaximizing - True if maximizing player (AI)
 * @returns {number} - Score for the current board state
 */
function minimax(board, depth, isMaximizing) {
  const result = checkWinner(board);
    
  // Terminal cases
  if (result) {
    if (result.winner === 'O') {return 10 - depth} // AI wins
    if (result.winner === 'X') {return depth - 10} // Player wins
  }
    
  if (isBoardFull(board)) {return 0} // Draw
    
  if (isMaximizing) {
    let bestScore = -Infinity;
    const availableMoves = getAvailableMoves(board);
        
    for (const move of availableMoves) {
      const tempBoard = cloneBoard(board);
      tempBoard[move.row][move.col] = 'O';
      const score = minimax(tempBoard, depth + 1, false);
      bestScore = Math.max(score, bestScore);
    }
        
    return bestScore;
  } else {
    let bestScore = Infinity;
    const availableMoves = getAvailableMoves(board);
        
    for (const move of availableMoves) {
      const tempBoard = cloneBoard(board);
      tempBoard[move.row][move.col] = 'X';
      const score = minimax(tempBoard, depth + 1, true);
      bestScore = Math.min(score, bestScore);
    }
        
    return bestScore;
  }
}

/**
 * Get best move using minimax algorithm
 * @param {Array} board - The current game board
 * @returns {Object} - Best move object {row, col}
 */
function getBestMoveAdvanced(board) {
  let bestScore = -Infinity;
  let bestMove = null;
  const availableMoves = getAvailableMoves(board);
    
  for (const move of availableMoves) {
    const tempBoard = cloneBoard(board);
    tempBoard[move.row][move.col] = 'O';
    const score = minimax(tempBoard, 0, false);
        
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
    
  return bestMove || getRandomElement(availableMoves);
}
