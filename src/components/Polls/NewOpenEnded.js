import React from 'react';
import {firebaseApp} from '../../utils/firebase';
import history from '../../history';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {Typeahead} from 'react-bootstrap-typeahead'

import {InputGroup, FormControl, DropdownButton, Dropdown, Container, Row, Col} from 'react-bootstrap'
import Dropzone from 'react-dropzone';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import styled from "styled-components";
import IconButton from "@material-ui/core/IconButton";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import Paper from "@material-ui/core/Paper";

const acceptFileType = 'image/x-png, image/png, image,jpg, image/jpeg, image/gif'
const acceptFileTypeArray = acceptFileType.split(",").map((item) => {
    return item.trim()
});

const Styles = styled.div`
    .line{
        border: 0;
        clear:both;
        display:block;
        width: 100%;               
        background-color:#b1b1b1;
        height: 1px;
        margin-top:0px;
    }
    
    .type-title{
        color:#707070;
    }
    
    .font{
        font-family:Roboto;
    }
    
     fieldset {
      display: block;
      -webkit-margin-start: 0px;
      -webkit-margin-end: 0px;
      -webkit-padding-before: 0em;
      -webkit-padding-start: 0em;
      -webkit-padding-end: 0em;
      -webkit-padding-after: 0em;
      border: 0px;
      border-image-source: initial;
      border-image-slice: initial;
      border-image-width: initial;
      border-image-outset: initial;
      border-image-repeat: initial;
      min-width: -webkit-min-content;
      margin-top:20px;
      width:100%;
    }
    
    .ghost-input {
      display: block;
      border:0px;
      outline: none;
      width: 60%;
      -webkit-box-sizing: border-box;
      -moz-box-sizing: border-box;
      box-sizing: border-box;
      background: #fff;
      padding: 5px 8px;
      -webkit-transition: all 0.1s ease-in-out;
      -moz-transition: all 0.1s ease-in-out;
      -ms-transition: all 0.1s ease-in-out;
      -o-transition: all 0.1s ease-in-out;
      transition: all 0.1s ease-in-out;
    }
    .ghost-input:focus {
        border-bottom:1px solid #ddd;
    }
     .ghost-button {
        background-color: transparent;
        border:2px solid #ddd;
        padding:10px 30px; 
        width:100%;
      -webkit-transition: all 0.1s ease-in-out;
      -moz-transition: all 0.1s ease-in-out;
      -ms-transition: all 0.1s ease-in-out;
      -o-transition: all 0.1s ease-in-out;
       transition: all 0.1s ease-in-out;
       color: #fff;
       font-family: Montserrat;
    }
    .ghost-button:hover {
        border:2px solid #515151;
    }
    
    .option-icons{
        margin: 0 5px;
    }
    
    .cloud{
        width:30%;
        margin-bottom: 20px;
    }
    
    .dropzone{
        border-style: dashed;
        border-width: 2px;
        border-color: #2D2E83;
        min-height:40vh;
        border-radius: 10px;
        margin: 20px;
    }
    
    .dropzone-text{
        font-family:Roboto;
        font-size:14px;
        color: #707070;
    }
    
    .title-section{
        margin-bottom:20px;
    }
    
    .title-input{
        font-family:Roboto;
        font-size:24px;
        color: #B1B1B1;
        font-weight:300;
    }
    
    .option-input{
        font-family:Open Sans;
        font-size:14px;
        color: #707070;
        font-weight:300;
        margin-bottom: 10px;
    }
    
    .error-text{
        color:red;
        font-size:10px;
        font-family:Roboto;
    }
    
    .back-text{
        font-size:12px;
        font-family:Roboto;
        color: #707070;
    }
    
    .requirement-paper{
        background-color:#1a1a00;
        padding:30px;
        height:100%;
    }
    
    .requirement-text{
        color:white;
        font-size:14px;
        font-family:Montserrat;
    }
    
    .category-input{
        width:100%;
        margin-bottom:20px;
    }
    
    .duration-button{
        background-color:white;
    }
`;

