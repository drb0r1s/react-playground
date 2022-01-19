import React, { useState, useEffect, useRef, useReducer } from "react";
import { diceData, diceDataDice } from "./data";
import { reducer } from "./dice-reducer";
import diceX from "./images/dice-modal-x.svg";

const Dice = (props) => {
    const [players, setPlayers] = useState({
        player1: diceData[0],
        player2: diceData[1]
    });
    
    const allPlayers = Object.values(players);
    const allPlayersKeys = Object.keys(players);
    
    const [bannedValue, setBannedValue] = useState("");
    const [isRolled, setIsRolled] = useState(false);
    
    const defaultState = {
        warning: "",
        gameStarted: false,
        bannedSide: "",
        currentPlayer: "",
        currentTurn: {},
        currentDice: "",
        endGame: false,
        winner: "",
        playersAfter: []
    };
    
    const [state, dispatcher] = useReducer(reducer, defaultState);

    const {
        warning,
        gameStarted,
        bannedSide,
        currentPlayer,
        currentTurn,
        endGame
    } = state;

    
    const warningMsg = useRef(null);
    const gameSet = useRef(null);
    const gameStart = useRef(null);
    const realDice = useRef(null);
    const rollButton = useRef(null);
    const endButton = useRef(null);
    const diceModal = useRef(null);
    
    useEffect(() => {
        if(warning) {
            warningMsg.current.style.opacity = "1";
            warningMsg.current.style.top = "0";

            setTimeout(() => {
                warningMsg.current.style.opacity = "0";
                warningMsg.current.style.top = "5px";
            }, 2500);
        }
    }, [warning]);

    useEffect(() => {
        if(endGame) {
            diceModal.current.style.opacity = "1";
            diceModal.current.style.top = "50%";
        }
    }, [endGame]);

    function changePlayerName(event) {
        const inputName = event.target.name;
        const inputValue = event.target.value;

        const getIndex = inputName.substr(inputName.length - 1);
        
        setPlayers({
            ...players, [inputName]: {
                ...allPlayers[parseInt(getIndex) - 1], name: inputValue
            }
        });
    }

    function submitBannedNumber(event) {
        event.preventDefault();
        
        if(bannedValue >= 1 && bannedValue <= 6) {
            gameSet.current.style.opacity = "0";
            gameSet.current.style.top = "10px";
            
            setTimeout(() => {
                const randomPlayer = allPlayers[Math.floor(Math.random() * allPlayers.length)];

                allPlayersKeys.forEach((player) => {
                    const getPlayerId = player.substr(player.length - 1);
                    
                    if(parseInt(getPlayerId) === randomPlayer.id) {
                        dispatcher({ type: "SET_PLAYER", payload: player });
                    }
                });

                allPlayers.forEach((player, index) => {
                    if(player.name.length === 0) player.name = `Player ${index + 1}`;
                });
                
                dispatcher({ type: "GAME_START", payload: {
                    banned: bannedValue, player: randomPlayer
                }});

                setBannedValue("");
            }, 500);

            setTimeout(() => {
                gameStart.current.style.opacity = "1";
                gameStart.current.style.top = "0";
            }, 1000);
        }

        else if(bannedValue.length === 0) {
            dispatcher({ type: "NO_LENGTH_WARNING" });

            setTimeout(() => {
                dispatcher({ type: "REMOVE_WARNING" });
            }, 3000);
        }

        else {
            dispatcher({ type: "BANNED_WARNING" });

            setTimeout(() => {
                dispatcher({ type: "REMOVE_WARNING" });
            }, 3000);
        }
    }

    function rollDice() {
        if(realDice.current.style.transform === "rotate(360deg)") {
            realDice.current.style.transform = "rotate(-360deg)";
        }

        else {
            realDice.current.style.transform = "rotate(360deg)";
        }

        rollButton.current.disabled = true;
        endButton.current.disabled = true;
        
        setTimeout(() => {
            const randomDice = Math.floor(Math.random() * diceDataDice.length);
            realDice.current.src = diceDataDice[randomDice];

            dispatcher({ type: "SET_DICE", payload: randomDice });

            if(randomDice < 0) return;

            rollButton.current.disabled = false;
            endButton.current.disabled = false;

            setIsRolled(true);
        
            if(randomDice + 1 === parseInt(bannedSide)) {
                const getWinner = allPlayers[0].points > allPlayers[1].points ?
                    allPlayers[0].name
                : allPlayers[1].name;

                const allPlayersAfter = [];

                allPlayers.forEach((player) => {
                    allPlayersAfter.push({
                        name: player.name,
                        points: player.points
                    });
                });
                
                allPlayers.forEach((player) => {
                    player.name = "";
                    player.points = 0;
                });

                setIsRolled(false);
                
                return dispatcher({ type: "RESET_GAME", payload: {
                    defaultState: defaultState,
                    winner: getWinner,
                    allPlayersAfter: allPlayersAfter
                }});
            }
            
            const getIndex = currentPlayer.substr(currentPlayer.length - 1);
        
            currentTurn.points += randomDice + 1;
        
            setPlayers({
                ...players, [currentPlayer]: {
                    ...allPlayers[parseInt(getIndex) - 1], points: currentTurn.points
                }
            });
        }, 200);
    }

    function endTurn() {
        if(!isRolled) return;
        setIsRolled(false);
        
        const switchPlayer = allPlayers.find((player) =>
            player.id !== currentTurn.id
        );

        allPlayersKeys.forEach((player) => {
            const getPlayerId = player.substr(player.length - 1);

            if(parseInt(getPlayerId) === switchPlayer.id) {
                dispatcher({ type: "SET_PLAYER", payload: player });
            }
        });

        dispatcher({ type: "SWITCH_PLAYER", payload: switchPlayer });
    }

    function cancelModal() {
        diceModal.current.style.opacity = "0";
        diceModal.current.style.top = "40%";

        setTimeout(() => {
            dispatcher({ type: "CANCEL_MODAL" });
        }, 500);
    }
    
    return(
        <div className="dice" id="dice" ref={props.setRef}>
            {endGame && <Modal
                diceModal={diceModal}
                cancelModal={cancelModal}
                {...state}
            />}
            
            <div className="container">
                <div className="row player-holder">
                    {Object.values(players).map((player, index) => {
                        return <Player
                            key={player.id}
                            currentTurn={currentTurn}
                            {...player}
                            index={index}
                            changePlayerName={changePlayerName}
                        />
                    })}
                        
                    <img src={diceDataDice[0]} alt="DICE" ref={realDice}/>
                </div>
            </div>


            <div className="game-holder">
                {gameStarted ? <GameStart
                    {...state}
                    gameStart={gameStart}
                    rollDice={rollDice}
                    endTurn={endTurn}
                    rollButton={rollButton}
                    endButton={endButton}
                    isRolled={isRolled}
                /> : <GameSet
                    {...state}
                    submitBannedNumber={submitBannedNumber}
                    gameSet={gameSet}
                    bannedValue={bannedValue}
                    setBannedValue={setBannedValue}
                    warningMsg={warningMsg}
                />}
            </div>
        </div>
    );
}

