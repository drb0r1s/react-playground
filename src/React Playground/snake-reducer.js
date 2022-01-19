export function reducer(state, action) {
    const TYPE = {
        START: "START_GAME",
        CANVAS: "MAKE_CANVAS",
        END: "GAME_OVER",
        RESET: "RESET_GAME"
    };

    switch(action.type) {
        case TYPE.START:
            return {
                ...state,
                startGame: true
            }

        case TYPE.CANVAS:
            return {
                ...state,
                canvas: action.payload
            }

        case TYPE.END:
            return {
                ...state,
                gameOver: true,
                gameScore: action.payload
            }

        case TYPE.RESET:
            return {
                ...state,
                gameOver: false
            }

        default: throw new Error("No such action type!");
    }
}