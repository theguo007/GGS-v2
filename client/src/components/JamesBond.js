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
        totalTurns: 0,
        // used to calculate average number of bullets in pocket
        bulletCount: 0,
        oppBulletCount: 0,
        totalReloads: 0,
        totalOppReloads: 0,
        totalBlocks: 0,
        totalOppBlocks: 0,
        totalShots: 0,
        totalOppShots: 0,
        totalKillShots: 0,
        totalOppKillShots: 0,
        totalLifeSavingBlocks: 0,
        totalOppLifeSavingBlocks: 0,
        totalBombKills: 0,
        totalOppBombKills: 0,
        totalBombs: 0,
        totalOppBombs: 0
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
                if(move.turnNumber !== prevGameState.turnNumber){
                    props.syncError()
                }
                return {
                    ...prevGameState,
                    opponentMoves: [...prevGameState.opponentMoves, move.move]
                }
            })
        })
        props.socket.on("SyncError", props.syncError)

        props.socket.on("Opponent Disconnected", () => {
            props.disconnected(props.stats)
        })

        props.socket.on("Replay", () => {
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
                    processStats(prevGameState)
                    newGameState.winner = "Opponent"
                }
                if(((myMove === "Shoot" || myMove === "Bomb" ) && oppMove === "Reload") || (myMove === "Bomb" && oppMove === "Block")){
                    processStats(prevGameState)
                    newGameState.winner = "You"
                }
                setWaiting(false)
                newGameState.turnNumber++
                return newGameState;
            }
        })
    }

    function processStats(endGameState) {
        setGameStats(prevGameStats => {
            var bulletSum = 0
            var oppBulletSum = 0
            var totalReloads = 0
            var totalOppReloads = 0
            var totalBlocks = 0
            var totalOppBlocks = 0
            var totalShots = 0
            var totalOppShots = 0
            var totalLifeSavingBlocks = 0
            var totalOppLifeSavingBlocks = 0
            var totalBombs = 0
            var totalOppBombs = 0
            var totalBombKills = 0
            var totalOppBombKills = 0
            var totalKillShots = 0
            var totalOppKillShots = 0
            var bullets = 0
            var oppBullets = 0
            for(var count = 0; count < endGameState.turnNumber; count++){
                var move = endGameState.moves[count]
                var oppMove = endGameState.opponentMoves[count]
                bulletSum = bulletSum + bullets
                oppBulletSum = oppBulletSum + oppBullets
                switch(move){
                    case "Reload":
                        bullets++
                        totalReloads++
                        break;
                    case "Block":
                        totalBlocks++
                        if(oppMove === "Shoot") totalLifeSavingBlocks++
                        break;
                    case "Shoot":
                        totalShots++
                        if(count === endGameState.turnNumber - 1) totalKillShots++
                        break;
                    case "Bomb":
                        totalBombs++
                        if(count === endGameState.turnNumber - 1) totalBombKills++
                        break;
                    default:
                }
                switch(oppMove){
                    case "Reload":
                        oppBullets++
                        totalOppReloads++
                        break;
                    case "Block":
                        totalOppBlocks++
                        if(move === "Shoot") totalOppLifeSavingBlocks++
                        break;
                    case "Shoot":
                        totalOppShots++
                        if(count === endGameState.turnNumber - 1) totalOppKillShots++
                        break;
                    case "Bomb":
                        totalOppBombs++
                        if(count === endGameState.turnNumber - 1) totalOppBombKills++
                        break;
                    default:
                }
            }

            const gameStats = {
                ...prevGameStats,
                totalTurns: prevGameStats.totalTurns + endGameState.turnNumber,
                bulletCount: prevGameStats.bulletCount + bulletSum,
                oppBulletCount: prevGameStats.oppBulletCount + oppBulletSum,
                totalReloads: prevGameStats.totalReloads + totalReloads,
                totalOppReloads: prevGameStats.totalOppReloads + totalOppReloads,
                totalBlocks: prevGameStats.totalBlocks + totalBlocks,
                totalOppBlocks: prevGameStats.totalOppBlocks + totalOppBlocks,
                totalShots: prevGameStats.totalShots + totalShots,
                totalOppShots: prevGameStats.totalOppShots + totalOppShots,
                totalKillShots: prevGameStats.totalKillShots + totalKillShots,
                totalOppKillShots: prevGameStats.totalOppKillShots + totalOppKillShots,
                totalLifeSavingBlocks: prevGameStats.totalLifeSavingBlocks + totalLifeSavingBlocks,
                totalOppLifeSavingBlocks: prevGameStats.totalOppLifeSavingBlocks + totalOppLifeSavingBlocks,
                totalBombKills: prevGameStats.totalBombKills + totalBombKills,
                totalOppBombKills: prevGameStats.totalOppBombKills + totalOppBombKills,
                totalBombs: prevGameStats.totalBombs + totalBombs,
                totalOppBombs: prevGameStats.totalOppBombs + totalOppBombs,
            }

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
            var moves = prevGameState.moves.slice()
            if(prevGameState.bullets >= 5){
                moves[prevGameState.turnNumber - 1] ="Bomb"
                props.socket.emit("MakeMove",{move: "Bomb", turnNumber: prevGameState.turnNumber})
            }
            else if (prevGameState.bullets > 0){
                moves[prevGameState.turnNumber - 1] ="Shoot"
                props.socket.emit("MakeMove",{move: "Shoot", turnNumber: prevGameState.turnNumber})
                
            }
            return {
                ...prevGameState,
                moves: moves
            }
        })
        setWaiting(true)
    }

    function block(){
        setGameState(prevGameState => {
            var moves = prevGameState.moves.slice()
            moves[prevGameState.turnNumber - 1] ="Block"
            props.socket.emit("MakeMove",{move: "Block", turnNumber: prevGameState.turnNumber})
            return {
                ...prevGameState,
                moves: moves
            }
        })
        setWaiting(true)
    }

    function reload(){
        setGameState(prevGameState => {
            var moves = prevGameState.moves.slice()
            moves[prevGameState.turnNumber - 1] ="Reload"
            props.socket.emit("MakeMove",{move: "Reload", turnNumber: prevGameState.turnNumber})
            return {
                ...prevGameState,
                moves: moves
            }
        })        
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
