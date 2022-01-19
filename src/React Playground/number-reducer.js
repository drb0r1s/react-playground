export function reducer(state, action) {
    const TYPE = {
        GUESS: "GUESS_MODE",
        NUMBER_WARNING: "SET_NUMBER_WARNING",
        RESET_WARNING: "RESET_WARNING",
        GUESS_TRUE: "SUCCESSFULL_GUESS",
        MIN_GUESS: "MIN_GUESS",
        MAX_GUESS: "MAX_GUESS",
        RESET_GUESS: "SHOW_NUMBER",
        RESET_GAME: "RESET_NUMBER"
    };
    
    switch(action.type) {
        case TYPE.GUESS:
            const min = action.payload[0];
            const max = action.payload[1];
            
            return {
                ...state,
                number: Math.floor(Math.random() * (max - min) + min),
                range: [min, max],
                guessMode: true
            }

        case TYPE.NUMBER_WARNING:
            return {
                ...state,
                warning:  "The second number must be greater than the first."
            }

        case TYPE.RESET_WARNING:
            return {
                ...state,
                warning: ""
            }
        
        case TYPE.GUESS_TRUE:
            return {
                ...state,
                result: "Correct!",
                resultColor: "#379ede",
                gameOver: true
            }

        case TYPE.MIN_GUESS:
            return {
                ...state,
                result: "It is a smaller number!",
                resultColor: "grey"
            }

        case TYPE.MAX_GUESS:
            return {
                ...state,
                result: "It is a bigger number!",
                resultColor: "grey"
            }

        case TYPE.RESET_GUESS:
            return {
                ...state,
                result: `Number is: ${state.number}.`,
                resultColor: "#0099ff",
                resetMode: true
            }
        
        case TYPE.RESET_GAME:
            return { ...action.payload };
            
        default: throw new Error("No such action type!");
    }
}