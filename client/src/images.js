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

    /*const loadMore = () => {
        const lowestId = images[images - 1].id;

        axios.get(`/moreImages/${lowestId}`).then(function (resp) {
            for (let i = 0; i < resp.data.length; i++) {
                images.push(resp.data[i]);
                console.log("this is the lowest id: ", resp.data[i].lowestId);
                /*if (resp.data[i].id == resp.data[i].lowestId) {
                    setMore(false);
                }
            }
        });
    };*/

    return (
        <div>
            {images &&
                images.map((image, index) => {
                    return (
                        <div key={index}>
                            <Zoom>
                                <img
                                    src={image.canvas_url || image.media_url}
                                ></img>
                            </Zoom>

                            <p>{`${image.title}`}</p>
                        </div>
                    );
                })}
        </div>
    );
}
