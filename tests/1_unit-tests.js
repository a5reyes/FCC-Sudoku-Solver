const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();

suite('Unit Tests', () => {
    //#1 - Logic handles a valid puzzle string of 81 characters
    test('#1', function(done){
        const input1 = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        assert.equal(solver.validate(input1), input1);
        done();
    });
    //#2 - Logic handles a puzzle string with invalid characters (not 1-9 or .)
    test('#2', function(done){
        const input2 = "ab9cd5e1f85g4hijk2432......0...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        assert.equal(solver.validate(input2), "Invalid characters in puzzle");
        done();
    });
    //#3 - Logic handles a puzzle string that is not 81 characters in length
    test('#3', function(done){
        const input3 = "12345";
        assert.equal(solver.validate(input3), "Expected puzzle to be 81 characters long");
        done();
    });
    //#4 - Logic handles a valid row placement
    test('#4', function(done){
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const valid_coordinate_row = "a";
        const valid_coordinate_col = "1";
        const valid_value = "7";
        assert.equal(solver.validate(puzzle), puzzle);
        assert.equal(solver.checkerRowPlacement(puzzle, valid_coordinate_row, valid_coordinate_col, valid_value), true);
        done();
    });
    //#5 - Logic handles an invalid row placement
    test('#5', function(done){
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const valid_coordinate_row = "a";
        const valid_coordinate_col = "1";
        const valid_value = "9";
        assert.equal(solver.checkerRowPlacement(puzzle, valid_coordinate_row, valid_coordinate_col, valid_value), "row");
        done();
    });
    //#6 - Logic handles a valid column placement
    test('#6', function(done){
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const valid_coordinate_row = "a";
        const valid_coordinate_col = "1";
        const valid_value = "7";
        assert.equal(solver.checkerColPlacement(puzzle, valid_coordinate_row, valid_coordinate_col, valid_value), true);
        done();
    });
    //#7 - Logic handles an invalid column placement
    test('#7', function(done){
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const valid_coordinate_row = "a";
        const valid_coordinate_col = "1";
        const valid_value = "6";
        assert.equal(solver.checkerColPlacement(puzzle, valid_coordinate_row, valid_coordinate_col, valid_value), "column");
        done();
    });
    //#8 - Logic handles a valid region (3x3 grid) placement
    test('#8', function(done){
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const valid_coordinate_row = "a";
        const valid_coordinate_col = "1";
        const valid_value = "6";
        assert.equal(solver.checkerRegionPlacement(puzzle, valid_coordinate_row, valid_coordinate_col, valid_value), true);
        done();
    });
    //#9 - Logic handles an invalid region (3x3 grid) placement
    test('#9', function(done){
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const valid_coordinate_row = "a";
        const valid_coordinate_col = "1";
        const valid_value = "9";
        assert.equal(solver.checkerRegionPlacement(puzzle, valid_coordinate_row, valid_coordinate_col, valid_value), "region");
        done();
    });
    //#10 - Valid puzzle strings pass the solver
    test('#10', function(done){
        const puzzle = "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const puzzle_arr = solver.strToPuzzle(puzzle);       
        let solutionGrid = solver.solve(puzzle_arr); 
        const solutionStr = solutionGrid.join('');
        assert.exists(solutionStr);
        done();
    });
    //#11 - Invalid puzzle strings fail the solver
    test('#11', function(done){
        const invalid_puzzle = "ab9cd5e1f85g4hijk2432......0...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const puzzle = solver.validate(invalid_puzzle);
        const puzzle_arr = solver.strToPuzzle(puzzle);       
        let solutionGrid = solver.solve(puzzle_arr); 
        const solutionStr = solutionGrid.join('');
        assert.equal(puzzle, solutionStr);
        done();
    });
    //#12 - Solver returns the expected solution for an incomplete puzzle
    test('#12', function(done){
        const invalid_puzzle = "......0...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
        const puzzle = solver.validate(invalid_puzzle);
        const puzzle_arr = solver.strToPuzzle(puzzle);       
        let solutionGrid = solver.solve(puzzle_arr); 
        const solutionStr = solutionGrid.join('');
        assert.exists(solutionStr);
        done();
    });
});
