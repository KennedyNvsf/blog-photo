import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import {client, urlFor } from "../../client";
import { pinDetailQuery, pinDetailMorePinQuery  } from '../../utils/data';
import MasonryLayout from "../masonry-layout/MasonryLayout";
import Spinner from "../spinner/Spinner.component";
import "./pinDetail.styles.scss";





const PinDetail = ({ user }) => {

    const { pinId } = useParams();
    const [pins, setPins] = useState();
    const [pinDetail, setPinDetail] = useState();
    const [comment, setComment] = useState('');
    const [addingComment, setAddingComment] = useState(false);
  
    const fetchPinDetails = () => {
      const query = pinDetailQuery(pinId);
  
      if (query) {
        client.fetch(`${query}`).then((data) => {
          setPinDetail(data[0]);
          console.log(data);
          if (data[0]) {
            const query1 = pinDetailMorePinQuery(data[0]);
            client.fetch(query1).then((res) => {
              setPins(res);
            });
          }
        });
      }
    };
  
    useEffect(() => {
      fetchPinDetails();
    }, [pinId]);
  
    const addComment = () => {
      if (comment) {
        setAddingComment(true);
  
        client
          .patch(pinId)
          .setIfMissing({ comments: [] })
          .insert('after', 'comments[-1]', [{ comment, _key: uuidv4(), postedBy: { _type: 'postedBy', _ref: user._id } }])
          .commit()
          .then(() => {
            fetchPinDetails();
            setComment('');
            setAddingComment(false);
          });
      }
    };
  
    if (!pinDetail) {
      return (
        <Spinner message="Showing pin" />
      );
    }
  

    return (

        <>
        {pinDetail && (
          <div className="user-page-container">

                <div className="user-post-img-container">
                    <img
                        
                        src={(pinDetail?.image && urlFor(pinDetail?.image).url())}
                        alt="user-post"
                    />
                </div>

                <div className="post-detail-container">

                    <div className="post-detail-header">

                        <div className="post-header-dl">
                            <a
                                href={`${pinDetail.image.asset.url}?dl=`}
                                download
                               
                            >
                                <MdDownloadForOffline />
                            </a>
                        </div>

                        <a href={pinDetail.destination} target="_blank" rel="noreferrer">
                        {pinDetail.destination?.slice(8)}
                        </a>

                    </div>

                    <div>
                        <h1 className="post-title">
                        {pinDetail.title}
                        </h1>
                        <p className="post-about">{pinDetail.about}</p>
                    </div>

                    <Link to={`/user-profile/${pinDetail?.postedBy._id}`} className="post-user">
                        <img src={pinDetail?.postedBy.image}  alt="user-profile" />
                        <p>{pinDetail?.postedBy.userName}</p>
                    </Link>

                    <h2 className="comments-title">Comments</h2>

                    <div className="comment-container">
                        {pinDetail?.comments?.map((item) => (
                        <div className="comment-box" key={item.comment}>
                            <img
                            src={item.postedBy?.image}
                            className="comment-img"
                            alt="user-profile"
                            />
                            <div className="comment-element">
                                <p className="comment-user">{item.postedBy?.userName}</p>
                                <p>{item.comment}</p>
                            </div>
                        </div>
                        ))}
                    </div>

                    <div className="add-comment-container">

                        <Link to={`/user-profile/${user._id}`}>
                            <img src={user.image} className="add-user-name" alt="user-profile" />
                        </Link>

                        <input
                            className="add-comment-input"
                            type="text"
                            placeholder="Add a comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />

                        <button
                            type="button"
                            className=" comment-btn "
                            onClick={addComment}
                        >
                          {addingComment ? 'Doing...' : 'Done'}
                        </button>
                    </div>

                </div>
          </div>
        )}

        {pins?.length > 0 && (
          <h2 className="more">
            More like this
          </h2>
        )}

        {pins ? (
          <MasonryLayout pins={pins} />
        ) : (
          <Spinner message="Loading more pins" />
        )}

      </>
    )
}

export default PinDetail;