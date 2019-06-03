import {useEffect, useState} from 'react'

function UseGameState(setWaiting, syncError, socket, processStats) {
    const [gameState, setGameState] = useState({
        winner: null,
        moves: [],
        opponentMoves: [],
        bullets: 0,
        opponentBullets: 0,
        turnNumber: 1
    })

    useEffect(() => {
        if (gameState.opponentMoves.length === gameState.turnNumber && gameState.moves.length === gameState.turnNumber){
            evaluateTurn()
        }
    })

    function setOpponentMove(move, turnNumber){
        setGameState(prevGameState => {
            if(turnNumber && turnNumber !== prevGameState.turnNumber){
                if(syncError) syncError()
            }
            return {
                ...prevGameState,
                opponentMoves: [...prevGameState.opponentMoves, move]
            }
        })
    }
    function evaluateTurn() {
        setGameState(prevGameState => {
            if (prevGameState.opponentMoves.length === prevGameState.turnNumber && prevGameState.moves.length === prevGameState.turnNumber) {
                const newGameState = { ...prevGameState }
                const myMove = prevGameState.moves[prevGameState.turnNumber - 1]
                const oppMove = prevGameState.opponentMoves[prevGameState.turnNumber - 1]
                switch (myMove) {
                    case "Reload":
                        newGameState.bullets++
                        break;
                    case "Shoot":
                        newGameState.bullets--
                        break;
                    case "Bomb":
                        newGameState.bullets = newGameState.bullets - 5
                        break;
                    default:
                }
                switch (oppMove) {
                    case "Reload":
                        newGameState.opponentBullets++
                        break;
                    case "Shoot":
                        newGameState.opponentBullets--
                        break;
                    case "Bomb":
                        newGameState.opponentBullets = newGameState.opponentBullets - 5
                        break;
                    default:
                }
                if(((oppMove === "Shoot" || oppMove === "Bomb" ) && myMove === "Reload") || (oppMove === "Bomb" && myMove === "Block")){
                    processStats(prevGameState)
                    newGameState.winner = "Opponent"
                }
                if(((myMove === "Shoot" || myMove === "Bomb" ) && oppMove === "Reload") || (myMove === "Bomb" && oppMove === "Block")){
                    processStats(prevGameState)
                    newGameState.winner = "You"
                }
                if(setWaiting) setWaiting(false)
                newGameState.turnNumber++
                return newGameState;
            }
        })
    }

    // Moves
    function shoot(){
        setGameState(prevGameState => {
            var moves = prevGameState.moves.slice()
            if(prevGameState.bullets >= 5){
                moves[prevGameState.turnNumber - 1] ="Bomb"
                if(socket) socket.emit("MakeMove",{move: "Bomb", turnNumber: prevGameState.turnNumber})
                if (setWaiting) setWaiting(true)
            }
            else if (prevGameState.bullets > 0){
                moves[prevGameState.turnNumber - 1] ="Shoot"
                if(socket) socket.emit("MakeMove",{move: "Shoot", turnNumber: prevGameState.turnNumber})
                if (setWaiting) setWaiting(true)
            }
            return {
                ...prevGameState,
                moves: moves
            }
        })        
    }

    function block(){
        setGameState(prevGameState => {
            var moves = prevGameState.moves.slice()
            moves[prevGameState.turnNumber - 1] ="Block"
            if(socket) socket.emit("MakeMove",{move: "Block", turnNumber: prevGameState.turnNumber})
            return {
                ...prevGameState,
                moves: moves
            }
        })
        if (setWaiting) setWaiting(true)
    }

    function reload(){
        setGameState(prevGameState => {
            var moves = prevGameState.moves.slice()
            moves[prevGameState.turnNumber - 1] ="Reload"
            if(socket) socket.emit("MakeMove",{move: "Reload", turnNumber: prevGameState.turnNumber})
            return {
                ...prevGameState,
                moves: moves
            }
        })        
        if (setWaiting) setWaiting(true)
    }

    function resetGameState(){
        setGameState({
            winner: null,
            moves: [],
            opponentMoves: [],
            bullets: 0,
            opponentBullets: 0,
            turnNumber: 1
        })
    }
    return [gameState, setOpponentMove, shoot, block, reload, resetGameState]
}

export default UseGameState
