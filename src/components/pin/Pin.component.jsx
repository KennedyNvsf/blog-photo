
import React, { useState } from 'react';
import { urlFor, client } from '../../client';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { BsFillArrowUpRightCircleFill } from 'react-icons/bs';
import {fetchUser} from "../../utils/fetch-user";
import "./pin.styles.scss";




const Pin = ({pin}) => {

    const [postHovered, setPostHovered] = useState(false);
    const [savingPost, setSavingPost] = useState(false);

    const navigate = useNavigate();

    const { postedBy, image, _id, destination, save } = pin;

    const user = fetchUser();

    const deletePin = (id) => {
        client
        .delete(id)
        .then(() => {
            window.location.reload();
        });
    };

    let alreadySaved = save?.filter((item) => item?.postedBy?._id === user?.googleId);

    alreadySaved = alreadySaved?.length > 0 ? alreadySaved : [];

    const savePin = (id) => {

        if (alreadySaved?.length === 0) {
        setSavingPost(true);

        client
            .patch(id)
            .setIfMissing({ save: [] })
            .insert('after', 'save[-1]', [{
            _key: uuidv4(),
            userId: user?.googleId,
            postedBy: {
                _type: 'postedBy',
                _ref: user?.googleId,
            },
            }])
            .commit()
            .then(() => {
            window.location.reload();
            setSavingPost(false);
            });
        }
    };

    return (

        <div className="pin-card-container">

            <div onMouseEnter={() => setPostHovered(true)} onMouseLeave={() => setPostHovered(false)} onClick={() => navigate(`/pin-detail/${_id}`)}   className="pin-card" >

             <img src={urlFor(image).width(250).url()} alt="user-post" className="pin-img" />

             {postHovered && (

                 <div className="pin-hovered" style={{ height: '100%' }}>

                    <div className="pin-header">

                        <div className="pin-dl">

                            <a
                                className="pin-dl-icon"
                                href={`${image?.asset?.url}?dl=`}
                                download
                                onClick={(e) => {
                                    e.stopPropagation();
                                }}
                                
                            >
                                <MdDownloadForOffline />
                            </a>

                        </div>

                        {alreadySaved?.length !== 0 ? (

                            <button type="button" className="save-btn">
                                {save?.length}  Saved
                            </button>

                            ) : (

                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    savePin(_id);
                                }}
                                type="button"
                                className="save-btn"
                            >
                                {save?.length}   {savingPost ? 'Saving' : 'Save'}
                            </button>
                        )}

                    </div>

                    <div className="pin-bottom">

                        {destination?.slice(8).length > 0 ? (

                                <a
                                    href={destination}
                                    target="_blank"
                                    className="destinationIcon"
                                    rel="noreferrer"
                                >
                                {' '}
                                    <BsFillArrowUpRightCircleFill />
                                    {destination.length > 20 ? destination?.slice(8, 20): destination.slice(8)}...
                                </a>
                            ) : undefined
                        
                        }

                        {postedBy?._id === user?.googleId && (

                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deletePin(_id);
                                    }}
                                    className="deleteIcon"
                                >
                                    <AiTwotoneDelete />
                                </button>
                            )
                        }
                    
                    </div>

                 </div>
             )}

            </div>


            <Link to={`/user-profile/${postedBy?._id}`} className="user-link">

                <img
                src={postedBy?.image}
                alt="user-profile"
                />
                <p >{postedBy?.userName}</p>
            </Link>


            
        </div>
    )
}

export default Pin;