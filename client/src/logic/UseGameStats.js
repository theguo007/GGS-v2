import {useState} from 'react'

const UseGameStats = () => {
    const [gameStats, setGameStats] = useState({
        wins: 0,
        oppWins: 0,
        totalTurns: 0,
        // used to calculate average number of bullets in pocket
        bulletCount: 0,
        oppBulletCount: 0,
        totalReloads: 0,
        totalOppReloads: 0,
        totalBlocks: 0,
        totalOppBlocks: 0,
        totalShots: 0,
        totalOppShots: 0,
        totalKillShots: 0,
        totalOppKillShots: 0,
        totalLifeSavingBlocks: 0,
        totalOppLifeSavingBlocks: 0,
        totalBombKills: 0,
        totalOppBombKills: 0,
        totalBombs: 0,
        totalOppBombs: 0
    })

    function processStats(endGameState) {
        setGameStats(prevGameStats => {
            var bulletSum = 0
            var oppBulletSum = 0
            var totalReloads = 0
            var totalOppReloads = 0
            var totalBlocks = 0
            var totalOppBlocks = 0
            var totalShots = 0
            var totalOppShots = 0
            var totalLifeSavingBlocks = 0
            var totalOppLifeSavingBlocks = 0
            var totalBombs = 0
            var totalOppBombs = 0
            var totalBombKills = 0
            var totalOppBombKills = 0
            var totalKillShots = 0
            var totalOppKillShots = 0
            var bullets = 0
            var oppBullets = 0
            for(var count = 0; count < endGameState.turnNumber; count++){
                var move = endGameState.moves[count]
                var oppMove = endGameState.opponentMoves[count]
                bulletSum = bulletSum + bullets
                oppBulletSum = oppBulletSum + oppBullets
                switch(move){
                    case "Reload":
                        bullets++
                        totalReloads++
                        break;
                    case "Block":
                        totalBlocks++
                        if(oppMove === "Shoot") totalLifeSavingBlocks++
                        break;
                    case "Shoot":
                        totalShots++
                        if(count === endGameState.turnNumber - 1) totalKillShots++
                        break;
                    case "Bomb":
                        totalBombs++
                        if(count === endGameState.turnNumber - 1) totalBombKills++
                        break;
                    default:
                }
                switch(oppMove){
                    case "Reload":
                        oppBullets++
                        totalOppReloads++
                        break;
                    case "Block":
                        totalOppBlocks++
                        if(move === "Shoot") totalOppLifeSavingBlocks++
                        break;
                    case "Shoot":
                        totalOppShots++
                        if(count === endGameState.turnNumber - 1) totalOppKillShots++
                        break;
                    case "Bomb":
                        totalOppBombs++
                        if(count === endGameState.turnNumber - 1) totalOppBombKills++
                        break;
                    default:
                }
            }

            const gameStats = {
                ...prevGameStats,
                totalTurns: prevGameStats.totalTurns + endGameState.turnNumber,
                bulletCount: prevGameStats.bulletCount + bulletSum,
                oppBulletCount: prevGameStats.oppBulletCount + oppBulletSum,
                totalReloads: prevGameStats.totalReloads + totalReloads,
                totalOppReloads: prevGameStats.totalOppReloads + totalOppReloads,
                totalBlocks: prevGameStats.totalBlocks + totalBlocks,
                totalOppBlocks: prevGameStats.totalOppBlocks + totalOppBlocks,
                totalShots: prevGameStats.totalShots + totalShots,
                totalOppShots: prevGameStats.totalOppShots + totalOppShots,
                totalKillShots: prevGameStats.totalKillShots + totalKillShots,
                totalOppKillShots: prevGameStats.totalOppKillShots + totalOppKillShots,
                totalLifeSavingBlocks: prevGameStats.totalLifeSavingBlocks + totalLifeSavingBlocks,
                totalOppLifeSavingBlocks: prevGameStats.totalOppLifeSavingBlocks + totalOppLifeSavingBlocks,
                totalBombKills: prevGameStats.totalBombKills + totalBombKills,
                totalOppBombKills: prevGameStats.totalOppBombKills + totalOppBombKills,
                totalBombs: prevGameStats.totalBombs + totalBombs,
                totalOppBombs: prevGameStats.totalOppBombs + totalOppBombs,
            }

            if(endGameState.moves[endGameState.moves.length - 1] === "Shoot" || endGameState.moves[endGameState.moves.length - 1] === "Bomb"){
                gameStats.wins++
            } else {
                gameStats.oppWins++
            }
            return gameStats
        })
    }
    return [gameStats, processStats]
}

export default UseGameStats
