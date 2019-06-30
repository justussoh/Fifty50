import React from 'react';
import { firebaseApp } from '../utils/firebase';
import history from '../history';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

import Dropzone from 'react-dropzone';

const acceptFileType = 'image/x-png, image/png, image,jpg, image/jpeg, image/gif'
const acceptFileTypeArray = acceptFileType.split(",").map((item) => {
    return item.trim()
})

class NewOpenEnded extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            title: '',
            titleError: '',
            imgSrc: null,
            pollType: 'open',
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.formIsInvalid = this.formIsInvalid.bind(this);
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                let currentuser = firebaseApp.auth().currentUser;
                this.setState({
                    uid: currentuser.uid,
                    username: currentuser.displayName,
                    loggedIn: true
                });
            } else {
                this.setState({ loggedIn: false })
            }
        });
    }

    handleTitleChange(e) {
        this.setState({ title: e.target.value });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.formIsInvalid()) {
            return;
        }

        const pollData = { title: this.state.title.trim(), imgSrc: this.state.imgSrc, pollType:this.state.pollType }

        const newPollKey = firebaseApp.database().ref().child('polls').push().key;
        firebaseApp.database().ref(`/polls/${newPollKey}`).update(pollData)

        if (this.state.loggedIn) {
            const uid = firebaseApp.auth().currentUser.uid;
            var updates = {};
            updates[`/user-polls/${uid}/${newPollKey}`] = true;
            firebaseApp.database().ref().update(updates);
        }

        console.log(200);

        history.push(`/polls/poll/${newPollKey}`);

    }


    verifyFile = (files) => {
        if (files && files.length > 0) {
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if (currentFileSize > 10000000) {
                alert("This File is too Large")
                return false;
            }
            if (!acceptFileTypeArray.includes(currentFileType)) {
                alert("This File Type is not allowed. Only images are allowed")
                return false
            }
            return true
        }
    }

    handleOnDrop = (files, rejectedFiles) => {
        if (rejectedFiles && rejectedFiles.length > 0) {
            this.verifyFile(rejectedFiles)
        }

        if (files && files.length > 0) {
            const isVerified = this.verifyFile(files)
            if (isVerified) {
                const currentFile = files[0]
                const reader = new FileReader()
                reader.addEventListener("load", () => {
                    this.setState({ imgSrc: reader.result })
                }, false)

                reader.readAsDataURL(currentFile)

            }
        }
    }

    render() {

        const { imgSrc } = this.state

        return (
            <div className="row">
                <div className="col-sm-12 text-xs-center">

                    <h1>New Poll</h1>

                    <Paper>
                        <br /><br />
                        <h2>New Poll</h2>

                        <form onSubmit={this.handleSubmit}>

                            {imgSrc !== null ?
                                <div>
                                    <img src={imgSrc} alt='User Uploaded' />
                                </div> :

                                <Dropzone onDrop={this.handleOnDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <p>Drop Your image files Here</p>
                                            </div>
                                        </section>
                                    )}
                                </Dropzone>}

                            <TextField
                                label="Title"
                                value={this.state.title}
                                onChange={this.handleTitleChange}
                                error={this.state.titleError}
                                helperText={this.state.titleError}
                            />

                            <br /><br />
                            <Button
                                variant="outlined"
                                label="Create"
                                type="submit"
                            />
                        </form>

                        <br /><br />
                    </Paper>
                </div>
            </div>
        );
    }

    formIsInvalid() {

        let isInvalid = false;
        const regex = /[\.#\$\/\[\]]/;
        const title = this.state.title.trim();

        if (title.length === 0) {
            this.setState({ titleError: 'Title must no be empty.' })
            isInvalid = true;
        } else if (title.match(regex)) {
            this.setState({ titleError: `Title can't contain ".", "#", "$", "/", "[", or "]"` })
            isInvalid = true;
        } else {
            this.setState({ title: title, titleError: '' })
        }

        return isInvalid;
    }

}

export default NewOpenEnded;