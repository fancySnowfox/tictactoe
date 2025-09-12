import TicTacToe from "./TicTacToe";
import "papercss/dist/paper.min.css";
import styled from "styled-components";

export default function App() {
  return (
    <Main>
      
      <TicTacToe/>
    </Main>
  );
}
 
const Main = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;