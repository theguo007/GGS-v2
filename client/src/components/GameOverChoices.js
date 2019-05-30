import React from 'react'

function GameOverChoices(props) {
    return (
        <div>
            <div id="GameOverChoices-ButtonPanel">
                <button className={"btn btn-primary"} onClick={props.replay}>Play Again</button>
                <button className={"btn btn-primary"} onClick={props.openRulesModal}>Rules</button>
                <button className={"btn btn-primary"} onClick={props.openStatsModal}>Stats</button>
            </div>
        </div>
    )
}

export default GameOverChoices
