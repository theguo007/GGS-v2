import React, {useState} from 'react'
import PlayerDisplay from '../components/PlayerDisplay'
import Choices from '../components/Choices'
import Modal from '../shared/Modal'
import Stats from '../components/Stats'
import Rules from '../components/Rules'
import UseGameState from '../logic/UseGameState'
import UseGameStats from '../logic/UseGameStats'
import MenuBar from '../components/MenuBar'
import Slider from 'react-rangeslider'
import 'react-rangeslider/lib/index.css'

function ComputerGame() {

    const [waiting, setWaiting] = useState(false)
    const [gameStats, processStats] = UseGameStats()
    const [gameState, setOpponentMove, shoot_helper, block_helper, reload_helper, resetGameState] = UseGameState(setWaiting, () => {}, null, processStats)
    const [showStatsModal, setShowStatsModal] = useState(false)
    const [showRulesModal, setShowRulesModal] = useState(false)
    const [aggressiveness, setAggressiveness] = useState(67)

    function computerMove(){
        var choices = []
        var move = ""
        // Find possible smart moves
        if(gameState.opponentBullets >= 5){
            choices.push("Bomb")
        } else {
            choices.push("Reload")
            if (gameState.opponentBullets >= 0){
                choices.push("Shoot")
            }
        }
        if(gameState.bullets > 0 && gameState.bullets < 5){
            choices.push("Block")
        }

        // Choose Move Randomly
        if(choices.includes("Block")){
            if(Math.random() <= (aggressiveness / 100)){
                var aggressiveOptions = choices.filter(value => value !== "Block");
                move = aggressiveOptions[Math.floor(Math.random()*aggressiveOptions.length)];
            } else {
                move = "Block"
            }
        } else {
            move = choices[Math.floor(Math.random()*choices.length)];
        }
        setOpponentMove(move)
    }

    function shoot(){
        computerMove()
        shoot_helper()
    }

    function block(){
        computerMove()
        block_helper()
    }

    function reload(){
        computerMove()
        reload_helper()
    }

    function replay(){
        resetGameState()
    }

    function onAggressivenessChange(value){
        setAggressiveness(value)
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
                                        alternateName= "AI"
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
                    openRulesModal={() => setShowRulesModal(true)}>
                    <p className="text-center">AI Aggressiveness</p>
                    <Slider
                        value={aggressiveness}
                        onChange={onAggressivenessChange}
                        min={10}
                    />
            </MenuBar>

            <Modal show={showStatsModal} handleClose={() => setShowStatsModal(false)}>
                <Stats stats={gameStats}/>
            </Modal>

            <Modal show={showRulesModal} handleClose={() => setShowRulesModal(false)}>
                <Rules/>
            </Modal>
        </div>
    )
}

export default ComputerGame
