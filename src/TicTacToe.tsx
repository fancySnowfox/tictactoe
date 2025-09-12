import {useEffect, useState} from "react";
import styled from "styled-components";
import { DIMENSIONS, PLAYER_X, PLAYER_O, SQUARE_DIMS, DRAW} from "./constants";
import { getRandomInt, switchPlayer } from "./utils";
import { GAME_STATES } from "./constants";
import { useCallback } from "react";
import Board from "./Board";


export default function TicTacToe({dims=DIMENSIONS}){
    const [dimensions, setDimensions] = useState(dims);
    const emptyGrid = new Array(dimensions ** 2).fill(null);
    const [grid, setGrid] = useState(emptyGrid);
    const [players, setPlayers] = useState({
        human: PLAYER_X,
        ai: PLAYER_O,
        });
    const [gameState, setGameState] = useState(GAME_STATES.notStarted);
    const [nextMove, setNextMove] = useState<null | number>(null);
    const [winner, setWinner] = useState<null | number>(null);
    const [winnerRow, setWinnerRowState] =  useState(Array(dimensions).fill(null)); 
    let board = new Board(emptyGrid);
    const move  =(index: number, player: number) => {
        
        if (player && gameState === GAME_STATES.inProgress) {
            setGrid((grid) => {
                const gridCopy = grid.concat();
                gridCopy[index] = player;
                if (board.dimensions ** 2 === gridCopy.length) {
                    console.error("Wrong board!");
                }
                let w = board.getWinner(gridCopy, index);
                let winnerRow = (board.getWinnerCombos());
                if (w === players.human) {
                    setWinner(players.human);
                    setWinnerRowState(winnerRow);
                    setGameState(GAME_STATES.over);
                }else if (w === players.ai){
                    setWinner(players.ai);
                    setWinnerRowState(winnerRow);
                    setGameState(GAME_STATES.over);
                }else if (w === DRAW) {
                    setWinner(DRAW);
                    setGameState(GAME_STATES.over);
                }
                return gridCopy;
            });
        }
    };

    const aiMove = useCallback(() =>  {
        let index = getRandomInt(0, 8);
        while (grid[index]) {
            index = getRandomInt(0, 8);
        }
        console.log("aiMove", index, players.ai);
        move(index, players.ai);
        setNextMove(players.human);
    }, [move, grid, players]);


    const humanMove = (index: number) => {
        if (!grid[index] && nextMove === players.human) {
            console.log("human move", index, players.human);
            move(index, players.human);
            setNextMove(players.ai);
        }
    };
   
    useEffect(() => {
        let timeout: NodeJS.Timeout;
       
        if (
          nextMove !== null &&
          nextMove === players.ai &&
          gameState !== GAME_STATES.over
        ) {
          // Delay AI moves to make them seem more natural
          timeout = setTimeout(() => {
            aiMove();
          }, 500);
        }
        return () => timeout && clearTimeout(timeout);
      }, [nextMove, aiMove, players.ai, gameState]);

    const choosePlayer = (option: number) => {
        setPlayers({ human: option, ai: switchPlayer(option) });
        setNextMove(players.human);
        startNewGame();
        setGameState(GAME_STATES.inProgress);
        
        console.log("player chosen!");
        
    };
    const startNewGame = () => {
        setGameState(GAME_STATES.notStarted);
        console.log("start new game", dimensions);
        let grid = new Array(dimensions ** 2).fill(null);
        setGrid(grid);
        board = new Board(grid);
        console.log("board dimensions", board.dimensions);
    };
    const Container = styled.div<{ dims: number }>`
        display: flex;
        justify-content: center;
        width: ${({ dims }) => `${dims * (SQUARE_DIMS + 5)}px`};
        flex-flow: wrap;
        position: relative;
        `;
    
    const Square = styled.div`
        display: flex;
        justify-content: center;
        align-items: center;
        width: ${SQUARE_DIMS}px;
        height: ${SQUARE_DIMS}px;
        border: 1px solid black;
        background: yellow;
        &:hover {
            cursor: pointer;
        }
        `;
    
    const ButtonRow = styled.div`
        display: flex;
        width: 150px;
        justify-content: space-between;
        `;
    
    const Inner = styled.div`
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 30px;
        `;
    const Marker = styled.p`
        font-size: 68px;
        `;
    const WinnerMarker = styled.p`
        font-size: 72px;
        text-decoration-color: rgb(216, 202, 44);
        `;
    const getDescription = (winner : number | null) => {
        return winner !== null && winner === players.human ? "Winner is you" : 
        (winner === players.ai ? "Winner is ai" : "It is a tie!")
    }
  const handleChange = () => {
    const inputElement = document.getElementById("dims") as HTMLInputElement;
    const inputValue: string = inputElement.value;
    setDimensions(parseInt(inputValue));
   
  }
  switch (gameState) {
    case GAME_STATES.notStarted:
    default:
      return (
        <div>
        <label htmlFor="dimensions">Number of dimensions (3-10):</label>
        <input type="number" id="dims" name="dimensions" min="3" max="10" 
            onChange={handleChange} />
          <Inner>
            <p>Choose your player</p>
            <ButtonRow>
              <button onClick={() => choosePlayer(PLAYER_X)}>X</button>
              <p>or</p>
              <button onClick={() => choosePlayer(PLAYER_O)}>O</button>
            </ButtonRow>
          </Inner>
        </div>
      );
    case GAME_STATES.inProgress:
      return (
        <div> 
            <div>
                <Container dims={dimensions}>
                    {grid.map((value, index) => {
                        const isActive = value !== null;
                        return (
                        <Square key={index} onClick={() => humanMove(index) }>
                            {isActive && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
                            
                        </Square>
                        );
                    })}
                </Container>
            </div>
            <div>
                <p>Next turn is {nextMove === PLAYER_X ? "X" : "O"} </p>
            </div>
        </div>
      );
    case GAME_STATES.over:
      return (
        <div>
            <div>
                <Container dims={dimensions}>
                {grid.map((value, index) => {
                    const isActive = value !== null;
                    const isWinner = ((winnerRow !== null )? winnerRow.includes(index): false);
                    return (
                            <Square key={index}>
                                {isActive && !isWinner && <Marker>{value === PLAYER_X ? "X" : "O"}</Marker>}
                                {isActive && isWinner && <WinnerMarker>{value === PLAYER_X ? "X" : "O"} </WinnerMarker>}
                            </Square> 
                    );
                })}
                </Container> 
            </div>
            <div>
                <p>{getDescription(winner)}</p>
                <button onClick={startNewGame}>Start over</button>
                
            </div>
        </div>
      );
  }
};

