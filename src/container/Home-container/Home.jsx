import React, { useState, useRef, useEffect } from 'react';
//icons
import { HiMenu } from 'react-icons/hi';
import { AiFillCloseCircle } from 'react-icons/ai';
//routing
import { Link, Route, Routes } from 'react-router-dom';
//assets
import logo from '../../assets/logo.png';
//styling
import "./home.scss";
//components
import {SideBar, UserProfile} from "../../components";
//containers
import Pins from "../pins/Pins";
//sanity
import {client} from "../../client";
import {userQuery} from "../../utils/data";
import {fetchUser} from "../../utils/fetch-user";



const Home = () => {

    const [toggleSidebar, setToggleSidebar] = useState(false);
    const [user, setUser] = useState(null);
    const scrollRef = useRef(null);

    const userInfo = fetchUser();

    useEffect(() => {
    
        const query = userQuery(userInfo?.googleId);

        client.fetch(query)
        .then((data) => {
            setUser(data[0]);
        })
      
    }, [])
    
    useEffect(() => {
        scrollRef.current.scrollTo(0, 0);
      });

    return (

        <div className="home-container">

            <div className="sidebar">
                <SideBar user={user && user} />
            </div>

            <div className="sidebar-drop-container">

                <div className="nav-bar">

                    <HiMenu fontSize={40}  onClick={() => setToggleSidebar(true)} />

                    <Link to="/">
                      <img src={logo} alt="logo" className="logo" />
                    </Link>

                    <Link to={`user-profile/${user?._id}`}>
                     <img src={user?.image} alt="user-pic" className="userImg" />
                    </Link>
                </div>
                
                {toggleSidebar && (
                    <div className=" sidebar-box">
                        <div className="sidebar-icons">
                            <AiFillCloseCircle fontSize={30}  onClick={() => setToggleSidebar(false)} />
                        </div>
                        <SideBar closeToggle={setToggleSidebar} user={user && user} />
                    </div>
                )}

            </div>

            <div className="routesBox" ref={scrollRef}>
                <Routes>
                    <Route path="/user-profile/:userId" element={<UserProfile />} />
                    <Route path="/*" element={<Pins user={user && user} />} />
                </Routes>
            </div>
      </div>
    )
}

export default Home;




