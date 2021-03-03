import axios from "./axios.js";
import { useState, useEffect } from "react";

export function ImagesOthers(props) {
    const [images, setImages] = useState();

    useEffect(() => {
        axios
            .get(`/imagesOthers/${props.id}`)
            .then(({ data }) => {
                console.log("here");
                //data.rows.forEach((row) => console.log(row.title));
                console.log("axios get images others: ", data);
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
