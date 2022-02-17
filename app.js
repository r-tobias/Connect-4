// DOM Elements
const allCells = document.querySelectorAll('.cell:not(.row-top)');
const topCells = document.querySelectorAll('.cell.row-top');
const winnerSpan = document.querySelector('.winner');
const HowtoButton = document.querySelectorAll('[data-modal-target]')
const closeButton = document.querySelectorAll('[data-close-button]')
const resetButton = document.querySelector('.reset');
const overlay = document.getElementById('overlay')

// rows
const topRow = [topCells[0], topCells[1], topCells[2], topCells[3], topCells[4], topCells[5], topCells[6]];
const row0 = [allCells[0], allCells[1], allCells[2], allCells[3], allCells[4], allCells[5], allCells[6]];
const row1 = [allCells[7], allCells[8], allCells[9], allCells[10], allCells[11], allCells[12], allCells[13]];
const row2 = [allCells[14], allCells[15], allCells[16], allCells[17], allCells[18], allCells[19], allCells[20]];
const row3 = [allCells[21], allCells[22], allCells[23], allCells[24], allCells[25], allCells[26], allCells[27]];
const row4 = [allCells[28], allCells[29], allCells[30], allCells[31], allCells[32], allCells[33], allCells[34]];
const row5 = [allCells[35], allCells[36], allCells[37], allCells[38], allCells[39], allCells[40], allCells[41]];
const rows = [row0, row1, row2, row3, row4, row5, topRow];

// columns
//starting from the bottom and up for each column
const column0 = [allCells[35], allCells[28], allCells[21], allCells[14], allCells[7], allCells[0], topCells[0]];
const column1 = [allCells[36], allCells[29], allCells[22], allCells[15], allCells[8], allCells[1], topCells[1]];
const column2 = [allCells[37], allCells[30], allCells[23], allCells[16], allCells[9], allCells[2], topCells[2]];
const column3 = [allCells[38], allCells[31], allCells[24], allCells[17], allCells[10], allCells[3], topCells[3]];
const column4 = [allCells[39], allCells[32], allCells[25], allCells[18], allCells[11], allCells[4], topCells[4]];
const column5 = [allCells[40], allCells[33], allCells[26], allCells[19], allCells[12], allCells[5], topCells[5]];
const column6 = [allCells[41], allCells[34], allCells[27], allCells[20], allCells[13], allCells[6], topCells[6]];
const columns = [column0, column1, column2, column3, column4, column5, column6];

//instruction box
HowtoButton.forEach(button => {
    button.addEventListener('click', () => {
        const modal = document.querySelector(button.dataset.modalTarget)
        openModal(modal)
    })
    
});
// allows users to close out instruction box by pressing the overlay
overlay.addEventListener('click', () => {
    const Modals = document.querySelectorAll('.modal.active')
    Modals.forEach(modal => {
        closeModal(modal)
    } )
})
closeButton.forEach(button => {
    button.addEventListener('click', () => {
      const modal = button.closest('.modal')
      closeModal(modal)
    })
  })
function openModal (modal) {
    if (modal == null) return
    modal.classList.add('active')
    overlay.classList.add('active')

}
function closeModal (modal) {
    if (modal == null) return
    modal.classList.remove('active')
    overlay.classList.remove('active')

}


//Variables
let gameIsPlaying = true;
let yellowsTurn = true;

