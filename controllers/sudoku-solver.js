class SudokuSolver {
  //for both api/check and api/solve
  validate(puzzleString) {
    const check_len = puzzleString.length;
    const pattern = /^[\d.]+$/;
    const check_char = pattern.test(puzzleString);
    if(check_len != 81){
      return "Expected puzzle to be 81 characters long";
    } 
    if (!check_char){
      return "Invalid characters in puzzle";
    }  
    if (check_len != 81 && check_char){
      return "Puzzle cannot be solved";
    } 
    return puzzleString;
  }
  //for api/check
  checkerRowPlacement(puzzleString, row, column, value) {
    const rows = {"a":9, "b":18, "c":27, "d":36, "e":45, "f":54, "g":63, "h":72, "i":81}; 
    const start_index = puzzleString[rows[row] - 9];
    const end_index = puzzleString[rows[row]];
    const letter_row = puzzleString.slice(start_index, end_index);
    if(letter_row[parseInt(column) - 1] == value){
      return true;
    } 
    if(letter_row.includes(value)){
      return "row";
    } 
    return true;
  }
  //for api/check
  checkerColPlacement(puzzleString, row, column, value) {
    let cols = {0:[], 1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[]};
    const rows = {"a":0, "b":1, "c":2, "d":3, "e":4, "f":5, "g":6, "h":7, "i":8};
    const colIdx = parseInt(column) - 1;
    const col_arr = cols[colIdx];
    for(let j=0; j < 9; j++){
      col_arr.push(puzzleString[(j*9) + colIdx]);
    }
    if(parseInt(col_arr[rows[row]]) == parseInt(value)){
      return true;
    }
    if(col_arr.includes(value)){
      return "column";
    } 
    return true;
  }
  //for api/check
  checkerRegionPlacement(puzzleString, row, column, value) {
    let regions = {1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[]};
    let rows = {"a":0, "b":1, "c":2, "d":3, "e":4, "f":5, "g":6, "h":7, "i":8};
    for(let region = 0; region < 9; region++){
      for(let i = 0; i < 3; i++){
        for (let j = 0; j < 3; j++){
          let region_row = (Math.floor(region / 3)) * 3 + i;
          let region_col = ((region % 3) * 3) + j;
          regions[region + 1].push(puzzleString[region_row * 9 + region_col]);
        }
      }
    }
    let region_row = Math.floor(rows[row] / 3);
    let region_col = Math.floor((column - 1) / 3); 
    let region_index = region_row * 3 + region_col + 1;
    if(regions[region_index].includes(value)){
      //finish below here
      for(let cell in regions[region_index]){
        if(cell === value && this.checkerColPlacement(puzzleString, row, column, cell) == true && this.checkRowPlacement(puzzleString, row, column, cell) == true){
          return true;
        }
      }
      return "region";
    } 
    return true;
  }
  //for api/solve
  checkRowPlacement(puzzleStr, row, col, val) {
    const start = row * 9;
    for (let i = 0; i < 9; i++) {
      if (puzzleStr[start + i] === val) return false;
    }
    return true;
  }
  //for api/solve
  checkColPlacement(puzzleStr, row, col, val) {
    for (let i = 0; i < 9; i++) {
      if (puzzleStr[col + i * 9] === val) return false;
    }
    return true;
  }
  //for api/solve
  checkRegionPlacement(puzzleStr, row, col, val) {
    const regionRow = Math.floor(row / 3) * 3;
    const regionCol = Math.floor(col / 3) * 3;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const index = (regionRow + r) * 9 + (regionCol + c);
        if (puzzleStr[index] === val) return false;
      }
    }
    return true;
  }
  //for api/solve
  strToPuzzle(puzzleString){
    const puzzle = [];
    for (let i = 0; i < 9; i++) {
      puzzle.push(puzzleString.slice(i * 9, (i + 1) * 9));
    }
    return puzzle;
  }
  //for api/solve
  strToCharGrid(puzzle) { return puzzle.map(row => row.split('')); }
  //for api/solve
  charGridToPuzzle(grid) { return grid.map(row => row.join('')); }
  //for api/solve
  charGridToStr(grid) { return grid.flat().join(''); }
  //for api/solve
  solve(puzzle) {
    let grid = this.strToCharGrid(puzzle);
    const backtrack = (row = 0, col = 0) => {
      if (row === 9) return true; 
      if (col === 9) return backtrack(row + 1, 0); 
      if (grid[row][col] !== '.') {
        return backtrack(row, col + 1); 
      }
      for (let num = 1; num <= 9; num++) {
        const val = num.toString();
        const puzzleStr = this.charGridToStr(grid);
        if (
          this.checkRowPlacement(puzzleStr, row, col, val) &&
          this.checkColPlacement(puzzleStr, row, col, val) &&
          this.checkRegionPlacement(puzzleStr, row, col, val)
        ) {
          grid[row][col] = val; 
          if (backtrack(row, col + 1)) {
            return true; 
          }
          grid[row][col] = '.'; 
        }
      }
      return false; 
    };
    const solved = backtrack();
    return solved ? this.charGridToPuzzle(grid) : false;
  }
}
module.exports = SudokuSolver;