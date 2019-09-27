import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "./axios";

export function FindPeople() {
    const [users, setUsers] = useState([]);
    const [matchingUsers, setMatchingUsers] = useState();

    useEffect(() => {
        axios
            .get("/findpeople")
            .then(response => {
                setUsers(response.data.rows);
                // console.log("/findpeople response.data.rows", response.data.rows);
            })
            .catch(function(error) {
                console.log("error in axios.get /findpeople: ", error);
            });
    }, []);

    useEffect(() => {
        if (matchingUsers == undefined || matchingUsers == "") {
            return;
        }
        axios
            .get("/matchingusers/?q=" + matchingUsers)
            .then(response => {
                console.log(
                    "/matchingusers/ response.data.rows",
                    response.data.rows
                );
                setUsers(response.data.rows);
            })
            .catch(function(error) {
                console.log("error in axios.get /findpeople: ", error);
            });
    }, [matchingUsers]);

    return (
        <div>
            <div id="findpeople">
                <h1>Find People</h1>
                <h3>Looking for someone in particular?</h3>
                <input
                    type="search"
                    name="search"
                    autoComplete="off"
                    placeholder="Search..."
                    onChange={e => setMatchingUsers(e.target.value)}
                />
                {matchingUsers === undefined && (
                    <h3>Checkout who just joined:</h3>
                )}
                <div id="search-results">
                    {users.map(user => (
                        <div key={user.id} id="findpeople-img">
                            <Link to={"/user/" + user.id}>
                                <img
                                    src={user.imageurl || "/img/default.png"}
                                />
                                <p>
                                    {user.first} {user.last}
                                </p>
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
