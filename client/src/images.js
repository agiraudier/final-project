import axios from "./axios.js";
import { useState, useEffect } from "react";

export function Images() {
    const [images, setImages] = useState();

    useEffect(() => {
        axios
            .get("/images")
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
            {images &&
                images.map((image, index) => {
                    return (
                        <div key={index}>
                            <img
                                src={image.canvas_url || image.media_url}
                            ></img>

                            <p>{`${image.title}`}</p>
                        </div>
                    );
                })}
        </div>
    );
}
