import "../Styles/Login.css"


const handleLogin = () => {
    const authUrl = `${SPOTIFY_AUTHORIZE_ENDPOINT}?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${REDIRECT_URL}&scope=${encodeURIComponent(SCOPE)}&show_dialog=true`;
    window.location.href = authUrl;
  };
  

const CLIENT_ID = "a78cb30e83dd44688d6853575eb7bcbd";
const SPOTIFY_AUTHORIZE_ENDPOINT = "https://accounts.spotify.com/authorize";
const REDIRECT_URL = "http://127.0.0.1:5173/callback";
const SCOPE = "user-top-read user-library-read";


const Login = () => {
    return (
        <div className="login-page">
            <div className="login-box">
                <img src="spotifyLogo.png" width="20%" />
                <h1 className="login-text">To continue, please login to spotify</h1>
                <button className="login-button" onClick={handleLogin}>Login</button>
            </div>
        </div>
    )
}

export default Login