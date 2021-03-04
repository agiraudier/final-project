import axios from "./axios.js";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

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

    const loadMore = () => {
        const lowestId = images[images.length - 1].id;
        console.log("lowestId: ", lowestId);

        axios.get(`/moreImages/${lowestId}`).then(({ data }) => {
            const newData = images.concat(data.rows);
            //console.log("this is newData: ", newData);
            setImages(newData);
        });
    };

    const uploadImg = () => {
        let formData = new FormData();
        formData.append("file", images.file);
        formData.append("title", images.title);

        axios
            .post("/upload", formData)
            .then((resp) => {
                images.unshift(resp.data.rows);
            })
            .catch((err) => {
                console.log("err in uploadImg: ", err);
            });
    };

    return (
        <div>
            <div className="barUploader">
                <p className="add">You can add your content here...</p>
                <input
                    className="regloginput"
                    type="text"
                    name="title"
                    placeholder="Title..."
                ></input>
                <input type="file" name="file" accept="image/*"></input>
                <button className="submit" onClick={(e) => uploadImg(e)}>
                    Submit
                </button>
            </div>
            <div>
                <h3 className="latest">- Latest creations -</h3>
            </div>
            <div id="cards">
                {images &&
                    images.map((image, index) => {
                        return (
                            <div className="container" key={index}>
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
                                <Link
                                    to={`/user/${image.user_id}`}
                                    key={image.user_id}
                                >
                                    <p className="userFeed">{`${image.first} ${image.last}`}</p>
                                </Link>
                            </div>
                        );
                    })}
            </div>
            <button className="more" onClick={() => loadMore()}>
                More
            </button>
        </div>
    );
}
