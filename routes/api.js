'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body;
      let conflicts = [];
      if(!puzzle || !coordinate || !value){
        return res.json({ error: "Required field(s) missing" });
      } else {
        if(!(value >= 1 && value <= 9)){
          return res.json({error: "Invalid value"});
        }
        let rows = ["a","b","c","d","e","f","g","h","i"];
        if(coordinate.length !== 2){
          return res.json({ error: "Invalid coordinate" });
        }
        coordinate = coordinate.toLowerCase();
        const row = coordinate[0];
        const col = coordinate[1];
        if(!(rows.includes(row))){
          return res.json({ error: "Invalid coordinate" });
        }
        if(!(/^[1-9]$/.test(col))){
          return res.json({ error: "Invalid coordinate" });
        }
        let check_puzzle = solver.validate(puzzle);
        if(check_puzzle != puzzle){
          return res.json({error: check_puzzle});
        } else {
          let check_row = solver.checkerRowPlacement(puzzle, row, col, value);
          let check_col = solver.checkerColPlacement(puzzle, row, col, value);
          let check_region = solver.checkerRegionPlacement(puzzle, row, col, value);
          if( check_row == "row" || check_col == "column" || check_region == "region"){
            conflicts.push(check_row);
            conflicts.push(check_col);
            conflicts.push(check_region);
            res.json({valid: false, conflict: conflicts.filter(result => result !== true)});
          }  
          if(check_row || check_col || check_region){
            res.json({valid: check_row || check_col || check_region });
          }
        }
      }
    });
    
  app.route('/api/solve')
    .post((req, res) => {
      let { puzzle } = req.body;
      if(!puzzle){
        res.json({ error: "Required field missing" });
      } else {
        let check_puzzle = solver.validate(puzzle);
        if(check_puzzle != puzzle){
          res.json({error: check_puzzle});
        } else {
          const puzzle_arr = solver.strToPuzzle(check_puzzle);       
          let solutionGrid = solver.solve(puzzle_arr); 
          if (!solutionGrid || solutionGrid.join('') === check_puzzle) {
            res.json({ error: 'Puzzle cannot be solved' });
          } else {
            const solutionStr = solutionGrid.join(''); 
            res.json({ solution: solutionStr });
          }
        }
      }
    });
};
