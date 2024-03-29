import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            error: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleValidation = this.handleValidation.bind(this);
    }
    handleChange(e) {
        this.setState(
            {
                [e.target.name]: e.target.value
            }
            // ,() => console.log("this.state: ", this.state)
        );
    }
    handleValidation() {
        this.setState({
            error: true
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(response => {
                if (response.data.success === false) {
                    this.handleValidation();
                } else {
                    location.replace("/");
                }
            })
            .catch(function(error) {
                console.log("error in axios.post /login: ", error);
            });
    }
    render() {
        return (
            <div>
                {this.state.error && (
                    <div className="error">
                        Oops, something went terribly wrong.
                    </div>
                )}
                <form>
                    <div id="login-input">
                        <input
                            type="text"
                            name="email"
                            autoComplete="off"
                            placeholder="Email Address"
                            onChange={this.handleChange}
                        />
                        <input
                            type="password"
                            name="password"
                            autoComplete="off"
                            placeholder="Password"
                            onChange={this.handleChange}
                        />
                        <br />
                        <button onClick={this.handleSubmit} id="login-button">
                            LOGIN
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}
