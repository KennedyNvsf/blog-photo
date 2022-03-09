
import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { MdDelete } from 'react-icons/md';
import Spinner from "../spinner/Spinner.component";
import {client} from "../../client";
import {categories} from "../../utils/data";
import "./createPin.styles.scss";



const CreatePin = ({user}) => {


    const [title, setTitle] = useState('');
    const [about, setAbout] = useState('');
    const [loading, setLoading] = useState(false);
    const [destination, setDestination] = useState();
    const [fields, setFields] = useState(false);
    const [category, setCategory] = useState();
    const [imageAsset, setImageAsset] = useState();
    const [wrongImageType, setWrongImageType] = useState(false);
  
    const navigate = useNavigate();

    const uploadImage = (e) => {
        const selectedFile = e.target.files[0];
        // uploading asset to sanity
        if (selectedFile.type === 'image/png' || selectedFile.type === 'image/svg' || selectedFile.type === 'image/jpeg' || selectedFile.type === 'image/gif' || selectedFile.type === 'image/tiff') {
          setWrongImageType(false);
          setLoading(true);
          client.assets
            .upload('image', selectedFile, { contentType: selectedFile.type, filename: selectedFile.name })
            .then((document) => {
              setImageAsset(document);
              setLoading(false);
            })
            .catch((error) => {
              console.log('Upload failed:', error.message);
            });
        } else {
          setLoading(false);
          setWrongImageType(true);
        }
      };

      const savePin = () => {
        if (title && about && destination && imageAsset?._id && category) {

          const doc = {
            _type: 'pin',
            title,
            about,
            destination,
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imageAsset?._id,
              },
            },
            userId: user._id,
            postedBy: {
              _type: 'postedBy',
              _ref: user._id,
            },
            category,
          };
          client.create(doc).then(() => {
            navigate('/');
          });
        } else {
          setFields(true);
    
          setTimeout(() => {
              setFields(false);
            },
            2000,
          );
        }
      };

    return (

        <div className="create-pin-container">

            {fields && (

                <p className="fields-error">Please add all fields.</p>
            )}

            <div className="create-upload ">

                <div className="left-side-upload">

                  <div className="upload-box">

                        {loading && (
                         <Spinner />
                        )}

                        {wrongImageType && (
                            <p>It&apos;s wrong file type.</p>
                        )}

                        {!imageAsset ? (
                            <label>
                                
                                <div className="upload-box-content">

                                    <div className="click-upload">

                                        <p className="upload-icon">
                                            <AiOutlineCloudUpload />
                                        </p>

                                        <p className="upload-text">Click to upload</p>

                                    </div>

                                    <p className="upload-recommendation ">
                                        Recommendation: Use high-quality JPG, JPEG, SVG, PNG, GIF or TIFF less than 20MB
                                    </p>
                                </div>

                                <input
                                type="file"
                                name="upload-image"
                                onChange={uploadImage}
                                className="upload-input"
                                />

                            </label>

                          ) : (

                            <div className="uploaded-picture">

                                <img
                                    src={imageAsset?.url}
                                    alt="uploaded-pic"
                                    
                                />

                                <button
                                    type="button"
                                    className="upload-btn"
                                    onClick={() => setImageAsset(null)}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        )}
                    </div>

                </div>

                <div className="right-side-upload">

                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Add your title"
                        className="title-input"
                    />

                    {user && (

                        <div className="upload-profile ">
                           <img
                              src={user.image}
                               alt="user-profile"
                            />
                            <p>{user.userName}</p>
                        </div>
                    )}

                    <input
                        type="text"
                        value={about}
                        onChange={(e) => setAbout(e.target.value)}
                        placeholder="Tell everyone what your Pin is about"
                        className="field-input "
                    />
                    
                    <input
                        type="url"
                        vlaue={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        placeholder="Add a destination link"
                        className="field-input"
                    />

                    <div className="categories-container">

                        <div>
                            <p className="cat-select-title">Choose Pin Category</p>

                            <select
                                onChange={(e) => {
                                setCategory(e.target.value);
                                }}
                                className="cat-select"
                            >
                                <option value="others" className="cat-select-box">Select Category</option>

                                {categories.map((item) => (

                                    <option className="cat-opts" value={item.name}>
                                        {item.name}
                                    </option>

                                ))}
                            </select>
                        </div>

                        <div className="save-post-container">

                        <button
                            type="button"
                            onClick={savePin}
                            
                        >
                            Save Pin
                        </button>

                        </div>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default CreatePin;