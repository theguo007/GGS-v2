import React from 'react'
import CreateNewGame from '../components/CreateNewGame'

function Start() {
    return (
        <div>
            <p className="text-center name-banner">Gun Gun Shoot!</p>
            <div className="rules-div">
                <p>Rules:</p>
                <p>You have four moves you can make:</p>
                <ol>
                    <li>Reload - You obtain a bullet but are vulnerable to any shot</li>
                    <li>Block - You defend yourself from a potential shot (but not a bomb)</li>
                    <li>Shoot - You use (and lose) a bullet but win the game if opponent is reloading. You are also safe from any shot.</li>
                    <li>Bomb - You use (and lose) five bullets but win if opponent is reloading or blocking. When you reach five bullets, you lose the ability to shoot normally and you must use a bomb. You are also safe from any shot.</li>
                </ol>
                <p>
                    Good Luck!
                </p>
            </div>
            <CreateNewGame/>
        </div>
    )
}

export default Start
