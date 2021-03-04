import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios.js";

export function SearchUsers() {
    // passing "" as argument is NOT REQUIRED
    const [user, setUser] = useState("");
    const [users, setUsers] = useState([]);
    //const [error, setError] = useState([]);

    // example #1: without async/await
    // useEffect(() => {
    //     axios
    //         .get(`https://spicedworld.herokuapp.com/?q=${country}`)
    //         .then(({ data }) => {
    //             console.log("data: ", data);
    //         });
    // });

    useEffect(() => {
        let abort = false;

        axios
            .get(`/api/find/${user}`)
            .then(({ data }) => {
                console.log("find users axios data: ", data);
                if (!abort) {
                    console.log(data.rows);
                    setUsers(data.rows);
                } else {
                    abort = true;
                }
            })
            .catch((err) => {
                console.log("this err in axios useEffect: ", err);
            });
    }, [user]);

    return (
        <div>
            <h1 className="searchTitle">FIND CREATORS...</h1>
            <input
                className="inputSearch"
                name="findPeople"
                type="text"
                placeholder="Search..."
                onChange={(e) => setUser(e.target.value)}
                autoComplete="off"
            />

            {users.map((user, index) => {
                return (
                    <div id="people" key={index}>
                        <Link to={`/user/${user.id}`} key={user.id}>
                            <div className="list">
                                <img
                                    className="profileSearch"
                                    src={user.profile_pic_url || "/default.png"}
                                ></img>
                                <h3>{`${user.first} ${user.last}`}</h3>
                            </div>
                        </Link>
                    </div>
                );
            })}
        </div>
    );
}
