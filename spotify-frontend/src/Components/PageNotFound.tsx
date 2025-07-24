import { TriangleAlert } from "lucide-react";
import "../Styles/PageNotFound.css"
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";

export const PageNotFound = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const message = location.state?.message || "Sorry, try typing a different address";
    const goto = location.state?.goto || "";

    useEffect(() => {
        if (!location.state) {
            navigate("/login", { replace: true });
        }
    }, [location.state, navigate]);

    const handleButton = () => {
        if (goto) {
            navigate(`/${goto}`);
        } else {
            navigate("/");
        }
    };

    if (!location.state) return null; 

    return (
        <div className="pnf">
            <div className="pnf-icon-container">
                <TriangleAlert className="pnf-icon" />
            </div>

            <h1>Oops, page not found</h1>
            <p>{message}</p>
            <div>
                <button className="pnf-button" onClick={handleButton}>
                    Go to {goto || "home"}
                </button>
            </div>
        </div>
    );
};
