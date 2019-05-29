import React from 'react'
import {withRouter} from 'react-router-dom'

function Waiting(props) {
    return (
        <div>
            <h2 className="text-center">Waiting for opponent to join...</h2>
            <h5 id="Waiting-CopyText" className="text-center">Please copy and paste URL to friend</h5>
            <div id="Waiting-UrlDiv">
                <input id="Waiting-Url" className="text-center" value={window.location} readOnly/>
            </div>

        </div>
    )
}

export default withRouter(Waiting)

