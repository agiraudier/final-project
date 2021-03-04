import axios from "./axios.js";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export function Feed() {
    const [images, setImages] = useState();
    const [showMore, setShowMore] = useState(true);

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

    const loadMore = () => {
        const lowestId = images[images.length - 1].id;
        console.log("lowestId: ", lowestId);

        axios.get(`/moreImages/${lowestId}`).then(({ data }) => {
            const newData = images.concat(data.rows);
            //console.log("this is newData: ", newData);
            setImages(newData);

            if (!lowestId) {
                setShowMore(false);
            }
        });
    };

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
                                    </div>{" "}
                                    <Link
                                        to={`/user/${image.user_id}`}
                                        key={image.user_id}
                                    >
                                        <p className="titleFeed">{`${image.first} ${image.last}`}</p>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}

                <button onClick={() => loadMore()}>More</button>
            </div>
        </div>
    );
}
