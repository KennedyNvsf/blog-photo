import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import GoogleLogin from "react-google-login" ;
import {client} from "../../client";
import "./login.styles.scss";
//assets
import shareVideo from "../../assets/share.mp4";
import logo from "../../assets/logowhite.png";




const Login = () => {

    const navigate = useNavigate();

    const responseGoogle = (response) => {

        localStorage.setItem("user", JSON.stringify(response.profileObj));
        
        const {name, googleId, imageUrl} = response.profileObj;

        //storing the user  in sanity
        const doc = {

            _id: googleId,
            _type: "user",
            userName: name,
            image: imageUrl,

        }

        client.createIfNotExists(doc)
        .then(() => {
             navigate('/', {replace: true})
        })

    }

    return (

        <div className="login-container">

            <div className="login-section">
                <video
                src={shareVideo}
                type="video/mp4"
                loop
                controls={false}
                muted
                autoPlay
                className="background-video"
                />

                <div className="login-box">

                    <div className="login-logo">
                        <img src={logo}  />
                    </div>

                    <div className="loginBtn-container">

                        <GoogleLogin

                            clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                            render={(renderProps) => (
                                <button
                                    type="button"
                                    className="login-btn"
                                    onClick={renderProps.onClick}
                                    disabled={renderProps.disabled}
                                >
                                <FcGoogle className="login-btnIcon" /> Sign in with google
                                </button>
                            )}
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy="single_host_origin"

                        />

                    </div>
                </div>
            </div>
    </div>
    )
}

export default Login;