import React from 'react'
import CreateNewGame from '../components/CreateNewGame'
import Rules from '../components/Rules';

function Start() {
    return (
        <div>
            <p className="text-center name-banner">James Bond!</p>
            <Rules/>
            <CreateNewGame/>
        </div>
    )
}

export default Start
