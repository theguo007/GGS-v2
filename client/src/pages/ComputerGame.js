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

    const [gameStats, processStats] = UseGameStats()
    const [gameState, setOpponentMove, shoot_helper, block_helper, reload_helper, resetGameState] = UseGameState(null, null, null, processStats)
    const [showStatsModal, setShowStatsModal] = useState(false)
    const [showRulesModal, setShowRulesModal] = useState(false)
    const [aggressiveness, setAggressiveness] = useState(3)

    function computerMove(){
        var choices = []
        var move = ""
        // Find possible smart moves
        if(gameState.opponentBullets >= 5){
            choices.push("Bomb")
        } else {
            choices.push("Reload")
            if (gameState.opponentBullets > 0){
                choices.push("Shoot")
            }
        }
        if(gameState.bullets > 0 && gameState.bullets < 5){
            choices.push("Block")
        }

        var benchmark= .5
        // Choose Move Randomly
        if(choices.length === 1){
            move = choices[0]
        } else if (choices.length === 2){
            if(gameState.bullets >= 5 || gameState.opponentBullets >=5){
                move = choices[Math.floor(Math.random()*choices.length)];
            } else if (gameState.bullets === 0){
                benchmark = Math.max((((aggressiveness - 3) * 10) + 50), 50)
                move = Math.random() <= benchmark/100 ? "Reload" : "Shoot"
            } else if (gameState.opponentBullets === 0){
                benchmark = Math.max((((3 - aggressiveness) * 10) + 50), 50)
                move = Math.random() <= benchmark/100 ? "Block" : "Reload"
            }
        } else {
            benchmark = ((aggressiveness - 1) * 12)
            if(Math.random() >= benchmark/100){
                var aggressiveOptions = choices.filter(value => value !== "Block");
                move = aggressiveOptions[Math.floor(Math.random()*aggressiveOptions.length)];
            } else {
                move = "Block"
            }
        }
        if(!move) {
            console.log("AI error...")
            move = "Block"
        }
        setOpponentMove(move)

        // Blocking 
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
                                        displayName= "You"
                                        bullets={gameState.bullets}
                                        winner={gameState.winner}
                                        lastMove={gameState.turnNumber > 1 && gameState.moves[gameState.turnNumber - 2]}/>
                    </div>
                    <div className={"col-5 player-display " + (gameState.winner === "Opponent" ? "winner-display" : "")}>
                        <PlayerDisplay side="Opponent" 
                                        displayName= "AI"
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
                    turnNumber={gameState.turnNumber}
                    replay={replay}                    
                    winner={gameState.winner}/>

            <MenuBar openStatsModal={() => setShowStatsModal(true)}
                    openRulesModal={() => setShowRulesModal(true)}>
                    <p className="text-center">AI Aggressiveness</p>
                    <Slider
                        value={aggressiveness}
                        onChange={onAggressivenessChange}
                        min={1}
                        max={5}
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
