import { useEffect, useState, useRef } from "react";
import "./index.css";

const getRandomNumberExcludingArray = (arr, max) => {
  let randomNum;
  do {
    randomNum = Math.floor(Math.random() * max);
  } while (arr.includes(randomNum));
  return randomNum;
};

const Square = ({ value, style }) => {
  return (
    <div className="square" style={style}>
      {value}
    </div>
  );
};

function App() {
  const [squares, setSquares] = useState(Array(121).fill(null));
  const [score, setScore] = useState(0);
  const [pressedButton, setPressedButton] = useState("ArrowUp");
  const [snake, setSnake] = useState([60, 71, 82]);
  const [snakeSpeed, setSnakeSpeed] = useState(500);
  const [apple, setApple] = useState(getRandomNumberExcludingArray(snake, 121));
  const [gameOver, setGameOver] = useState(false);

  const isPressedRef = useRef(false);
  const pressedButtonRef = useRef(pressedButton);

  useEffect(() => {
    pressedButtonRef.current = pressedButton;
  }, [pressedButton]);

  useEffect(() => {
    if (snake[0] === apple) {
      setSnake((prevSnake) => {
        const newTail = prevSnake[prevSnake.length - 1];
        return [...prevSnake, newTail];
      });
      setApple(getRandomNumberExcludingArray(snake, 121));
      setSnakeSpeed((prevSnakeSpeed) => prevSnakeSpeed - 10);
      setScore((prevScore) => prevScore + 50);
    }
  }, [snake]);

  useEffect(() => {
    const interval = setInterval(() => {
      const head = snake[0];

      if (head <= 10 && pressedButtonRef.current === "ArrowUp") {
        setGameOver(true);
        clearInterval(interval);
        return;
      }
      if (head >= 111 && pressedButtonRef.current === "ArrowDown") {
        setGameOver(true);
        clearInterval(interval);
        return;
      }
      if (head % 11 === 0 && pressedButtonRef.current === "ArrowLeft") {
        setGameOver(true);
        clearInterval(interval);
        return;
      }
      if (head % 11 === 10 && pressedButtonRef.current === "ArrowRight") {
        setGameOver(true);
        clearInterval(interval);
        return;
      }

      if (snake.slice(1).includes(head)) {
        setGameOver(true);
        clearInterval(interval);
        return;
      }

      const newHead = (() => {
        switch (pressedButtonRef.current) {
          case "ArrowUp":
            return head - 11;
          case "ArrowDown":
            return head + 11;
          case "ArrowLeft":
            return head - 1;
          case "ArrowRight":
            return head + 1;
          default:
            return head;
        }
      })();

      setSnake((prevSnake) => {
        const newSnake = [newHead, ...prevSnake.slice(0, -1)];
        return newSnake;
      });

      isPressedRef.current = false;
    }, snakeSpeed);

    return () => clearInterval(interval);
  }, [snake]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case "ArrowDown":
          if (pressedButtonRef.current === "ArrowUp" || isPressedRef.current) {
            break;
          } else {
            isPressedRef.current = true;
            setPressedButton("ArrowDown");
          }
          break;
        case "ArrowUp":
          if (
            pressedButtonRef.current === "ArrowDown" ||
            isPressedRef.current
          ) {
            break;
          } else {
            isPressedRef.current = true;
            setPressedButton("ArrowUp");
          }
          break;
        case "ArrowLeft":
          if (
            pressedButtonRef.current === "ArrowRight" ||
            isPressedRef.current
          ) {
            break;
          } else {
            isPressedRef.current = true;
            setPressedButton("ArrowLeft");
          }
          break;
        case "ArrowRight":
          if (
            pressedButtonRef.current === "ArrowLeft" ||
            isPressedRef.current
          ) {
            break;
          } else {
            isPressedRef.current = true;
            setPressedButton("ArrowRight");
          }
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handlePositions = (i) => {
    if (snake.includes(i)) {
      return "green";
    }
    if (i === apple) {
      return "red";
    }
    return "white";
  };

  return (
    <>
      <h1 className="gameOver">{!gameOver ? "" : "Game over!"}</h1>
      <div className="container">
        {squares.map((square, i) => (
          <Square
            value={square}
            style={{
              backgroundColor: handlePositions(i),
            }}
            key={i}
          />
        ))}
        <h1 className="score">{`Score: ${score}`}</h1>
      </div>
    </>
  );
}

export default App;
