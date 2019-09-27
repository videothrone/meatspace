import React from "react";
import { ProfilePic } from "./profilepic";
import { Uploader } from "./uploader";
import Logo from "./logo";
import Profile from "./profile";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import { OtherProfile } from "./otherprofile";
import { FindPeople } from "./findpeople";
import FriendsWannabes from "./friends";
import { Chat } from "./chat";
import { UsersOnline } from "./online-users";

export class App extends React.Component {
    constructor() {
        super();
        this.state = {
            id: "",
            first: "",
            last: "",
            imageurl: "",
            bio: "",
            uploaderIsVisible: false,
            onlineUsersVisible: false
        };
        this.showModal = this.showModal.bind(this);
        this.getImageUrl = this.getImageUrl.bind(this);
        this.hideModal = this.hideModal.bind(this);
        this.setBio = this.setBio.bind(this);
        this.showOUModal = this.showOUModal.bind(this);
        this.hideOUModal = this.hideOUModal.bind(this);
    }

    componentDidMount() {
        axios
            .get("/users")
            .then(response => {
                // console.log("MOUNT response:", response);
                this.setState({
                    imageurl: response.data.rows[0].imageurl,
                    first: response.data.rows[0].first,
                    last: response.data.rows[0].last,
                    bio: response.data.rows[0].bio
                });
            })
            .catch(function(error) {
                console.log("error in axios.get /users: ", error);
            });
    }

    showModal() {
        this.setState({
            uploaderIsVisible: true
        });
    }

    hideModal() {
        this.setState({
            uploaderIsVisible: false
        });
    }

    showOUModal() {
        this.setState({
            onlineUsersVisible: true
        });
    }

    hideOUModal() {
        this.setState({
            onlineUsersVisible: false
        });
    }

    getImageUrl(image) {
        this.setState({
            imageurl: image
        });
    }

    setBio(text) {
        this.setState({
            bio: text
        });
    }

    render() {
        return (
            <BrowserRouter>
                <div>
                    <div id="app-container">
                        <div id="app-logo">
                            <Logo />
                        </div>
                        <div className="profile-menu">
                            <Link to="/">Profile</Link>
                        </div>
                        <div className="find-menu">
                            <Link to="/findusers">Find Users</Link>
                        </div>
                        <div
                            onClick={this.showOUModal}
                            id="online-users"
                            className="find-menu"
                        >
                            Online Users
                        </div>
                        {this.state.onlineUsersVisible && (
                            <UsersOnline hideOUModal={this.hideOUModal} />
                        )}
                        <div className="find-menu">
                            <Link to="/friends">Friends</Link>
                        </div>
                        <div className="find-menu">
                            <Link to="/chat">Chat</Link>
                        </div>
                        <div className="login-menu">
                            <a href="/logout">Logout</a>
                        </div>
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            imageurl={this.state.imageurl}
                            showModal={this.showModal}
                        />
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                getImageUrl={this.getImageUrl}
                                hideModal={this.hideModal}
                                imageurl={this.state.imageurl}
                            />
                        )}
                    </div>
                    <hr className="new2" />
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                id={this.state.id}
                                first={this.state.first}
                                last={this.state.last}
                                imageurl={this.state.imageurl}
                                showModal={this.showModal}
                                bio={this.state.bio}
                                setBio={this.setBio}
                            />
                        )}
                    />
                    <Route
                        path="/user/:id"
                        render={props => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route path="/findusers" render={() => <FindPeople />} />
                    <Route path="/friends" component={FriendsWannabes} />
                    <Route path="/chat" component={Chat} />
                </div>
            </BrowserRouter>
        );
    }
}
