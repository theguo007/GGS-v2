import React from 'react'
import {withRouter} from 'react-router-dom'
import uuid from 'uuid'

function CreateNewGame(props) {
    return (
        <div id="CreateNewGame-CreateButton">
            <button  className="btn btn-success" onClick={() => props.history.push(`/computer`)}>Single Player</button>
            <button  className="btn btn-success" onClick={() => props.history.push(`/game/${uuid.v4()}`)}>Multiplayer</button>
        </div>
    )
}

export default withRouter(CreateNewGame)
