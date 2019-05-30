import React, {useEffect, useState} from 'react'
import PlayerDisplay from "./PlayerDisplay"
import Choices from "./Choices"
import GameOverChoices from "./GameOverChoices"
import Modal from '../shared/Modal';
import Stats from './Stats';
import Rules from './Rules';

function PrintGameState(state, beforeMessage){
    console.log(`${beforeMessage} \n
                My Moves: [${state.moves}] and bullets: ${state.bullets}\n
                My Opp Moves: [${state.opponentMoves}] and bullets: ${state.opponentBullets}\n
                Turn Number ${state.turnNumber}`)
}

function JamesBond(props) {
    // States
    const [gameState, setGameState] = useState({
        winner: null,
        moves: [],
        opponentMoves: [],
        bullets: 0,
        opponentBullets: 0,
        turnNumber: 1
    })
    const [waiting, setWaiting] = useState(false)
    const [replayHandshake, setReplayHandshake] = useState({
        replay: false,
        oppReplay: false
    })
    const [gameStats, setGameStats] = useState({
        wins: 0,
        oppWins: 0,
    })
    const [showStatsModal, setShowStatsModal] = useState(false)
    const [showRulesModal, setShowRulesModal] = useState(false)

    // UseEffects
    useEffect(() =>{
        if(gameState.winner){
            reset()
        }
        if (gameState.opponentMoves.length === gameState.turnNumber && gameState.moves.length === gameState.turnNumber){
            evaluateTurn()
        }
    })

    useEffect(() => {
        setupSocket()
    }, [])

    // Socket Setup
    function setupSocket() {
        props.socket.on("Move", move => {
            setGameState(prevGameState => {
                return {
                    ...prevGameState,
                    opponentMoves: [...prevGameState.opponentMoves, move]
                }
            })
        })
        props.socket.on("Replay", () => {
            console.log("received replay. ")
            setReplayHandshake(prevReplayHandshake => {
                return {...prevReplayHandshake, oppReplay: true}
            })
        })
    }

    // Evaluations
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
                    processStats()
                    newGameState.winner = "Opponent"
                }
                if(((myMove === "Shoot" || myMove === "Bomb" ) && oppMove === "Reload") || (myMove === "Bomb" && oppMove === "Block")){
                    processStats()
                    newGameState.winner = "You"
                }
                setWaiting(false)
                newGameState.turnNumber++
                return newGameState;
            }
        })
    }

    function processStats() {
        setGameStats(prevGameStats => {
            const gameStats = {...prevGameStats}
            if(gameState.moves[gameState.moves.length - 1] === "Shoot" || gameState.moves[gameState.moves.length - 1] === "Bomb"){
                gameStats.wins++
            } else {
                gameStats.oppWins++
            }
            return gameStats
        })
        
    }

    // Moves
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

    // Resetting Game
    function replay(){
        setWaiting(true)
        setReplayHandshake({...replayHandshake, replay: true})
        props.socket.emit("Replay")
    }

    function reset(){
        if(replayHandshake.replay && replayHandshake.oppReplay){
            setReplayHandshake(() => {
                setWaiting(false)
                setGameState({
                    winner: null,
                    moves: [],
                    opponentMoves: [],
                    bullets: 0,
                    opponentBullets: 0,
                    turnNumber: 1
                })
                return {
                    replay: false,
                    oppReplay: false
                }
            })
        }
    }    

    return (
        <div>
            <p className="text-center name-banner">James Bond!</p>
            <h3 className="score-banner text-center">{gameStats.wins} - {gameStats.oppWins}</h3>
            <div className="container">
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
            </div>

            {gameState.winner === null && 
            <Choices selection={gameState.moves[gameState.turnNumber - 1]}
                    selectionMade= {gameState.moves.length === gameState.turnNumber}
                    reload={reload}
                    block={block}
                    shoot={shoot}
                    bullets={gameState.bullets}
                    waiting={waiting}
                    turnNumber={gameState.turnNumber}/>}

            { gameState.winner !== null && 
            <GameOverChoices replay={replay}
                            openStatsModal={() => setShowStatsModal(true)}
                            openRulesModal={() => setShowRulesModal(true)}/>}

            <Modal show={showStatsModal} handleClose={() => setShowStatsModal(false)}>
                <Stats stats={gameStats}/>
            </Modal>

            <Modal show={showRulesModal} handleClose={() => setShowRulesModal(false)}>
                <Rules/>
            </Modal>
        </div>
    )
}

export default JamesBond
