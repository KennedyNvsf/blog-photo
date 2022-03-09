

import React from 'react';
import {Circles} from "react-loader-spinner"
import "./spinner.styles.scss";


const Spinner = ({message}) => {

    return (

        <div className="spinner-container">
            <Circles
               type="Circles"
                color= "#00BFFF"
                height={50}
                width={200}
                className="spinner"
            />

            <p className="spinner-message">{message}</p>
        </div>
    )
}

export default Spinner;