import React from 'react'

function Modal(props) {
    const showHideClassName = props.show ? "modal display-block" : "modal display-none";

    return (
        <div className={showHideClassName}>
            <section className="modal-main">
                {props.children}
                <button className="btn btn-secondary float-right modal-close-button" onClick={props.handleClose}>close</button>
            </section>
        </div>
    )
}

export default Modal
