import React from "react";
import axios from "./axios";

export class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bio: "",
            bioModalVisible: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.saveBio = this.saveBio.bind(this);
        this.showBioModal = this.showBioModal.bind(this);
        this.hideBioModal = this.hideBioModal.bind(this);
    }
    handleChange(e) {
        // console.log("e.target", e.target.value);
        this.setState({
            bio: e.target.value
        });
    }

    showBioModal() {
        this.setState({
            bioModalVisible: true
        });
    }

    hideBioModal() {
        this.setState({
            bioModalVisible: false
        });
    }

    saveBio() {
        return axios
            .post("/bio", { bio: this.state.bio })
            .then(response => {
                this.props.setBio(response.data.rows[0].bio);
                this.hideBioModal();
            })
            .catch(error => {
                console.log("error in axios.post /upload: ", error);
            });
    }

    render() {
        if (this.state.bioModalVisible === false) {
            return (
                <div>
                    <div>{this.props.bio}</div>
                    <button onClick={this.showBioModal} id="edit-save">
                        Edit Bio
                    </button>
                </div>
            );
        } else {
            return (
                <div>
                    <textarea
                        name="bio"
                        className="text"
                        rows="10"
                        cols="40"
                        defaultValue={this.props.bio}
                        onChange={this.handleChange}
                    />
                    <br />
                    {this.props.bio}
                    <br />
                    <button onClick={this.saveBio} id="edit-save">
                        Save
                    </button>
                </div>
            );
        }
    }
}
