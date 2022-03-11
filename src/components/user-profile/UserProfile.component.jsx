import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate } from 'react-router-dom';
import { GoogleLogout } from 'react-google-login';
import { userCreatedPinsQuery, userQuery, userSavedPinsQuery } from '../../utils/data';
import { client } from '../../client';
import MasonryLayout from '../masonry-layout/MasonryLayout';
import Spinner from '../spinner/Spinner.component';
import "./user-profile.styles.scss";


const activeBtnStyles = 'active-btn';
const notActiveBtnStyles = 'not-active-btn';

const UserProfile = () => {

    const [user, setUser] = useState();
    const [pins, setPins] = useState();
    const [text, setText] = useState('Created');
    const [activeBtn, setActiveBtn] = useState('created');
    const navigate = useNavigate();
    const { userId } = useParams();
  
    const User = localStorage.getItem('user') !== 'undefined' ? JSON.parse(localStorage.getItem('user')) : localStorage.clear();

    const randomImg = 'https://source.unsplash.com/1600x900/?nature,photography,technology'

    useEffect(() => {
        const query = userQuery(userId);
        client.fetch(query).then((data) => {
          setUser(data[0]);
        });
    }, [userId]);
    
    useEffect(() => {

        if (text === 'Created') {
          const createdPinsQuery = userCreatedPinsQuery(userId);
    
          client.fetch(createdPinsQuery).then((data) => {
            setPins(data);
          });
        } else {
          const savedPinsQuery = userSavedPinsQuery(userId);
    
          client.fetch(savedPinsQuery).then((data) => {
            setPins(data);
          });
        }
    }, [text, userId]);
    
    const logout = () => {

        localStorage.clear();
    
        navigate('/login');
    };
    
    if (!user) return <Spinner message="Loading profile" />;

    return (


            <div className="user-profile-wrapper">

                <div className="user-profile-container">

                        <div className="user-feed">

                            <div className="user-feed-pics">

                                <img
                                className="user-cover-photo"
                                src={randomImg}
                                alt="user-pic"
                                />

                                <img
                                className="user-profile-photo"
                                src={user.image}
                                alt="user-pic"
                                />
                            </div>

                            <h1 className="username-header">
                                {user.userName}
                            </h1>

                            <div className="logout-container">

                                {userId === User.googleId && (
                                    <GoogleLogout
                                        clientId={`${process.env.REACT_APP_GOOGLE_API_TOKEN}`}
                                        render={(renderProps) => (
                                        <button
                                            type="button"
                                            className="logout-btn"
                                            onClick={renderProps.onClick}
                                            disabled={renderProps.disabled}
                                        >
                                            <AiOutlineLogout color="red" fontSize={21} />
                                        </button>
                                        )}
                                        onLogoutSuccess={logout}
                                        cookiePolicy="single_host_origin"
                                    />
                                )}

                            </div>

                        </div>

                        <div className="created-and-saved">

                            <button
                                type="button"
                                onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn('created');
                                }}
                                className={`${activeBtn === 'created' ? activeBtnStyles : notActiveBtnStyles}`}
                            >
                                Created
                            </button>

                            <button
                                type="button"
                                onClick={(e) => {
                                setText(e.target.textContent);
                                setActiveBtn('saved');
                                }}
                                className={`${activeBtn === 'saved' ? activeBtnStyles : notActiveBtnStyles}`}
                            >
                                Saved
                            </button>

                        </div>

                        <div className="image-grid">
                         <MasonryLayout pins={pins} />
                        </div>

                        {pins?.length === 0 && (
                            <div className="no-pins">
                            No Pins Found!
                            </div>
                        )}
                </div>

            </div>
        
    )
}

export default UserProfile;