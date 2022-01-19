import React, { useState, useEffect, useRef } from "react";
import { typingData } from "./data";

const Typing = (props) => {
    const [randomText, setRandomText] = useState(typingData[Math.floor(Math.random() * typingData.length)]);
    const [isInterval, setIsInterval] = useState(false);
    const [wpm, setWpm] = useState("");
    const [isFinalWpm, setIsFinalWpm] = useState(false);
    
    const textField = useRef(null);
    const randomTextHolder = useRef(null);
    const textArea = useRef(null);
    const wpmField = useRef(null);
    const resetButton = useRef(null);
    
    useEffect(() => typing("typing speed"), []);
    
    useEffect(() => {
        let interval;
        let seconds = 0;

        if(isInterval) {
            interval = setInterval(() => {
                seconds++;

                const charactes = textArea.current.value.length;
                
                const calcWPM = (charactes / 5) / (seconds / 60);
                setWpm(calcWPM.toFixed(0));
            }, 1000);
        }

        return () => { clearInterval(interval) }
    }, [isInterval]);

    useEffect(() => {
        if(wpm) {
            setTimeout(() => {
                wpmField.current.style.opacity = "1";
                wpmField.current.style.top = "0";

                resetButton.current.style.opacity = "1";
                resetButton.current.style.top = "0";
            }, 100);
        }
    }, [wpm]);

    function typing(text) {
        let i = 0;
        let j = 0;

        startTyping();

        function startTyping() {
            if(text.length > i) {
                textField.current.innerHTML += text.charAt(i);
                i++;
            }

            if(text.length === i) deleteText();

            setTimeout(startTyping, text.length === i ? 50 : 150);
        }

        function deleteText() {
            if(text.length + 1 > j) {
                const deletedText = text.substring(0, text.length - j);
                textField.current.innerHTML = `test your ${deletedText}`;
                j++;
            }

            if(text.length + 1 === j) {
                i = 0;
                j = 0;
            }
        }
    }
    
    function checkText(event) {
        const inputValue = event.target.value;
        
        const errorArray = [];
        const tagText = "<span></span>";
        
        let showErrors = randomText;
        
        for(let i = 0; i < inputValue.length; i++) {
            if(inputValue[i] !== randomText[i]) {
                errorArray.push({
                    letter: randomText[i],
                    position: i
                });
            }
        }

        if(inputValue.length === randomText.length) {
            setIsInterval(false);
            setIsFinalWpm(true);
            
            textArea.current.disabled = true;
            randomTextHolder.current.style.color = "green";
            
            errorArray.forEach((error, index) => {
                showErrors = indexReplace(
                    showErrors,
                    error.position + index * tagText.length,
                    `<span>${error.letter}</span>`
                );
            
                randomTextHolder.current.innerHTML = showErrors;
            });
        }

        if(inputValue.length < randomText.length) {
            setIsInterval(true);
            randomTextHolder.current.style.color = "black";
        }
    }

    function indexReplace(field, index, newString) {
        return field.substr(0, index) + newString + field.substr(index + 1);
    }

    function resetText() {
        wpmField.current.style.opacity = "0";
        wpmField.current.style.top = "-10px";

        resetButton.current.style.opacity = "0";
        resetButton.current.style.top = "10px";

        setTimeout(() => {
            setRandomText(typingData[Math.floor(Math.random() * typingData.length)]);
        
            textArea.current.disabled = false;
            textArea.current.value = "";

            randomTextHolder.current.style.color = "";

            setIsInterval(false);
            setWpm("");
            setIsFinalWpm(false);
        }, 300);
    }
    
    return(
        <div className="typing" id="typing" ref={props.setRef}>
            <h2 ref={textField}>test your</h2>

            <p ref={randomTextHolder}>{randomText}</p>

            <textarea
                rows="5"
                colums="20"
                ref={textArea}
                maxLength={randomText.length}
                onKeyUp={checkText}
            ></textarea>

            {wpm && <p
                className="wpm-p"
                id={isFinalWpm ? "wpm-final" : ""}
                ref={wpmField}
            >{wpm} wpm</p>}

            {textArea.current?.value.length > 0 ? <button
                ref={resetButton}
                onClick={resetText}
            >try again?</button> : null}
        </div>
    );
}

export default Typing;