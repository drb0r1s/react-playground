import React, { useEffect, useRef, useReducer, useMemo } from "react";
import { reducer } from "./dino-reducer";
import dinoDino from "./images/dino-dino.png";
import dinoCactus from "./images/dino-cactus.png";
import useResponsiveObj from "./useResponsiveObj";

const Dino = (props) => {
    const defaultState = {
        prepareGame: false,
        gameStarted: false,
        gameInfo: true,
        gameOver: false,
        gameScore: 0,
        highScore: 0
    };

    const [state, dispatcher] = useReducer(reducer, defaultState);

    const {
        gameStarted, gameOver, gameInfo,
        gameScore, highScore
    } = state;
    
    const dinoHeading = useRef(null);
    const headingH1 = useRef(null);
    const headingImg = useRef(null);
    const dinoIG = useRef(null);
    const cactusIG = useRef(null);
    const score = useRef(null);
    const currentHI = useRef(null);
    const dinoGameHolder = useRef(null);
    const gameOverModal = useRef(null);
    const infoText = useRef(null);
    const restartButton = useRef(null);

    useEffect(() => {
        if(localStorage.getItem("DINO_HIGH_SCORE")) {
            dispatcher({ type: "STORAGE_HIGH_SCORE", payload: localStorage.getItem("DINO_HIGH_SCORE")});
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("DINO_HIGH_SCORE", highScore);
    }, [highScore]);

    const dinoResponsive = useMemo(() => {
        return {
            xxs: 3,
            xs: 3,
            sm: 3
        }
    }, []);

    const { responsive } = useResponsiveObj(dinoResponsive);
    
    function startAnimation() {
        headingH1.current.style.opacity = "0";
        headingH1.current.style.top = "-5px";

        setTimeout(() => {
            dispatcher({ type: "PREPARE_GAME" });

            setTimeout(() => {
                if(headingImg.current !== null) {
                    headingImg.current.style.opacity = "0";
                    headingImg.current.style.top = "10px";
                }

                setTimeout(() => {
                    dispatcher({ type: "START_GAME" });

                    setTimeout(() => {
                        dinoGameHolder.current.style.opacity = "1";
                        dinoGameHolder.current.style.top = "0";
                    }, 100);
                }, 300);
            }, 1500);
        }, 500);
    }

    function startGame(prevHI) {
        window.addEventListener("keydown", dinoJump);
        window.addEventListener("click", dinoJump);
        
        const gameSettings = {
            isJumped: false,
            startMoving: false,
            animationSpeed: 1500,
            currentScore: 0,
            scoreUnit: 0.0005,
            realScore: 0,
            scoreUp: false,
            isDay: 1,
            oneCollision: true
        };

        let {
            isJumped, startMoving, animationSpeed,
            currentScore, scoreUnit, realScore,
            scoreUp, isDay, oneCollision
        } = gameSettings;

        function dinoJump(event) {
            event.preventDefault();
            
            const jumpKeys = event.key === "ArrowUp" ||
            event.code === "Space" ||
            event.key === "Enter";

            const isClick = event.type === "click";

            const makeJump = jumpKeys || isClick;
            
            if(makeJump && !isJumped) {
                dinoIG.current.id = "dino-jump";
                isJumped = true;

                if(!startMoving) {
                    cactusMove();
                    startMoving = true;
                }

                setTimeout(() => {
                    dinoIG.current.id = "";
                    isJumped = false;
                }, 500);
            }
        }
        
        function cactusMove() {
            cactusIG.current.style.animation = `cactusMove ${animationSpeed}ms linear infinite`;
            scoreUp = true;
        }

        const dinoGameHolderHeight = parseInt(getComputedStyle(dinoGameHolder.current).getPropertyValue("height"));
        const dinoHeight = parseInt(getComputedStyle(dinoIG.current).getPropertyValue("height"));
        const dinoWidth = parseInt(getComputedStyle(dinoIG.current).getPropertyValue("width"));
        const dinoBlock = !responsive ? 2 : responsive;
        
        const dinoGameHolderWidth = parseInt(getComputedStyle(dinoGameHolder.current).getPropertyValue("width"));
        const getSpaceValue = dinoGameHolderWidth - dinoGameHolderWidth / 10 * dinoBlock;
        
        const requiredJumpHeight = dinoGameHolderHeight - dinoHeight;
        const requiredCactusPosition = dinoGameHolderWidth - getSpaceValue;
        
        setTimeout(() => {
            infoText.current.style.opacity = "1";
            infoText.current.style.top = "0";
        }, 300);
        
        setInterval(() => {
            const dinoTop = parseInt(getComputedStyle(dinoIG.current).getPropertyValue("top"));
            const cactusLeft = parseInt(getComputedStyle(cactusIG.current).getPropertyValue("left"));
            
            if(scoreUp && oneCollision) {
                if(infoText.current !== null) {
                    infoText.current.style.opacity = "0";
                    infoText.current.style.top = "-10px";
                }
                
                setTimeout(() => {
                    dispatcher({ type: "INFO_OFF" });
                }, 300);
                
                score.current.innerHTML = currentScore.toFixed(0);

                if(prevHI < parseInt(currentScore.toFixed(0))) {
                    currentHI.current.innerHTML = "HI " + currentScore.toFixed(0);
                }

                if(parseInt(currentScore.toFixed(0)) > 100 * isDay) {
                    cactusIG.current.style.animation = `cactusMove ${animationSpeed - isDay * 100}ms linear infinite`;
                    
                    if(isDay % 2 !== 0) {
                        dinoGameHolder.current.style.filter = "invert(1)";
                    }

                    else {
                        dinoGameHolder.current.style.filter = "";
                    }

                    isDay++;
                }

                realScore += 0.05;
                currentScore += parseInt(realScore.toFixed(0)) * scoreUnit;
            }
            
            if(
                dinoTop > requiredJumpHeight &&
                cactusLeft < requiredCactusPosition &&
                cactusLeft > requiredCactusPosition - dinoWidth
            ) {
                if(!oneCollision) return;
                oneCollision = false;
                
                window.removeEventListener("keydown", dinoJump);
                window.removeEventListener("click", dinoJump);
                
                dinoIG.current.style.top = dinoTop + "px";

                cactusIG.current.style.animation = "";
                cactusIG.current.style.left = cactusLeft + "px";

                const endScore = parseInt(currentScore.toFixed(0));
                const nextHI = prevHI < endScore ? endScore : prevHI;
                
                dispatcher({ type: "GAME_OVER", payload: {
                    gameScore: endScore, highScore: nextHI
                }});
                
                setTimeout(() => {
                    gameOverModal.current.style.opacity = "1";
                    gameOverModal.current.style.top = "50%";
                }, 100);

                restartButton.current.onclick = () => {
                    gameOverModal.current.style.opacity = "0";
                    gameOverModal.current.style.top = "60%";

                    dinoGameHolder.current.style.filter = "";
                    
                    dinoIG.current.style.top = "";
                    cactusIG.current.style.left = "";
                    
                    setTimeout(() => {
                        dispatcher({ type: "RESTART_GAME" });
                        startGame(nextHI);
                    }, 500);
                }
            }
        }, 10);
    }
    
    return(
        <div className="dino" id="dino" ref={props.setRef}>
            {gameStarted ? <DinoGame
                startGame={() => startGame(highScore)}
                dinoGameHolder={dinoGameHolder}
                gameOver={gameOver}
                gameInfo={gameInfo}
                infoText={infoText}
                dinoIG={dinoIG}
                cactusIG={cactusIG}
                score={score}
                currentHI={currentHI}
                highScore={highScore}
                gameOverModal={gameOverModal}
                restartButton={restartButton}
                gameScore={gameScore}
                responsive={responsive}
            /> : <Heading
                {...state}
                dinoHeading={dinoHeading}
                startAnimation={startAnimation}
                headingImg={headingImg}
                headingH1={headingH1}
            />}
        </div>
    );
}

const Heading = (props) => {
    const {
        dinoHeading, startAnimation, headingImg,
        prepareGame, headingH1
    } = props;
    
    return(
        <div
            className="dino-heading"
            ref={dinoHeading}
            onClick={startAnimation}
        >
            <img
                src={dinoDino}
                alt="DINO"
                ref={headingImg}
                id={prepareGame ? "rotating-dino" : ""}
            />
            
            <h2 ref={headingH1}>dino</h2>
        </div>
    );
}

const DinoGame = (props) => {
    const {
        startGame, dinoGameHolder, gameOver,
        gameInfo, infoText, dinoIG,
        cactusIG, score, currentHI,
        highScore, responsive
    } = props;
    
    return(
        <div
            className="dino-game"
            id={gameOver ? "dino-game-over" : ""}
            onLoad={startGame}
            ref={dinoGameHolder}
        >
            {gameOver && <GameOver
                {...props}
            />}

            {gameInfo && !responsive && <p ref={infoText}>
                press <span>enter</span>, <span>space</span> or <span>arrow up</span> to jump.
            </p>}
            
            <img
                src={dinoDino}
                alt="DINO"
                className="dinoIG"
                ref={dinoIG}
            />

            <img
                src={dinoCactus}
                alt="CACTUS"
                className="cactusIG"
                ref={cactusIG}
            />

            <div className="dino-score">
                <strong ref={score}></strong>
                <strong ref={currentHI}>HI {highScore}</strong>
            </div>
        </div>
    );
}

const GameOver = (props) => {
    const {
        gameOverModal, restartButton, gameScore,
        highScore
    } = props;
    
    return(
        <div className="game-over" ref={gameOverModal}>
            <h3>game over</h3>

            <div className="scoreboard">
                <strong>score: <span>{gameScore}</span></strong>
                <strong>high score: <span>{highScore}</span></strong>
            </div>

            <button ref={restartButton}>restart</button>
        </div>
    );
}

export default Dino;