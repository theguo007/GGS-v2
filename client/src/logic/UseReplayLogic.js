import {useState, useEffect} from 'react'

function UseReplayLogic(setWaiting, gameState, socket, resetGameState) {
    const [replayHandshake, setReplayHandshake] = useState({
        replay: false,
        oppReplay: false
    })

    useEffect(() =>{
        if(gameState.winner){
            reset()
        }
    })

    // Resetting Game
    function replay(){
        setWaiting(true)
        setReplayHandshake({...replayHandshake, replay: true})
        socket.emit("Replay")
    }

    function oppReplay(){
        setReplayHandshake(prevReplayHandshake => {
            return {...prevReplayHandshake, oppReplay: true}
        })
    }

    function reset(){
        if(replayHandshake.replay && replayHandshake.oppReplay){
            setReplayHandshake(() => {
                setWaiting(false)
                resetGameState()
                return {
                    replay: false,
                    oppReplay: false
                }
            })
        }
    }

    return [replay, oppReplay]
}

export default UseReplayLogic
