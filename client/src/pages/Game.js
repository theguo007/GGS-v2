import React, {useState, useEffect } from 'react'
import socketIOClient from "socket.io-client"
import uuidValidate from "uuid-validate"
import Constants from "../Constants"
import Waiting from "../components/Waiting"
import JamesBond from "../components/JamesBond"
import Error from "../components/Error"
import Stats from '../components/Stats';

let socket = null;

function Game(props) {
    const [isValidId, setIsValidId] = useState(true)
    const [gameStage, setGameStage] = useState("")
    const [stats, setStats] = useState({})
    const [checkingInterval, setCheckingInterval] = useState(null)

    useEffect(() => {        
        //verify uuid is correct:
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
            setCheckingInterval(setInterval(function(){ socket.emit("Is Opponent Still There") }, 30000))
        })
        socket.on("Full", ()=>{
            setGameStage("Full")
        })
    }

    function syncError(){
        setGameStage("SyncError")
        socket.emit("SyncError")
    }

    function disconnected(stats){
        clearInterval(checkingInterval)
        setStats(stats)
        setGameStage("Disconnected")
    }

    return (
        <div>
            {gameStage === "Waiting" && <Waiting/>}
            {gameStage === "Begin" && <JamesBond socket={socket} syncError={syncError} disconnected={disconnected}/>}
            {gameStage === "FullGame" && <Error error={Constants.FullGame}/>}
            {gameStage === "SyncError" && <Error error={Constants.SyncError}/>}
            {!isValidId && <Error error={Constants.InvalidId}/>}
            {gameStage === "Disconnected" && <div>
                <h4 className="text-center">Sorry your opponent disconnected, but here's some stats to cheer you up!</h4><Stats stats={stats}/>
            </div> 
            }
        </div>
    )
}

export default Game
