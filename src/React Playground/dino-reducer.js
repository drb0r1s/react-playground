export function reducer(state, action) {
    const TYPE = {
        STORAGE: "STORAGE_HIGH_SCORE",
        PREPARE: "PREPARE_GAME",
        START: "START_GAME",
        INFO: "INFO_OFF",
        END: "GAME_OVER",
        RESTART: "RESTART_GAME"
    };

    switch(action.type) {
        case TYPE.STORAGE:
            return {
                ...state,
                highScore: action.payload
            }
        
        case TYPE.PREPARE:
            return {
                ...state,
                prepareGame: true
            }

        case TYPE.START:
            return {
                ...state,
                prepareGame: false,
                gameStarted: true
            }

        case TYPE.INFO:
            return {
                ...state,
                gameInfo: false
            }

        case TYPE.END:
            const { gameScore, highScore } = action.payload;
        
            return {
                ...state,
                gameOver: true,
                gameScore: gameScore,
                highScore: highScore
            }

        case TYPE.RESTART:
            return {
                ...state,
                gameInfo: true,
                gameOver: false,
                gameScore: 0
            }

        default: throw new Error("No such action type!");
    }
}