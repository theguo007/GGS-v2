import React from 'react'

function Choices(props) {
    if(props.winner){
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

    return (
        <div>
            <p id="Choices-TurnNumber">Turn Number: {props.turnNumber}</p>
            <div id="Choices-ButtonPanel">
                <button className={"btn " + (props.selection === "Reload" ? "btn-success" : "btn-primary")} onClick={props.reload} disabled={props.selectionMade}>Reload</button>
                <button className={"btn " + (props.selection === "Block" ? "btn-success" : "btn-primary")} onClick={props.block} disabled={props.selectionMade}>Block</button>
                <button className={"btn " + ((props.selection === "Shoot" || props.selection === "Bomb") ? "btn-success" : "btn-primary")}onClick={props.shoot} 
                        disabled={props.bullets === 0 || props.selectionMade}>
                    {props.bullets < 5 ? "Shoot" : "Bomb"}
                </button>
            </div>
            {props.waiting && <p id="Choices-WaitingText">Waiting for opponent...</p>}
        </div>
        
    )
}

export default Choices
