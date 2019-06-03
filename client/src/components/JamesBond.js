import React, {useEffect, useState} from 'react'
import PlayerDisplay from "./PlayerDisplay"
import Choices from "./Choices"
import Modal from '../shared/Modal'
import Stats from './Stats'
import Rules from './Rules'
import UseGameStats from '../logic/UseGameStats'
import UseGameState from '../logic/UseGameState'
import UseReplayLogic from '../logic/UseReplayLogic'
import MenuBar from '../components/MenuBar'

function JamesBond(props) {
    // States
    
    const [waiting, setWaiting] = useState(false)
    const [gameStats, processStats, setGameStats] = UseGameStats()
    const [gameState, setOpponentMove, shoot, block, reload, resetGameState] = UseGameState(setWaiting, props.syncError, props.socket, processStats)
    const [replay, oppReplay] = UseReplayLogic(setWaiting, gameState, props.socket, resetGameState)
    const [showStatsModal, setShowStatsModal] = useState(false)
    const [showRulesModal, setShowRulesModal] = useState(false)

    // UseEffects
    useEffect(() => {
        setupSocket()
    }, [])

    // Socket Setup
    function setupSocket() {
        props.socket.on("Move", move => {
            setOpponentMove(move.move, move.turnNumber)
        })
        props.socket.on("SyncError", props.syncError)

        props.socket.on("Opponent Disconnected", () => {
            // This is hacky but due to state variable not updating in useEffect because we added empty array
            setGameStats(prevGameStats => {
                props.disconnected(prevGameStats)
                return prevGameStats
            })
            
        })

        props.socket.on("Replay", () => {
            oppReplay()
        })
    }

    return (
        <div>
            <p className="text-center name-banner">James Bond!</p>
            <h3 className="score-banner text-center">{gameStats.wins} - {gameStats.oppWins}</h3>
            <div className="container">
                <div className="row">
                    <div className={"col-5 offset-1 player-display " + (gameState.winner === "You" ? "winner-display" : "")}>
                        <PlayerDisplay side="You" 
                                        displayName="You"
                                        bullets={gameState.bullets}
                                        winner={gameState.winner}
                                        lastMove={gameState.turnNumber > 1 && gameState.moves[gameState.turnNumber - 2]}/>
                    </div>
                    <div className={"col-5 player-display " + (gameState.winner === "Opponent" ? "winner-display" : "")}>
                        <PlayerDisplay side="Opponent" 
                                        displayName="Them"
                                        bullets={gameState.opponentBullets}
                                        winner={gameState.winner}
                                        lastMove={gameState.turnNumber > 1 && gameState.opponentMoves[gameState.turnNumber - 2]}/>
                    </div>
                </div>
            </div>

            <Choices selection={gameState.moves[gameState.turnNumber - 1]}
                    selectionMade= {gameState.moves.length === gameState.turnNumber}
                    reload={reload}
                    block={block}
                    shoot={shoot}
                    bullets={gameState.bullets}
                    waiting={waiting}
                    turnNumber={gameState.turnNumber}
                    replay={replay}
                    winner={gameState.winner}/>

            <MenuBar openStatsModal={() => setShowStatsModal(true)}
                    openRulesModal={() => setShowRulesModal(true)}/>

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
