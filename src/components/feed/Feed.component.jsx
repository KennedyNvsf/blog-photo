import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {client} from "../../client";
import {searchQuery, feedQuery} from "../../utils/data";
import "./feed.styles.scss";
import {Spinner, MasonryLayout} from "../";



const Feed = () => {

    const [pins, setPins] = useState();
    const [loading, setLoading] = useState(false);
    const { categoryId } = useParams();


    useEffect(() => {

        setLoading(true);

        if(categoryId) {

            const query = searchQuery(categoryId);

            client.fetch(query)
            .then((data) => {

                setPins(data);
                setLoading(false);
            })

        } else {

            client.fetch(feedQuery).then((data) => {

                setPins(data);
                setLoading(false);
            })
        }


    }, [categoryId])



    if (loading) return <Spinner message="Loading the best content for your Feed!" />
    return (

        <div>
            {pins && <MasonryLayout pins={pins} />}
        </div>
    )
}

export default Feed;

//stopped at 2-14min