import React from 'react'

function Stats({stats}) {
    function Ratio(x, y){
        if(y === 0){
            return "NA"
        }
        return x/y
    }
    if (!stats || (Object.keys(stats).length === 0 && stats.constructor === Object)){
        return <p className="text-center">No games played yet. No stats for you</p>
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-5 offset-1">
                    <h3 className="text-center">You</h3>
                    <p>Wins: {stats.wins}</p>
                    <p>Average # of Bullets in Hand: {Ratio(stats.bulletCount, stats.totalTurns)}</p>
                    <p>Reload to Block Ratio: {Ratio(stats.totalReloads,stats.totalBlocks)}</p>
                    <p>Blocks to Lifesaving Blocks Ratio: {Ratio(stats.totalBlocks,stats.totalLifeSavingBlocks)}</p>
                    <p>Shot to Kill Ratio: {Ratio(stats.totalShots,stats.totalKillShots)}</p>
                    <p>Shot Kill to Bomb Kill Ratio: {Ratio(stats.totalKillShots,stats.totalBombKills)}</p>
                    <p>Bomb to Kill Ratio: {Ratio(stats.totalBombs,stats.totalBombKills)}</p>
                </div>
                <div className="col-5">
                    <h3 className="text-center">Opponent</h3>
                    <p>Wins: {stats.oppWins}</p>
                    <p>Average # of Bullets in Hand: {Ratio(stats.oppBulletCount,stats.totalTurns)}</p>
                    <p>Reload to Block Ratio: {Ratio(stats.totalOppReloads,stats.totalOppBlocks)}</p>
                    <p>Blocks to Lifesaving Blocks Ratio: {Ratio(stats.totalOppBlocks,stats.totalOppLifeSavingBlocks)}</p>
                    <p>Shot to Kill Ratio: {Ratio(stats.totalOppShots,stats.totalOppKillShots)}</p>
                    <p>Shot Kill to Bomb Kill Ratio: {Ratio(stats.totalOppKillShots,stats.totalOppBombKills)}</p>
                    <p>Bomb to Kill Ratio: {Ratio(stats.totalOppBombs,stats.totalOppBombKills)}</p>
                </div>
            </div>
        </div>
    )
}

export default Stats
