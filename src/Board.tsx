import { DIMENSIONS, DRAW } from "./constants";


type Grid = Array<null | number>;
export default class Board {
  grid: Grid;
  diagnalcombo_1 = [0];
  diagnalcombo_2 = [-1];
  winnerCombos = new Array();
  dimensions = 0;
  constructor(grid?: Grid) {
    this.grid = grid || new Array(DIMENSIONS ** 2).fill(null);
    if (this.grid.length !== DIMENSIONS ** 2) {
      this.dimensions = Math.sqrt(this.grid.length);
    }
    this.redraw(this.dimensions);
  }
  redraw = (dim: number) => {
    if (this.dimensions === dim) {
      this.grid.fill(null);
    }else{
      this.dimensions = dim;
      this.grid = new Array(this.dimensions ** 2).fill(null);
    }
     
    
    this.diagnalcombo_1 = [0];
    this.diagnalcombo_2 = [dim-1];
    for (var c = 1; c < this.dimensions; ++c) {
      this.diagnalcombo_1.push(c * this.dimensions + c);
    }
    console.log("winner diagnalcombo_1" , this.diagnalcombo_1);
    for (var c = 1; c < this.dimensions; ++c) {
      this.diagnalcombo_2.push(c * this.dimensions + this.dimensions - 1 - c);
    }
    console.log("winner diagnalcombo_2" , this.diagnalcombo_2);
    return this;
  }
  // Collect indices of the empty squares and return them
  getEmptySquares = (grid = this.grid) => {
    let squares: number[] = [];
    grid.forEach((square, i) => {
      if (square === null) squares.push(i);
    });
    return squares;
  };

  isEmpty = (grid = this.grid) => {
    return this.getEmptySquares(grid).length === this.dimensions ** 2;
  };
  getWinnerCombos = () => {
    return this.winnerCombos;
  };
  checkCombos = (grid = this.grid, currMove:number, currCombosToCheck:number[]) => {
    this.winnerCombos = new Array();
    //diagnoal direction match
    currCombosToCheck.forEach((num) => {
      if (grid[num] === grid[currMove]) {
        this.winnerCombos.push(num);
      }
    });
    if (this.winnerCombos.length == this.dimensions) {
      return grid[currMove];
    }
    return null;
  }
  getWinner = (grid = this.grid, currMove: number | null) => {
    let rowNum = currMove !== null ? Math.floor(currMove / this.dimensions): -1;
    let colNum = currMove !== null ? currMove % this.dimensions : -1;
    //check horizontal match, calculate the index of same row number
    if (currMove !== null) {
      let winnerCombos = [];
      //check if same row number has all same value
      for (var res = rowNum * this.dimensions; res < (rowNum + 1) * this.dimensions; ++res) {
        if (grid[currMove] === grid[res]) {
          winnerCombos.push(res);
          console.log("checking same row number, find same player move at ", res);
        }
      }
      if (winnerCombos.length == this.dimensions) {
        return grid[currMove];
      }
      winnerCombos = [];
      for (var res = colNum; res < this.dimensions ** 2; res += this.dimensions) {
        if (grid[currMove] === grid[res]) {
          console.log("checking same col number, find same player move at ", res);
          winnerCombos.push(res);
        }
      }
      if (winnerCombos.length == this.dimensions) {
        return grid[currMove];
      }
      let index_1 = this.checkCombos(grid, currMove, this.diagnalcombo_1);
      if (index_1 !== null) return grid[currMove];
      let index_2 = this.checkCombos(grid, currMove, this.diagnalcombo_2);
      if (index_2 !== null) return grid[currMove];
      if (this.getEmptySquares(grid).length === 0) {
        return DRAW;
      }
      return null;
    };

    const clone = () => {
      return new Board(this.grid.concat());
    };
  }
}