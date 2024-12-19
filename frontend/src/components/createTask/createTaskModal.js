import React from 'react';
import './createtaskmodal.css'; // Ensure you have some basic CSS for the modal

const Modal = ({ show, onClose, children }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="modal-backdrop ">
            <div className="modal-content bg-white">
                <button className="modal-close" onClick={onClose}>X</button>
                {children}
            </div>
        </div>
    );
};

export default Modal;
