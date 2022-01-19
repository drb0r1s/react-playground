import React, { useState, useEffect, useRef, useReducer } from "react";
import { reducer } from "./number-reducer";

const Number = (props) => {
    const [value, setValue] = useState({
        from: 0, to: 10
    });

    const [guessValue, setGuessValue] = useState("");

    const defaultState = {
        number: "",
        range: [],
        warning: "",
        guessMode: false,
        result: "",
        resultColor: "",
        resetMode: false,
        gameOver: false
    };

    const [state, dispatcher] = useReducer(reducer, defaultState);

    const {
        number,
        range,
        warning,
        guessMode,
        result,
        resultColor,
        resetMode,
        gameOver
    } = state;

    const warningMsg = useRef(null);
    const numberSet = useRef(null);
    const numberGuess = useRef(null);
    const resultMsg = useRef(null);
    const guessGuess = useRef(null);
    const guessReset = useRef(null);
    
    useEffect(() => {
        if(warning) {
            setTimeout(() => {
                warningMsg.current.style.opacity = "1";
                warningMsg.current.style.top = "0";
            }, 100);

            setTimeout(() => {
                warningMsg.current.style.opacity = "0";
                warningMsg.current.style.top = "20px";
            }, 2500);
        }
    }, [warning]);

    useEffect(() => {
        if(result) {
            setTimeout(() => {
                resultMsg.current.style.opacity = "1";
                resultMsg.current.style.top = "0";
            }, 100);
        }
    }, [result]);
    
    function changeInput(event) {
        const inputValue = event.target.value;
        const inputName = event.target.name;

        setValue({...value, [inputName]: inputValue});
    }

    function generateNumber(event) {
        event.preventDefault();

        let min = isNaN(parseInt(value.from)) ? 0 : parseInt(value.from);
        let max = isNaN(parseInt(value.to)) ? min + 10 : parseInt(value.to);

        if(min < max) {
            numberSet.current.style.opacity = "0";
            
            setTimeout(() => {
                dispatcher({ type: "GUESS_MODE", payload: [min, max] });

                setTimeout(() => {
                    numberGuess.current.style.opacity = "1";
                }, 100);
            }, 500);
        }

        else {
            dispatcher({ type: "SET_NUMBER_WARNING" });

            setTimeout(() => {
                dispatcher({ type: "RESET_WARNING" });
            }, 3000);
        }
    }

    function submitNumber(event) {
        event.preventDefault();

        if(number === parseInt(guessValue)) {
            dispatcher({ type: "SUCCESSFULL_GUESS" });
        }

        if(number - parseInt(guessValue) < 0) {
            dispatcher({ type: "MIN_GUESS" });
        }

        if(number - parseInt(guessValue) > 0) {
            dispatcher({ type: "MAX_GUESS" });
        }
    }

    function showNumber() {
        guessGuess.current.style.opacity = "0";
        guessGuess.current.style.top = "-20px";

        setTimeout(() => {
            dispatcher({ type: "SHOW_NUMBER" });

            setTimeout(() => {
                guessReset.current.style.opacity = "1";
                guessReset.current.style.top = "0";
            }, 500);
        }, 500);
    }

    function resetNumber(event) {
        event.preventDefault();
        
        if(gameOver) {
            guessGuess.current.style.opacity = "0";
            guessGuess.current.style.top = "-20px";
        }

        else {
            guessReset.current.style.opacity = "0";
            guessReset.current.style.top = "-20px";
        }

        setTimeout(() => {
            dispatcher({ type: "RESET_NUMBER", payload: defaultState });
            setValue({ from: 0, to: 10 });
            setGuessValue("");

            numberSet.current.style.opacity = "0";
            
            setTimeout(() => {
                numberSet.current.style.opacity = "1";
            }, 500);
        }, 500);
    }
    
    return(
        <div className="number" id="number" ref={props.setRef}>
            <h2>guess the number</h2>

            {guessMode ? <Guess
                numberGuess={numberGuess}
                submitNumber={submitNumber}
                range={range}
                guessValue={guessValue}
                setGuessValue={setGuessValue}
                result={result}
                resultColor={resultColor}
                resultMsg={resultMsg}
                showNumber={showNumber}
                resetMode={resetMode}
                number={number}
                resetNumber={resetNumber}
                gameOver={gameOver}
                guessGuess={guessGuess}
                guessReset={guessReset}
            /> : <Set
                numberSet={numberSet}
                {...value}
                changeInput={changeInput}
                generateNumber={generateNumber}
                warning={warning}
                warningMsg={warningMsg}
            />}
        </div>
    );
}

const Set = (props) => {
    const {
        numberSet,
        from,
        to,
        changeInput,
        generateNumber,
        warning,
        warningMsg
    } = props;
    
    return(
        <div className="number-set" ref={numberSet}>
            <form onSubmit={generateNumber}>
                <input
                    type="number"
                    name="from"
                    placeholder="from"
                    min="0"
                    max="1000000"
                    value={from}
                    onChange={changeInput}
                />

                <input
                    type="number"
                    name="to"
                    placeholder="to"
                    min="0"
                    max="1000000"
                    value={to}
                    onChange={changeInput}
                />

                <button>generate</button>
            </form>

            {warning && <strong
                className="warning-msg"
                ref={warningMsg}
            >{warning}</strong>}
        </div>
    );
}

const Guess = (props) => {
    const {
        numberGuess,
        result,
        resultColor,
        resultMsg,
        resetMode
    } = props;
    
    return(
        <div className="number-guess" ref={numberGuess}>
            {result && <strong
                className="result-msg"
                ref={resultMsg}
                style={{ background: resultColor }}
            >{result}</strong>}
            
            {resetMode ? <GuessReset
                {...props}
            /> : <GuessGuess
                {...props}
            />}
        </div>
    );
}

const GuessGuess = (props) => {
    const {
        guessGuess,
        submitNumber,
        range,
        guessValue,
        setGuessValue,
        showNumber,
        resetNumber,
        gameOver
    } = props;
    
    return(
        <div className="guess-guess" ref={guessGuess}>
            <form onSubmit={gameOver ? resetNumber : submitNumber}>
                <input 
                    type="number"
                    placeholder={`${range[0]} - ${range[1]}`}
                    min={`${range[0]}`}
                    max={`${range[1]}`}
                    value={guessValue}
                    onChange={(event) => setGuessValue(event.target.value)}
                />

                <button>{gameOver ? "reset" : "guess"}</button>
            </form>

            {!gameOver && <button
                className="show-button"
                onClick={showNumber}
            >show number?</button>}
        </div>
    );
}

const GuessReset = (props) => {
    const { guessReset, number, resetNumber } = props;
    
    return(
        <div className="guess-reset" ref={guessReset}>
            <p className="show-p">{number}</p>
            <button
                className="show-button"
                onClick={resetNumber}
            >reset?</button>
        </div>
    );
}

export default Number;