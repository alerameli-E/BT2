import React, { type Dispatch, type SetStateAction } from "react";
import "../Styles/Modal.css"
import { useNavigate } from "react-router-dom";
import { deleteSession } from "../Services/spotifyService";

interface ModalInterface {
    context: "logout" | "search"
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const Modal: React.FC<ModalInterface> = ({ setIsModalOpen, context }) => {


    const navigate = useNavigate()

    const handleLogOut = async () => {
        const sessionId = localStorage.getItem("sessionId");

        if (!sessionId) {
            navigate("/login");
            return;
        }

        try {
            await deleteSession(sessionId)
            console.log("Sesión eliminada exitosamente del backend.");
        } catch (error: any) {
            console.warn("Your session was not eliminated: ", error.message);
        } finally {
            localStorage.removeItem("sessionId");
            navigate("/login");
        }
    };


    return (
        <div className="modal-overlay">
            <div className="modal">
                {context === "search" ?
                    <div>
                        <h1>Please, introduce a valid value to search</h1>
                        <button className="button-single" onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>

                    :
                    <div>
                        <h2>Are you sure you want to logout?</h2>
                        <div>
                            <button className="button-double" onClick={handleLogOut}>Logout</button>
                            <button className="button-double" onClick={() => setIsModalOpen(false)}>Cancel</button>
                        </div>

                    </div>
                }
            </div>
        </div>
    )
}

export default Modal