const Player = (props) => {
    const { currentTurn, id, name, points, index, changePlayerName } = props;
    
    return(
        <div
            className="col-md-6 player"
            id={currentTurn.id === id ? "current-turn" : ""}
        >
            <input
                type="text"
                name={`player${index + 1}`}
                placeholder={`Player ${index + 1}`}
                maxLength="16"
                value={name}
                onChange={changePlayerName}
            />
            
            <div className="player-points">
                <p>points</p>
                <p className="point-counter">{points}</p>
            </div>
        </div>
    );
}

const GameSet = (props) => {
    const {
        submitBannedNumber,
        gameSet,
        bannedValue,
        setBannedValue,
        warning,
        warningMsg
    } = props;
    
    return(
        <form onSubmit={submitBannedNumber} ref={gameSet}>
            <input
                type="number"
                placeholder="Banned side (e.g. 3)"
                value={bannedValue}
                onChange={(event) => setBannedValue(event.target.value)}
            />

            {warning && <p
                className="warning-msg"
                ref={warningMsg}
            >{warning}</p>}
                    
            <button>start game</button>
        </form>
    );
}

const GameStart = (props) => {
    const {
        gameStart,
        bannedSide,
        currentTurn,
        rollDice,
        endTurn,
        rollButton,
        endButton,
        isRolled
    } = props;

    const { name } = currentTurn;
    
    return(
        <div className="game-start" ref={gameStart}>
            <div className="banned-info">
                <strong>banned side:</strong>
                
                <img
                    src={diceDataDice[parseInt(bannedSide) - 1]}
                    alt="DICE"
                />
            </div>

            <p className="game-turn">turn: {name}</p>

            <div className="game-options">
                <button onClick={rollDice} ref={rollButton}>roll</button>
                <button
                    onClick={endTurn}
                    id={isRolled ? "" : "disabled-button"}
                    ref={endButton}
                >end turn</button>
            </div>
        </div>
    );
}

const Modal = (props) => {
    const {
        diceModal,
        cancelModal,
        winner,
        playersAfter
    } = props;
    
    return(
        <div className="dice-modal" ref={diceModal}>
            <img src={diceX} alt="X" onClick={cancelModal} />
            
            <h3>game over</h3>
            <strong>winner: <span>{winner}</span></strong>
            
            <div className="modal-result">
                <p className="result-p">result:</p>

                {playersAfter.map((player, index) => {
                    return <p key={index}>{player.name}: <span>{player.points}</span></p>;
                })}
            </div>
        </div>
    );
}

export default Dice;