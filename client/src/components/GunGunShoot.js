import React, {useEffect, useState} from 'react'
import PlayerDisplay from "./PlayerDisplay"
import Choices from "./Choices"

function PrintGameState(state, beforeMessage){
    console.log(`${beforeMessage} \n
                My Moves: [${state.moves}] and bullets: ${state.bullets}\n
                My Opp Moves: [${state.opponentMoves}] and bullets: ${state.opponentBullets}\n
                Turn Number ${state.turnNumber}`)
}

function GunGunShoot(props) {
    const [gameState, setGameState] = useState({
        winner: null,
        moves: [],
        opponentMoves: [],
        bullets: 0,
        opponentBullets: 0,
        turnNumber: 1
    })
    const [waiting, setWaiting] = useState(false)

    useEffect(() =>{
        if (gameState.opponentMoves.length === gameState.turnNumber && gameState.moves.length === gameState.turnNumber){
            evaluateTurn()
        }
    })

    useEffect(() => {
        setupSocket()
    }, [])

    function setupSocket() {
        props.socket.on("Move", move => {
            setGameState(prevGameState => {
                return {
                    ...prevGameState,
                    opponentMoves: [...prevGameState.opponentMoves, move]
                }
            })
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
                    newGameState.winner = "Opponent"
                }
                if(((myMove === "Shoot" || myMove === "Bomb" ) && oppMove === "Reload") || (myMove === "Bomb" && oppMove === "Block")){
                    newGameState.winner = "You"
                }
                setWaiting(false)
                newGameState.turnNumber++
                return newGameState;
            }
        })
    }

    function shoot(){        
        setGameState(prevGameState => {
            if(prevGameState.bullets >= 5){
                var moves = prevGameState.moves.slice()
                moves[prevGameState.turnNumber - 1] ="Bomb"
                props.socket.emit("MakeMove","Bomb")
                return {
                    ...prevGameState,
                    moves: moves
                }
            }
            else if (prevGameState.bullets > 0){
                var moves = prevGameState.moves.slice()
                moves[prevGameState.turnNumber - 1] ="Shoot"
                props.socket.emit("MakeMove","Shoot")
                return {
                    ...prevGameState,
                    moves: moves
                }
            }
        })
        setWaiting(true)
    }

    function block(){
        setGameState(prevGameState => {
            var moves = prevGameState.moves.slice()
            moves[prevGameState.turnNumber - 1] ="Block"
            return {
                ...prevGameState,
                moves: moves
            }
        })
        props.socket.emit("MakeMove","Block")
        setWaiting(true)
    }

    function reload(){
        setGameState(prevGameState => {
            var moves = prevGameState.moves.slice()
            moves[prevGameState.turnNumber - 1] ="Reload"
            return {
                ...prevGameState,
                moves: moves
            }
        })
        props.socket.emit("MakeMove","Reload")
        setWaiting(true)
    }

    return (
        <div>
            <p className="text-center name-banner">Gun Gun Shoot!</p>
            <div className="row">
                <div className={"col-5 offset-1 player-display " + (gameState.winner === "You" ? "winner-display" : "")}>
                    <PlayerDisplay side="You" 
                                    bullets={gameState.bullets}
                                    winner={gameState.winner}
                                    lastMove={gameState.turnNumber > 1 && gameState.moves[gameState.turnNumber - 2]}/>
                </div>
                <div className={"col-5 player-display " + (gameState.winner === "Opponent" ? "winner-display" : "")}>
                    <PlayerDisplay side="Opponent" 
                                    bullets={gameState.opponentBullets}
                                    winner={gameState.winner}
                                    lastMove={gameState.turnNumber > 1 && gameState.opponentMoves[gameState.turnNumber - 2]}/>
                </div>
            </div>
            <Choices selection={gameState.moves[gameState.turnNumber - 1]}
                    selectionMade= {gameState.moves.length === gameState.turnNumber}
                    reload={reload}
                    block={block}
                    shoot={shoot}
                    bullets={gameState.bullets}
                    waiting={waiting}
                    turnNumber={gameState.turnNumber}/>
        </div>
    )
}

export default GunGunShoot
