export function reducer(state, action) {
    const TYPE = {
        BANNED_WARNING: "BANNED_WARNING",
        NO_LENGTH_WARNING: "NO_LENGTH_WARNING",
        REMOVE_WARNING: "REMOVE_WARNING",
        GAME_START: "GAME_START",
        SET_PLAYER: "SET_PLAYER",
        END_TURN: "SWITCH_PLAYER",
        SET_DICE: "SET_DICE",
        RESET: "RESET_GAME",
        CANCEL_MODAL: "CANCEL_MODAL"
    }

    switch(action.type) {
        case TYPE.BANNED_WARNING:
            return {
                ...state,
                warning: "Banned side must be between 1 and 6."
            }

        case TYPE.NO_LENGTH_WARNING:
            return {
                ...state,
                warning: "You must enter the banned side value."
            }

        case TYPE.REMOVE_WARNING:
            return {
                ...state,
                warning: ""
            }

        case TYPE.GAME_START:
            const { banned, player } = action.payload;
        
            return {
                ...state,
                gameStarted: true,
                bannedSide: banned,
                currentTurn: player
            }

        case TYPE.SET_PLAYER:
            return {
                ...state,
                currentPlayer: action.payload
            }

        case TYPE.END_TURN:
            return {
                ...state,
                currentTurn: action.payload
            }

        case TYPE.SET_DICE:
            return {
                ...state,
                currentDice: action.payload + 1
            }

        case TYPE.RESET:
            const { defaultState, winner, allPlayersAfter } = action.payload;
            
            return {
                ...defaultState,
                endGame: true,
                winner: winner,
                playersAfter: allPlayersAfter
            }

        case TYPE.CANCEL_MODAL:
            return {
                ...state,
                endGame: false,
                winner: "",
                playersAfter: []
            }

        default: throw new Error("No such action type!");
    }
}