import React from 'react'

function Choices(props) {
    function middleChoices(){
        if(props.winner){
            return (
                <div className="text-center">
                    <button className="btn btn-primary" onClick={props.replay}>Play Again</button>                    
                </div>
            )
        }
        return <div className="text-center">
                    <button className={"btn mx-2 " + (props.selection === "Reload" ? "btn-success" : "btn-primary")} onClick={props.reload} disabled={props.selectionMade}>Reload</button>
                    <button className={"btn mx-2 " + (props.selection === "Block" ? "btn-success" : "btn-primary")} onClick={props.block} disabled={props.selectionMade}>Block</button>
                    <button className={"btn mx-2 " + ((props.selection === "Shoot" || props.selection === "Bomb") ? "btn-success" : "btn-primary")}onClick={props.shoot} 
                            disabled={props.bullets === 0 || props.selectionMade}>
                        {props.bullets < 5 ? "Shoot" : "Bomb"}
                    </button>
                </div>
    }
    

    return (
        <div>
            <p id="Choices-WaitingText" className={"text-center " + (!props.waiting ? "display-hidden" : "")}>Waiting for opponent...</p>
            <p id="Choices-TurnNumber" className="text-center">Turn Number: {props.turnNumber}</p>
            {middleChoices()}
        </div>
        
    )
}

export default Choices