// Functions
const getClassListArray = (cell) => {
    const classList = cell.classList;
    return [...classList]; // same as Array.from(classList). converting object to array.
  };

  const getCellLocation = (cell) => {
    const classList = getClassListArray(cell);
  
    const rowClass = classList.find(className => className.includes('row'));
    const colClass = classList.find(className => className.includes('col'));
    const rowIndex = rowClass[4]; // example: row-3, it's at index 4
    const colIndex = colClass[4];
    const rowNumber = parseInt(rowIndex, 10); // convert string into a number of base 10
    const colNumber = parseInt(colIndex, 10);
  
    return [rowNumber, colNumber];
  };
  
  const getFirstOpenCellForColumn = (colIndex) => {
    const column = columns[colIndex];
    const columnWithoutTop = column.slice(0, 6); // from index 0 until but not including 6 
  
    for (const cell of columnWithoutTop) {
      const classList = getClassListArray(cell);
      if (!classList.includes('yellow') && !classList.includes('red')) {
        return cell;
      }
    }
  
    return null; 
  };
  
  const clearColorFromTop = (colIndex) => {
    const topCell = topCells[colIndex];
    topCell.classList.remove('yellow');
    topCell.classList.remove('red');
  };
  
  const getColorOfCell = (cell) => {
    const classList = getClassListArray(cell);
    if (classList.includes('yellow')) return 'yellow';
    if (classList.includes('red')) return 'red';
    return null;
  };
  
  const checkWinningCells = (cells) => {
    if (cells.length < 4) return false;
  
    gameIsPlaying = false;
    for (const cell of cells) {
      cell.classList.add('win');
    }
    winnerSpan.textContent = `${yellowsTurn ? 'Yellow' : 'Red'} has won!`
    return true;
  };
  
  const checkStatusOfGame = (cell) => {
    const color = getColorOfCell(cell);
    if (!color) return;
    const [rowIndex, colIndex] = getCellLocation(cell);
  
    // Check horizontally
    let winningCells = [cell];
    let rowToCheck = rowIndex; 
    let colToCheck = colIndex - 1; // check left side
    while (colToCheck >= 0) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        colToCheck--;
      } else {
        break;
      }
    }
    colToCheck = colIndex + 1; // check right side
    while (colToCheck <= 6) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        colToCheck++;
      } else {
        break;
      }
    }
    let isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return;
  
  
    // Check vertically
    winningCells = [cell];
    rowToCheck = rowIndex - 1; // check top
    colToCheck = colIndex;
    while (rowToCheck >= 0) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck--;
      } else {
        break;
      }
    }
    rowToCheck = rowIndex + 1; //check bottom
    while (rowToCheck <= 5) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck++;
      } else {
        break;
      }
    }
    isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return;
  
  
    // Check left part diagonally /
    winningCells = [cell];
    rowToCheck = rowIndex + 1;
    colToCheck = colIndex - 1;
    while (colToCheck >= 0 && rowToCheck <= 5) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck++;
        colToCheck--;
      } else {
        break;
      }
    }
    rowToCheck = rowIndex - 1;
    colToCheck = colIndex + 1;
    while (colToCheck <= 6 && rowToCheck >= 0) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck--;
        colToCheck++;
      } else {
        break;
      }
    }
    isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return;
  
  
    // Check diagonally \ upper right
    winningCells = [cell];
    rowToCheck = rowIndex - 1;
    colToCheck = colIndex - 1;
    while (colToCheck >= 0 && rowToCheck >= 0) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck--;
        colToCheck--;
      } else {
        break;
      }
    }
    rowToCheck = rowIndex + 1;
    colToCheck = colIndex + 1;
    while (colToCheck <= 6 && rowToCheck <= 5) {
      const cellToCheck = rows[rowToCheck][colToCheck];
      if (getColorOfCell(cellToCheck) === color) {
        winningCells.push(cellToCheck);
        rowToCheck++;
        colToCheck++;
      } else {
        break;
      }
    }
    isWinningCombo = checkWinningCells(winningCells);
    if (isWinningCombo) return;
  
    // Check to see if there's a tie
    const rowsWithoutTop = rows.slice(0, 6);
    for (const row of rowsWithoutTop) {
      for (const cell of row) {
        const classList = getClassListArray(cell);
        if (!classList.includes('yellow') && !classList.includes('red')) {
          return;
        }
      }
    }
  
    gameIsPlaying = false;
    winnerSpan.textContent = "Game is a tie!";
  };
  
  
  
  // Event Handlers
  const handleCellMouseOver = (e) => {
    if (!gameIsPlaying) return;
    const cell = e.target;
    const [rowIndex, colIndex] = getCellLocation(cell); // destructuring property
  
    const topCell = topCells[colIndex];
    topCell.classList.add(yellowsTurn ? 'yellow' : 'red'); // add the checker on top of the column we've hovering over
  };
  
  //removes checker when the cursor is moved out of an element
  const handleCellMouseOut = (e) => {
    const cell = e.target;
    const [rowIndex, colIndex] = getCellLocation(cell);
    clearColorFromTop(colIndex);
  };
  
  const handleCellClick = (e) => {
    if (!gameIsPlaying) return;
    const cell = e.target;
    const [rowIndex, colIndex] = getCellLocation(cell);
  
    const openCell = getFirstOpenCellForColumn(colIndex);
  
    if (!openCell) return; // if the column is full, dont do anything and dont add another checker
  
    openCell.classList.add(yellowsTurn ? 'yellow' : 'red');
    checkStatusOfGame(openCell); // passing in the most recent cell 
  
    yellowsTurn = !yellowsTurn; // alternate turns
    clearColorFromTop(colIndex); // remove current color
    if (gameIsPlaying) {
      const topCell = topCells[colIndex];
      topCell.classList.add(yellowsTurn ? 'yellow' : 'red');  //add color
    }
  };
  
  // Adding Event Listeners
  for (const row of rows) {
    for (const cell of row) {
      cell.addEventListener('mouseover', handleCellMouseOver);
      cell.addEventListener('mouseout', handleCellMouseOut);
      cell.addEventListener('click', handleCellClick);
    }
  }

  resetButton.addEventListener('click', () => {
    for (const row of rows) {
      for (const cell of row) {
        cell.classList.remove('red');
        cell.classList.remove('yellow');
        cell.classList.remove('win');
      }
    }
    gameIsPlaying = true;
    yellowsTurn = true;
    winnerSpan.textContent = '';
  });
  