import React from 'react';
import {firebaseApp} from '../utils/firebase';
import history from '../history';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {Typeahead} from 'react-bootstrap-typeahead'

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';

import {InputGroup, FormControl, DropdownButton, Dropdown} from 'react-bootstrap'

import Dropzone from 'react-dropzone';

const acceptFileType = 'image/x-png, image/png, image,jpg, image/jpeg, image/gif';
const acceptFileTypeArray = acceptFileType.split(",").map((item) => {
    return item.trim()
});

class NewSingleOption extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            title: '',
            titleError: '',
            options: [
                {option: '', optionError: ''},
                {option: '', optionError: ''}
            ],
            imgSrc: null,
            pollType: 'mcq',
            loginToAnswer: false,
            expire: {check: false, createDate: null, expireDate: null, duration: 0},
            durationMeasure: 'minutes',
            duration: 5,
            category: '',
            categoryList: [],
            categories: [],
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleAddOption = this.handleAddOption.bind(this);
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
                this.setState({loggedIn: false})
            }
        });
        this.pollRef = firebaseApp.database().ref();
        this.pollRef.on('value', ((snapshot) => {
            const db = snapshot.val();
            this.setState({categories: db.categoryList});
        })).bind(this);
    }

    componentWillUnmount() {
        this.pollRef.off();
    };

    handleTitleChange(e) {
        this.setState({title: e.target.value});
    }

    handleOptionChange(i, e) {
        let options = this.state.options;
        options[i].option = e.target.value;
        this.setState({options: options});
    };

    handleSubmit = (type) => {

        if (this.formIsInvalid()) {
            return;
        }

        if (this.state.expire.check) {
            let newExpiry = this.state.expire;
            let now = new Date();
            newExpiry.createDate = now;
            let duration;
            if (this.state.durationMeasure === 'minutes') {
                duration = this.state.duration * 60 * 1000
            }
            if (this.state.durationMeasure === 'hours') {
                duration = this.state.duration * 60 * 60 * 1000
            }
            if (this.state.durationMeasure === 'days') {
                duration = this.state.duration * 60 * 60 * 24 * 1000
            }
            newExpiry.duration = duration;
            let expiryTime = new Date(now.getTime() + duration);
            newExpiry.expireDate = expiryTime;
        }

        const pollData = this.state.options.reduce((a, op) => {
            const key = op.option.trim();
            a[key] = 0;
            return a;
        }, {
            title: this.state.title.trim(),
            imgSrc: this.state.imgSrc,
            pollType: this.state.pollType,
            loginToAnswer: this.state.loginToAnswer,
            expire: this.state.expire,
            categoryList: this.state.categoryList,
        });

        if (!this.props.pollGroup) {
            const newPollKey = firebaseApp.database().ref().child('polls').push().key;
            firebaseApp.database().ref(`/polls/${newPollKey}`).update(pollData)

            if (this.state.loggedIn) {
                const uid = firebaseApp.auth().currentUser.uid;
                var updates = {};
                updates[`/user-polls/${uid}/${newPollKey}`] = true;
                firebaseApp.database().ref().update(updates);
            }

            if (this.state.categoryList.length > 0) {
                for (let i = 0; i < this.state.categoryList.length; i++) {
                    var updates = {};
                    updates[`/category/${this.state.categoryList[i]}/${newPollKey}`] = true;
                    firebaseApp.database().ref().update(updates);
                    if (!this.state.categories.includes(this.state.categoryList[i])) {
                        var updates = {};
                        this.state.categories.push(this.state.categoryList[i]);
                        updates[`/categoryList`] = this.state.categories;
                        firebaseApp.database().ref().update(updates);
                    }
                }
            }

            console.log(200);
            history.push(`/polls/poll/${newPollKey}`);

        } else {
            const newPollKey = firebaseApp.database().ref().child('polls').push().key;
            firebaseApp.database().ref(`/polls/${newPollKey}`).update(pollData);

            var updates = {};
            updates[`/pollgroup/${this.props.pollId}/${newPollKey}`] = true;
            firebaseApp.database().ref().update(updates);

            if(type==='pollGroup-next'){
                history.push(`/pollgroup/newpoll/${this.props.pollId}`);
            }
            if(type==='pollGroup-submit'){
                history.push(`/pollgroup/view/${this.props.pollId}`);
            }

        }
    };

    handleAddOption() {
        let options = this.state.options;
        options.push({option: '', optionError: ''});

        this.setState({options});
    };

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
    };

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
                    this.setState({imgSrc: reader.result})
                }, false)

                reader.readAsDataURL(currentFile)

            }
        }
    };

    handleLoginToAnswer = (e) => {
        this.setState({loginToAnswer: e.target.checked});
    };

    handleExpiryChange = (e) => {
        let newExpiry = this.state.expire;
        newExpiry.check = e.target.checked;
        this.setState({expire: newExpiry});
    };

    handleDurationChange(measure) {
        this.setState({durationMeasure: measure});
    };

    handleDurationPeriodChange = (e) => {
        this.setState({duration: e.target.value});
    };

    handleCategoryInputChange = (value) => {
        this.setState({
            category: value
        });
    };

    handleSearchSelect = (selected) => {
        let select = selected.reduce((a, sel)=>{
            a.push(sel.label)
            return a
        },[])
        this.setState({
            categoryList: select,
        });
    };

    render() {

        const {imgSrc} = this.state;

        let options = this.state.options.map((option, i) => {
            return (
                <div key={i}>
                    <br/>
                    <TextField
                        label={`Option ${i + 1}`}
                        value={this.state.options[i].option}
                        onChange={this.handleOptionChange.bind(this, i)}
                        error={this.state.options[i].optionError}
                        helperText={this.state.options[i].optionError}
                    />
                </div>
            );
        });

        return (
            <div className="row">
                <div className="col-sm-12 text-xs-center">

                    <h1>New Fixed Answer Poll</h1>

                    <Grid>
                        <br/><br/>
                        <h2>New Poll</h2>

                        <form>

                            {imgSrc !== null ?
                                <div>
                                    <img src={imgSrc} alt='User Uploaded'/>
                                </div> :

                                <Dropzone onDrop={this.handleOnDrop}>
                                    {({getRootProps, getInputProps}) => (
                                        <section>
                                            <div {...getRootProps()}>
                                                <input {...getInputProps()} />
                                                <p>Drop your image files here</p>
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

                            {options}

                            <br/>
                            <Fab color="primary" aria-label="Add" onClick={this.handleAddOption}>
                                <AddIcon/>
                            </Fab>

                            <br/>
                            {this.props.pollGroup ? '' :
                                <div>
                                    {this.state.loggedIn ?
                                        <FormControlLabel
                                            control={<Switch
                                                checked={this.state.loginToAnswer}
                                                onChange={this.handleLoginToAnswer}
                                            />}
                                            label="Does User need to Login to Answer"
                                            labelPlacement="top"
                                        /> : ''}
                                </div>}
                            {this.props.pollGroup ? '' :
                                <div>
                                    <FormControlLabel
                                        control={<Switch
                                            checked={this.state.expire.check}
                                            onChange={this.handleExpiryChange}
                                        />}
                                        label="Set a Duration for the poll"
                                        labelPlacement="top"/>

                                    {this.state.expire.check ?
                                        <InputGroup>
                                            <FormControl
                                                placeholder="Enter Duration"
                                                value={this.state.duration}
                                                type='number'
                                                onChange={this.handleDurationPeriodChange}
                                            />

                                            <DropdownButton
                                                as={InputGroup.Append}
                                                variant="outline-secondary"
                                                title={this.state.durationMeasure}

                                            >
                                                <Dropdown.Item onClick={() => {
                                                    this.handleDurationChange('minutes')
                                                }}>Minutes</Dropdown.Item>
                                                <Dropdown.Item onClick={() => {
                                                    this.handleDurationChange('hours')
                                                }}>Hours</Dropdown.Item>
                                                <Dropdown.Item onClick={() => {
                                                    this.handleDurationChange('days')
                                                }}>Days</Dropdown.Item>
                                            </DropdownButton>
                                        </InputGroup> : ''}
                                </div>}
                            <br/>
                            {this.props.pollGroup ? '' :
                                <Typeahead allowNew
                                           multiple
                                           selectHintOnEnter
                                           newSelectionPrefix="Add a Category: "
                                           options={this.state.categories}
                                           placeholder="Add Category"
                                           onInputChange={this.handleCategoryInputChange}
                                           onChange={this.handleSearchSelect}
                                           id='category'
                                           maxResults={5}
                                           minLength={2}
                                />}
                            <br/>
                            {this.props.pollGroup ?
                                <div>
                                    <Button
                                        variant="outlined"
                                        label="Create"
                                        type="submit"
                                        onClick={(e)=>{
                                            e.preventDefault();
                                            this.handleSubmit('pollGroup-submit')}}>
                                        Finished
                                    </Button>

                                    <Button
                                        variant="outlined"
                                        label="Create"
                                        type="submit"
                                        onClick={(e)=>{
                                            e.preventDefault();
                                            this.handleSubmit('pollGroup-next')}}>
                                        Next
                                    </Button>
                                </div>

                                : <Button
                                    variant="outlined"
                                    label="Create"
                                    type="submit"
                                    onClick={(e)=>{
                                        e.preventDefault();
                                        this.handleSubmit('poll-submit')}}>
                                    Submit
                                </Button>}
                        </form>

                        <br/><br/>
                    </Grid>
                </div>
            </div>
        );
    }

    formIsInvalid() {

        let isInvalid = false;
        const regex = /[\.#\$\/\[\]]/;
        const title = this.state.title.trim();

        if (title.length === 0) {
            this.setState({titleError: 'Title must no be empty.'})
            isInvalid = true;
        } else if (title.match(regex)) {
            this.setState({titleError: `Title can't contain ".", "#", "$", "/", "[", or "]"`})
            isInvalid = true;
        } else {
            this.setState({title: title, titleError: ''})
        }

        this.state.options.forEach((o, i) => {

            let options = this.state.options;
            let thisOption = o.option.trim();

            if (thisOption.length === 0) {
                options[i] = {option: thisOption, optionError: 'This option must not be empty.'}
                this.setState({options: options});
                isInvalid = true;
            } else if (thisOption.match(regex)) {
                options[i] = {option: thisOption, optionError: `Options can't contain ".", "#", "$", "/", "[", or "]"`}
                this.setState({options: options});
                isInvalid = true;
            } else {

                if (thisOption === 'title') { //can't have option with key "title"
                    thisOption = 'Title';
                }

                options[i] = {option: thisOption, optionError: ''}
                this.setState({options: options});
            }
        });

        return isInvalid;
    }

}

export default NewSingleOption;