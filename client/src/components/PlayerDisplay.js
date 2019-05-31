import React from 'react'

function PlayerDisplay(props) {
    function lastMovePicture(){
        switch(props.lastMove){
            case "Shoot":
                return <img className="last-move-pic" alt="shoot" src={ require('../assets/images/gun.png')}/>
            case "Bomb":
                return <img className="last-move-pic" alt="bomb" src={ require('../assets/images/bomb.png')}/>
            case "Block":
                return <img className="last-move-pic" alt="block" src={ require('../assets/images/shield.png')}/>
            case "Reload":
                return <img className="last-move-pic" alt="reload" src={ require('../assets/images/bullet.png')}/>
            default:
                return <div className="last-move-pic"></div>
        }
    }

    function bulletCount(){
        var countJsx = []
        var bulletCount = props.bullets
        var keyCount = 0
        while(bulletCount > 0){
            if(bulletCount >= 5){
                countJsx.push(<img key={keyCount++} className="bullet-count" alt="bomb" src={ require('../assets/images/bomb.png')}/>)
                bulletCount = bulletCount - 5
            } else {
                countJsx.push(<img key={keyCount++} className="bullet-count" alt="bomb" src={ require('../assets/images/bullet-vertical.png')}/>)
                bulletCount--
            }
        }
        return countJsx
    }

    return (
        <div>
            <p className="player-side">{props.side === "You" ? "You" : "Them"}</p>
            <div className="container">
                <div className="row">
                    <p className="col-6 player-bullets-text">Bullets</p>
                    {bulletCount()}                
                </div>
            </div>
            {lastMovePicture()}
            {props.winner === props.side && <p className="last-move-label">Winner!</p>}
        </div>
    )
}

export default PlayerDisplay
