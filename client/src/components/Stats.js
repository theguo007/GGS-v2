import React from 'react'

function Stats(props) {
    return (
        <div className="container">
            <div className="row">
                <div className="col-5 offset-1">
                    <h3 className="text-center">You</h3>
                    <p>Wins: {props.stats.wins}</p>
                </div>
                <div className="col-5">
                <h3 className="text-center">Opponent</h3>
                    <p>Wins: {props.stats.oppWins}</p>
                </div>
            </div>
        </div>
    )
}

export default Stats