class NewOpenEnded extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            title: '',
            titleError: '',
            imgSrc: null,
            pollType: 'open',
            loginToAnswer: false,
            expire: {check: false, createDate: null, expireDate: null, duration: 0},
            durationMeasure: 'minutes',
            duration: 5,
            category: '',
            categoryList: [],
            categories: [],
            username: '',
        };

        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.formIsInvalid = this.formIsInvalid.bind(this);
    }

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                let currentuser = firebaseApp.auth().currentUser;
                this.setState({
                    uid: currentuser.uid,
                    username: currentuser.displayName,
                    loggedIn: true,
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
    }

    handleTitleChange(e) {
        this.setState({title: e.target.value});
    }

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

        const pollData = {
            title: this.state.title.trim(),
            imgSrc: this.state.imgSrc,
            pollType: this.state.pollType,
            loginToAnswer: this.state.loginToAnswer,
            expire: this.state.expire,
            categoryList: this.state.categoryList,
            username: this.state.username,
            createAt: new Date().toISOString(),
        };

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

            if (type === 'pollGroup-next') {
                window.open(`/pollgroup/newpoll/${this.props.pollId}`, "_self");
            }
            if (type === 'pollGroup-submit') {
                history.push(`/pollgroup/view/${this.props.pollId}`);
            }
        }
    };


    verifyFile = (files) => {
        if (files && files.length > 0) {
            const currentFile = files[0]
            const currentFileType = currentFile.type
            const currentFileSize = currentFile.size
            if (currentFileSize > 10000000) {
                alert("This file is too large")
                return false;
            }
            if (!acceptFileTypeArray.includes(currentFileType)) {
                alert("This file type is not allowed. Only images are allowed")
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
            const isVerified = this.verifyFile(files);
            if (isVerified) {
                const currentFile = files[0]
                const reader = new FileReader()
                reader.addEventListener("load", () => {
                    this.setState({imgSrc: reader.result})
                }, false);

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
        let select = selected.reduce((a, sel) => {
            if (sel instanceof Object) {
                a.push(sel.label);
                return a
            } else {
                a.push(sel);
                return a
            }
        }, []);
        this.setState({
            categoryList: select,
        });
    };

    render() {

        const {imgSrc} = this.state;

        return (
            <Styles>
                <Container fluid>
                    <Row>
                        <Col xs={12}>
                            <Row>
                                <Col xs={8}>
                                    <Row className='d-flex justify-content-center align-items-center'>
                                        <div>
                                            <h3 className='type-title font'>CREATE A OPEN ENDED POLL</h3>
                                            <hr className='line'/>
                                        </div>
                                    </Row>
                                    <Col xs={{span: 10, offset: 1}}>
                                        <Row>
                                            {imgSrc !== null ?
                                                <div>
                                                    <img src={imgSrc} alt='User Uploaded'/>
                                                </div> :

                                                <Dropzone onDrop={this.handleOnDrop}>
                                                    {({getRootProps, getInputProps}) => (
                                                        <div {...getRootProps()}
                                                             className='dropzone d-flex align-items-center justify-content-center'>
                                                            <input {...getInputProps()} />
                                                            <div
                                                                className='d-flex align-items-center justify-content-center flex-column'>
                                                                <img src='/images/cloud.png' alt='upload'
                                                                     className='cloud'/>
                                                                <p className='dropzone-text text-center'>Drop your image
                                                                    files here (Optional)</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Dropzone>}
                                        </Row>
                                        <Row>
                                            <fieldset>
                                                <Row className='title-section d-flex justify-content-center'>
                                                    <input className='ghost-input title-input'
                                                           placeholder='Please ask a question!'
                                                           value={this.state.title}
                                                           onChange={this.handleTitleChange} required/>
                                                    {Boolean(this.state.titleError) ?
                                                        <span
                                                            className='error-text'> {this.state.titleError}</span> : ''}
                                                </Row>
                                            </fieldset>
                                        </Row>
                                    </Col>
                                    {this.props.pollGroup ?
                                        <Row>
                                            <div>
                                                <Button
                                                    variant="outlined"
                                                    label="Create"
                                                    type="submit"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleSubmit('pollGroup-submit')
                                                    }}>
                                                    Finished
                                                </Button>

                                                <Button
                                                    variant="outlined"
                                                    label="Create"
                                                    type="submit"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleSubmit('pollGroup-next')
                                                    }}>
                                                    Next
                                                </Button>
                                            </div>
                                        </Row> : ''
                                    }
                                    <Row className='d-flex align-items-center'>
                                        <IconButton onClick={this.props.handleBack}>
                                            <ArrowBackIcon/>
                                        </IconButton>
                                        <span className='back-text'><i>Back to Previous Page</i></span>
                                    </Row>
                                </Col>
                                {!this.props.pollGroup ?
                                    <Col xs={4}>
                                        <Paper className='requirement-paper'>
                                            <Container fluid style={{height: '100%'}} className='d-flex flex-column'>
                                                <Row>
                                                    {this.props.pollGroup ? '' :
                                                        <div>
                                                            {this.state.loggedIn ?
                                                                <FormControlLabel
                                                                    control={<Switch
                                                                        checked={this.state.loginToAnswer}
                                                                        onChange={this.handleLoginToAnswer}
                                                                        color="default"
                                                                    />}
                                                                    label={<span className='requirement-text'>Does User need to Login to Answer</span>}
                                                                /> : ''}
                                                        </div>}
                                                </Row>
                                                <Row>
                                                    <div>
                                                        <FormControlLabel
                                                            control={<Switch
                                                                checked={this.state.expire.check}
                                                                onChange={this.handleExpiryChange}
                                                                color="default"
                                                            />}
                                                            label={<span className='requirement-text'>Set a Duration for the poll</span>}
                                                        />

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
                                                                    className='duration-button'
                                                                    variant="outline-secondary"
                                                                    title={this.state.durationMeasure}>
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
                                                    </div>
                                                </Row>
                                                <Row className='mt-auto'>
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
                                                               className='category-input'
                                                    />

                                                </Row>
                                                <Row>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            this.handleSubmit('poll-submit')
                                                        }}
                                                        className='ghost-button '>
                                                        SUBMIT
                                                    </button>
                                                </Row>
                                            </Container>
                                        </Paper>
                                    </Col> : ''}
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Styles>
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

        return isInvalid;
    }

}

export default NewOpenEnded;