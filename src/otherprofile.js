import React from "react";
import axios from "./axios";
import { FriendButton } from "./friendbutton";

export class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        // console.log("Other profile mounted");
        axios
            .get("/api/user/" + this.props.match.params.id)
            .then(response => {
                // console.log("axios.get /api/user/response", response);
                if (response.data == "" || response.data.rows[0] == undefined) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        imageurl: response.data.rows[0].imageurl,
                        first: response.data.rows[0].first,
                        last: response.data.rows[0].last,
                        bio: response.data.rows[0].bio
                    });
                }
            })
            .catch(function(error) {
                console.log("error in axios.get /users: ", error);
                this.props.history.push("/");
            });
    }

    render() {
        return (
            <div>
                <div id="profile-container">
                    <h1>
                        {this.state.first} {this.state.last}
                    </h1>
                    <div id="profile-img">
                        <img src={this.state.imageurl} />
                    </div>
                    <p>{this.state.bio}</p>
                </div>
                <div id="friend-button">
                    <FriendButton match={this.props.match.params.id} />
                </div>
            </div>
        );
    }
}
