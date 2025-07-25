import React, { useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Callback: React.FC = () => {

    const navigate = useNavigate();
    const hasRun = useRef(false);

    const sessionId = localStorage.getItem("sessionId")

    useEffect(() => {

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get("code");

        if (hasRun.current) return;
        hasRun.current = true;

        // If there is already a session, redirect to dashboard
        if (sessionId) {
            navigate("/");
            return;
        }
        // If it does not has a code in the url, go to login
        if (!code) {
            navigate("/");
            return;
        }

        if (code) {
            const sessionId = crypto.randomUUID()
            axios.post('http://127.0.0.1:9090/auth/spotify', { code, sessionId })
                .then(() => {
                    localStorage.setItem("sessionId", sessionId)
                    navigate("/");
                })
                .catch((error) => {
                    console.error("Error on getting the token:", error);
                    navigate("/note-found", {
                        state: {
                            message: "An error has ocurred with the server. Try logging in later",
                            goto: "login"
                        }
                    })
                });
        }
    }, [navigate,]);

    return <h2>Authenticating with Spotify...</h2>;
};

export default Callback;
