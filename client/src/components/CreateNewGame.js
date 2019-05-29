import React from 'react'
import {withRouter} from 'react-router-dom'
import uuid from 'uuid'

function CreateNewGame(props) {
    return (
        <div>
            <button id="CreateNewGame-CreateButton" className="btn btn-success" onClick={() => props.history.push(`/game/${uuid.v4()}`)}>Create Game</button>
        </div>
    )
}

export default withRouter(CreateNewGame)
