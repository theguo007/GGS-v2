import React from 'react'

function Stats({stats}) {
    function Ratio(x, y){
        if(y === 0){
            return "NA"
        }
        return (x/y).toFixed(3)
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-5 col-md-3 offset-md-2"><h3>Player</h3></div>
                <div className="col-3"><h3 className="text-center">You</h3></div>
                <div className="col-3"><h3 className="text-center">Them</h3></div>
            </div>
            <div className="row">
                <div className="col-5 col-md-3 offset-md-2"><p>Wins</p></div>
                <div className="col-3"><p className="text-center">{stats.wins}</p></div>
                <div className="col-3"><p className="text-center">{stats.oppWins}</p></div>
            </div>
            <div className="row">
                <div className="col-5 col-md-3 offset-md-2"><p>Average # of Bullets in Hand</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.bulletCount, stats.totalTurns)}</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.oppBulletCount,stats.totalTurns)}</p></div>
            </div>
            <div className="row">
                <div className="col-5 col-md-3 offset-md-2"><p>Reload to Block</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.totalReloads,stats.totalBlocks)}</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.totalOppReloads,stats.totalOppBlocks)}</p></div>
            </div>
            <div className="row">
                <div className="col-5 col-md-3 offset-md-2"><p>Blocks to Lifesaving Blocks</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.totalBlocks,stats.totalLifeSavingBlocks)}</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.totalOppBlocks,stats.totalOppLifeSavingBlocks)}</p></div>
            </div>
            <div className="row">
                <div className="col-5 col-md-3 offset-md-2"><p>Shot to Kill</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.totalShots,stats.totalKillShots)}</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.totalOppShots,stats.totalOppKillShots)}</p></div>
            </div>
            <div className="row">
                <div className="col-5 col-md-3 offset-md-2"><p>Bomb to Kill Ratio</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.totalBombs,stats.totalBombKills)}</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.totalOppBombs,stats.totalOppBombKills)}</p></div>
            </div>
            <div className="row">
                <div className="col-5 col-md-3 offset-md-2"><p>Shot Kill to Bomb Kill</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.totalKillShots,stats.totalBombKills)}</p></div>
                <div className="col-3"><p className="text-center">{Ratio(stats.totalOppKillShots,stats.totalOppBombKills)}</p></div>
            </div>
            <div className="row">
                <div className="offset-md-2 col-md-8">
                    <p className="text-center">
                        *Reload vs block ratio tells you how aggressive you are. 
                        The next three tell you how good your prediction skills are (or how lucky). 
                        Final ratio tells you which one you prefer killing with compared with your opponent.
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Stats
