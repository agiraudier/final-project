import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

export function Feed() {
    const [images, setImages] = useState();

    useEffect(() => {
        axios
            .get("/feed")
            .then(({ data }) => {
                console.log("here");
                //data.rows.forEach((row) => console.log(row.title));
                console.log("axios get feed: ", data.rows);
                setImages(data.rows);
            })
            .catch((err) => {
                console.log("this err in axios useEffect feed: ", err);
            });
    }, []);

    return (
        <div>
            <div>
                <input type="text" name="title" placeholder="Title..."></input>
                <input type="file" name="file"></input>
                <button>Submit</button>
            </div>
            <div>
                <h3>Latest...</h3>
            </div>
            {images &&
                images.map((image, index) => {
                    return (
                        <div key={index}>
                            <img
                                src={image.canvas_url || image.media_url}
                            ></img>
                            <Link
                                to={`/user/${image.user_id}`}
                                key={image.user_id}
                            >
                                <p>{`${image.title}`}</p>
                            </Link>
                        </div>
                    );
                })}
        </div>
    );
}
