import React, {useState, useEffect } from 'react'
import socketIOClient from "socket.io-client"
import uuidValidate from "uuid-validate"
import Constants from "../Constants"
import Waiting from "../components/Waiting"
import JamesBond from "../components/JamesBond"
import Error from "../components/ErrorLink"

let socket = null;

function Game(props) {
    const [isValidId, setIsValidId] = useState(true)
    const [gameStage, setGameStage] = useState("")

    useEffect(() => {        
        // verify uuid is correct:
        if(uuidValidate(props.match.params.id, 4)){
            setupSocket()
        } else {
            setIsValidId(false);
        }
    }, []);

    function setupSocket(){
        // socket.io connect
        socket = socketIOClient("localhost:4001");
            
        // send uuid from url
        socket.emit("GameId", props.match.params.id)
        
        socket.on("Waiting", () => {
            setGameStage("Waiting")
        })
        socket.on("Begin", ()=>{
            setGameStage("Begin")
        })
        socket.on("Full", ()=>{
            setGameStage("Full")
        })
    }

    return (
        <div>
            {gameStage === "Waiting" && <Waiting/>}
            {gameStage === "Begin" && <JamesBond socket={socket}/>}
            {gameStage === "FullGame" && <Error error={Constants.FullGame}/>}
            {!isValidId && <Error error={Constants.InvalidId}/>}
        </div>
    )
}

export default Game
