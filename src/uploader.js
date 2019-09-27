import React from "react";
import axios from "./axios";

export class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageurl: ""
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }
    handleChange(e) {
        console.log("handleChange is running");
        console.log("file: ", e.target.files[0]);
        console.log("e.target", e.target.files);
        this.setState({
            file: e.target.files[0]
        });
    }
    handleClick(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        console.log("formData uploader.js:", formData);
        console.log("this.state.file", this.state.file);
        axios
            .post("/upload", formData)
            .then(response => {
                // console.log("response.data.imageurl: ", response.data.imageurl);
                this.props.getImageUrl(response.data.imageurl);
                this.props.hideModal();
            })
            .catch(function(error) {
                console.log("error in axios.post /upload: ", error);
            });
    }
    render() {
        return (
            <div>
                <div id="overlay">
                    <div id="overlay-border">
                        <div onClick={this.props.hideModal}>
                            <div className="x">X</div>
                        </div>
                        <img src={this.props.imageurl || "/img/default.png"} />
                        <h3>
                            <input
                                type="file"
                                name="file"
                                autoComplete="off"
                                accept="image/*"
                                id="img-upload"
                                onChange={this.handleChange}
                            />
                        </h3>
                        <button onClick={this.handleClick} id="edit-save">
                            UPLOAD
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}
