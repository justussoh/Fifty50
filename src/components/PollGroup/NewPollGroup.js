import React from 'react';
import {firebaseApp} from '../../utils/firebase';
import history from '../../history';
import Button from '@material-ui/core/Button';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel'
import {Typeahead} from 'react-bootstrap-typeahead'

import {InputGroup, FormControl, DropdownButton, Dropdown, Container, Row, Col} from 'react-bootstrap'

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import styled from "styled-components";
import DoneIcon from "@material-ui/core/SvgIcon/SvgIcon";
import IconButton from "@material-ui/core/IconButton";
import Paper from "@material-ui/core/Paper";
import RightIcon from '@material-ui/icons/ArrowRight';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';


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


class NewPollGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loggedIn: false,
            title: '',
            titleError: '',
            loginToAnswer: false,
            expire: {check: false, createDate: null, expireDate: null, duration: 0},
            durationMeasure: 'minutes',
            duration: 5,
            category: '',
            categoryList: [],
            categories: [],
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
                this.setState({loggedIn: false})
            }
        });
        this.pollRef = firebaseApp.database().ref();
        this.pollRef.on('value', ((snapshot) => {
            const db = snapshot.val();
            this.setState({categories: db.categoryList});
        })).bind(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.state)
    }

    componentWillUnmount() {
        this.pollRef.off();
    }

    handleTitleChange(e) {
        this.setState({title: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();

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
            loginToAnswer: this.state.loginToAnswer,
            expire: this.state.expire,
            categoryList: this.state.categoryList,
            username: this.state.username,
            createAt: new Date().toISOString(),
        };

        const newPollKey = firebaseApp.database().ref().child('pollgroup').push().key;
        firebaseApp.database().ref(`/pollgroup/${newPollKey}`).update(pollData)

        if (this.state.loggedIn) {
            const uid = firebaseApp.auth().currentUser.uid;
            var updates = {};
            updates[`/user-pollgroup/${uid}/${newPollKey}`] = true;
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

        history.push(`/pollgroup/newpoll/${newPollKey}`);
    }

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

        return (
            <Styles>
                <Container fluid>
                    <Row style={{padding: "40px"}}>
                        <Col xs={{span: 10, offset: 1}}>
                            <Row style={{minHeight: "80vh"}}>
                                <Col xs={8}>
                                    <Row className='d-flex justify-content-center align-items-center'>
                                        <div>
                                            <h3 className='type-title font'>CREATE A NEW GROUPED POLL</h3>
                                            <hr className='line'/>
                                        </div>
                                    </Row>
                                    <Col xs={{span: 10, offset: 1}}
                                         className={this.props.pollGroup ? 'd-flex flex-column align-items-center' : ''}>
                                        <Row className={this.props.pollGroup ? 'w-100' : ''}>
                                            <fieldset>
                                                <Row className='title-section d-flex justify-content-center'>
                                                    <input className='ghost-input title-input'
                                                           placeholder='Title'
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
                                        <Row style={{margin: "20px 0px"}}>
                                            <div className='d-flex align-items-center justify-content-center w-100'>
                                                <Button
                                                    size="medium"
                                                    variant="outlined"
                                                    className='poll-group-button'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleSubmit('pollGroup-submit')
                                                    }}>
                                                    <span><DoneIcon/> Finished</span>
                                                </Button>

                                                <Button
                                                    size="medium"
                                                    variant="outlined"
                                                    className='poll-group-button'
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        this.handleSubmit('pollGroup-next')
                                                    }}
                                                    style={{marginLeft: '15px'}}>
                                                    Next
                                                    <RightIcon/>
                                                </Button>
                                            </div>
                                        </Row> : ''
                                    }
                                    <Row className='d-flex align-items-center'>
                                        <IconButton onClick={this.props.handleBack}>
                                            <ArrowBackIcon/>
                                        </IconButton>
                                        <span className='back-text'><i>Back to previous page</i></span>
                                    </Row>
                                </Col>

                                <Col xs={4}>
                                    <Paper className='requirement-paper'>
                                        <Container fluid style={{height: '100%'}} className='d-flex flex-column'>
                                            <Row>
                                                <div>
                                                    {this.state.loggedIn ?
                                                        <FormControlLabel
                                                            control={<Switch
                                                                checked={this.state.loginToAnswer}
                                                                onChange={this.handleLoginToAnswer}
                                                                color="default"
                                                            />}
                                                            label={<span className='requirement-text'>Does user need to login to answer?</span>}
                                                        /> : ''}
                                                </div>
                                            </Row>
                                            <Row>
                                                <div>
                                                    <FormControlLabel
                                                        control={<Switch
                                                            checked={this.state.expire.check}
                                                            onChange={this.handleExpiryChange}
                                                            color="default"
                                                        />}
                                                        label={<span className='requirement-text'>Set a duration for the poll</span>}
                                                    />

                                                    {this.state.expire.check ?
                                                        <InputGroup>
                                                            <FormControl
                                                                placeholder="Enter duration"
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
                                                           newSelectionPrefix="Add a category: "
                                                           options={this.state.categories}
                                                           placeholder="Add category"
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
                                                    onClick={this.handleSubmit}
                                                    className='ghost-button '>
                                                    SUBMIT
                                                </button>
                                            </Row>
                                        </Container>
                                    </Paper>
                                </Col>
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

export default NewPollGroup;