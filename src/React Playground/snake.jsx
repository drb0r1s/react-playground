import React, { useEffect, useRef, useReducer, useCallback, useMemo } from "react";
import { reducer } from "./snake-reducer";
import { SnakeIG, FruitIG } from "./snake-classes";
import useResponsiveObj from "./useResponsiveObj";

const Snake = (props) => {
    const defaultState = useMemo(() => {
        return {
            startGame: false,
            canvas: "",
            gameOver: false,
            gameScore: 0
        }
    }, []);

    const [state, dispatcher] = useReducer(reducer, defaultState);

    const {
        startGame, canvas, gameOver,
        gameScore
    } = state;
    
    const snakeHeading = useRef(null);
    const snakeGame = useRef(null);
    const snakeCanvas = useRef(null);
    const snakeGameOver = useRef(null);
    const score = useRef(null);
    const scoreHI = useRef(null);
    
    useEffect(() => {
        if(startGame) {
            const makeCanvas = snakeCanvas.current;
            dispatcher({ type: "MAKE_CANVAS", payload: makeCanvas });
        }
    }, [startGame]);

    useEffect(() => {
        if(gameOver) {
            setTimeout(() => {
                snakeGameOver.current.style.opacity = "1";
                snakeGameOver.current.style.top = "50%";
            }, 100);
        }
    }, [gameOver]);

    const canvasResponsive = useMemo(() => {
        return {
            xxs: { width: "240", height: "300" },
            xs: { width: "300", height: "500" },
            sm: { width: "400", height: "500" },
            md: { width: "700", height: "500" },
            lg: { width: "1000", height: "500" },
            xl: { width: "1000", height: "500" },
            xxl: { width: "1000", height: "500" }
        }
    }, []);

    const { responsive } = useResponsiveObj(canvasResponsive);

    function startAnimation() {
        snakeHeading.current.style.opacity = "0";
        snakeHeading.current.style.top = "10px";

        setTimeout(() => {
            dispatcher({ type: "START_GAME" });

            setTimeout(() => {
                snakeGame.current.style.opacity = "1";
                snakeGame.current.style.top = "0";
            }, 100);
        }, 500);
    }

    const startCanvas = useCallback(() => {
        const ctx = canvas.getContext("2d");

        const block = 50;
        const rows = canvas.width / block;
        const columns = canvas.height / block;

        const snakeIG = new SnakeIG();
        const fruitIG = new FruitIG(rows, columns);

        const fruitImg = new Image();

        let currentScore = 0;

        const gameTime = setInterval(() => {
            snakeIG.draw(ctx, canvas);
            snakeIG.move(canvas);
            fruitIG.draw(ctx, fruitImg);
            
            for(let i = 0; i < snakeIG.tailPosition.length - 1; i++) {
                if(
                    snakeIG.tailPosition[i].x === snakeIG.x &&
                    snakeIG.tailPosition[i].y === snakeIG.y
                ) {
                    clearInterval(gameTime);
                    
                    if(localStorage.getItem("SNAKE_HIGH_SCORE") < currentScore) {
                        localStorage.setItem("SNAKE_HIGH_SCORE", currentScore);
                    }
                    
                    return dispatcher({ type: "GAME_OVER", payload: currentScore });
                }
            }

            if(snakeIG.x === fruitIG.x && snakeIG.y === fruitIG.y) {
                snakeIG.increase();
                fruitIG.redraw(rows, columns, ctx, fruitImg);

                currentScore++;
                
                score.current.innerHTML = currentScore;

                if(localStorage.getItem("SNAKE_HIGH_SCORE") < currentScore) {
                    scoreHI.current.innerHTML = "HI " + currentScore;
                }
            }
        }, 200);


        window.addEventListener("keydown", moveSnake);
        canvas.addEventListener("touchstart", touchStart, { passive: false });

        function moveSnake(event) {
            event.preventDefault();
            
            const keys = ["ArrowUp", "ArrowRight", "ArrowDown", "ArrowLeft"];
            let checkKey = "";

            keys.forEach((key) => {
                if(event.key === key) checkKey = key;
            });

            if(checkKey) snakeIG.changeDirection(checkKey);
        }

        function touchStart(event) {
            canvas.addEventListener("touchmove", touchMove, { passive: false });
            canvas.addEventListener("touchend", touchEnd);

            const prevX = event.targetTouches[0].clientX;
            const prevY = event.targetTouches[0].clientY;

            let newX, newY;

            function touchMove(event) {
                event.preventDefault();
                
                newX = event.targetTouches[0].clientX;
                newY = event.targetTouches[0].clientY;
            }

            function touchEnd() {
                canvas.removeEventListener("touchmove", touchMove, { passive: false });
                canvas.removeEventListener("touchend", touchEnd);

                let direction = "";
                let directionWay = Math.abs(prevX - newX) > Math.abs(prevY - newY) ? "x" : "y";
                
                if(directionWay === "x") {
                    if(prevX < newX) direction = "ArrowRight";
                    if(prevX > newX) direction = "ArrowLeft";
                }

                if(directionWay === "y") {
                    if(prevY > newY) direction = "ArrowUp";
                    if(prevY < newY) direction = "ArrowDown";
                }

                snakeIG.changeDirection(direction);
            }
        }
    }, [canvas]);

    useEffect(() => {
        if(canvas) {
            startCanvas();
        }
    }, [canvas, startCanvas]);

    function resetCanvas() {
        snakeGameOver.current.style.opacity = "0";
        snakeGameOver.current.style.top = "60%";

        setTimeout(() => {
            dispatcher({ type: "RESET_GAME" });
            startCanvas();
        }, 500);
    }
    
    return(
        <div className="snake" id="snake" ref={props.setRef}>
            {gameOver && <GameOver
                snakeGameOver={snakeGameOver}
                gameScore={gameScore}
                resetCanvas={resetCanvas}
            />}
            
            {startGame ?
                <SnakeGame
                    snakeGame={snakeGame}
                    snakeCanvas={snakeCanvas}
                    gameOver={gameOver}
                    score={score}
                    scoreHI={scoreHI}
                    responsive={responsive}
                />
            : <div
                className="snake-heading"
                ref={snakeHeading}
                onClick={startAnimation}
            >
                <h2>snake</h2>
            </div>}
        </div>
    );
}

const SnakeGame = (props) => {
    const {
        snakeGame, snakeCanvas, gameOver,
        score, scoreHI, responsive
    } = props;
    
    return(
        <div className="snake-game" ref={snakeGame}>
            <canvas
                className={gameOver ? "snake-canvas-canceled" : ""}
                id="snake-canvas"
                ref={snakeCanvas}
                height={responsive.height}
                width={responsive.width}
            ></canvas>

            <div className="scoreboard">
                <strong ref={score}>0</strong>
                <strong ref={scoreHI}>HI {localStorage.getItem("SNAKE_HIGH_SCORE")}</strong>
            </div>
        </div>
    );
}

const GameOver = (props) => {
    const {
        snakeGameOver, resetCanvas, gameScore
    } = props;
    
    return(
        <div className="snake-game-over" ref={snakeGameOver}>
            <h3>game over</h3>

            <div className="modal-score">
                <p>score: <span>{gameScore}</span></p>
                <p>high score: <span>{localStorage.getItem("SNAKE_HIGH_SCORE")}</span></p>
            </div>

            <button onClick={resetCanvas}>reset</button>
        </div>
    );
}

export default Snake;