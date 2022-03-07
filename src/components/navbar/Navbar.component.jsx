import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMdAdd, IoMdSearch } from 'react-icons/io';
import "./navbar.styles.scss";



const Navbar = ({searchTerm, setSearchTerm, user}) => {

    const navigate = useNavigate();

    if (user) {

        return (

            <div className="navigation-bar-container">

                <div className="navigation-search">

                    <IoMdSearch fontSize={21} className="searchIcon" />
                    <input
                        type="text"
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search"
                        value={searchTerm}
                        onFocus={() => navigate('/search')}
                        className="searchInput"
                    />

                </div>

                <div className="navigation-right">

                    <Link to={`user-profile/${user?._id}`} className="user-img-container">
                        <img src={user.image} alt="user-pic" className="user-img"/>
                    </Link>
                    <Link to="/create-pin" className="addIcon">
                        <IoMdAdd />
                    </Link>

                </div>
            </div>
        );
    }

  return null;
}

export default Navbar;