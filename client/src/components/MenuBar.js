import React from 'react'

function MenuBar(props) {
    return (
        <div id="Bottom-Choices">
            <div className="container">
                <div className="row">
                    <div className="col-3"><button className={"btn btn-info float-left"} onClick={props.openRulesModal}>Rules</button></div>
                    <div className="col-6 text-center">{props.children}</div>
                    <div className="col-3"><button className={"btn btn-info float-right"} onClick={props.openStatsModal}>Stats</button></div>
                </div>
            </div>
        </div>
    )
}

export default MenuBar
