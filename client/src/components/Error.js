import React from 'react'

function Error(props) {
    return (
        <div>
            <h1 className="text-center">Whoopsie Daisy I Muffed It Up Again!</h1>
            <p className="text-center col-md-6 offset-md-3 col-10 offset-1">{props.error}</p>
        </div>
    )
}

export default Error
