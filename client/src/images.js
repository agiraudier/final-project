import axios from "./axios.js";
import { useState, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export function Images() {
    const [images, setImages] = useState();
    //const [more, setMore] = useState(true);

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
            <div id="cards">
                {images &&
                    images.map((image, index) => {
                        return (
                            <div key={index}>
                                <div className="container">
                                    <div className="imageBox">
                                        <Zoom>
                                            <img
                                                className="pic"
                                                src={
                                                    image.canvas_url ||
                                                    image.media_url
                                                }
                                            ></img>
                                        </Zoom>

                                        <p className="titleFeed">{`${image.title}`}</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
