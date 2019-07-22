import React from 'react';
import {firebaseApp} from '../utils/firebase';
import history from '../history';
import Loading from './Loading';

import Button from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import styled from "styled-components";
import {Col, Container, Row} from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";


const keyTypes = ['title', 'imgSrc', 'pollType', 'loginToAnswer', 'expire', 'categoryList', 'username', 'createAt'];

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
    }
    
    .ghost-input {
      display: block;
      border:0px;
      outline: none;
      width: 90%;
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

class Update extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            options: [],
            imgSrc: null,
            pollType: null,
            originalCount: 0,
            loading: true,
            loginToAnswer: false,
            expire: null,
            status: '',
            categories: [],
            disabled: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddOption = this.handleAddOption.bind(this);
        this.formIsInvalid = this.formIsInvalid.bind(this);
    }

    componentWillMount() {

        this.pollRef = firebaseApp.database().ref(`polls/${this.props.match.params.pollId}`);
        this.pollRef.on('value', ((snapshot) => {
            const dbPoll = snapshot.val();

            if (dbPoll.expire && dbPoll.expire.check) {
                if (new Date().getTime() > new Date(dbPoll.expire.expireDate).getTime()) {
                    this.setState({voted: true, status: 'expired', disabled: true})
                }
            }

            const options = Object.keys(dbPoll).reduce((a, key) => {
                if (!keyTypes.includes(key)) {
                    a.push({ option: [key][0], optionError: '' });
                }
                return a;
            }, []);

            if (dbPoll.hasOwnProperty('imgSrc')) {
                this.setState({imgSrc: dbPoll.imgSrc});
            }

            if (dbPoll.categoryList && dbPoll.categoryList.length > 0) {
                this.setState({categories: dbPoll.categoryList});
            }

            options.push({option: '', optionError: ''});

            this.setState({
                title: dbPoll.title,
                options: options, pollType: dbPoll.pollType,
                loginToAnswer: dbPoll.loginToAnswer,
                expire: dbPoll.expire,
                originalCount: options.length - 1,
                loading: false
            });

        })).bind(this);
    };

    componentWillUnmount() {
        this.pollRef.off();
    };

    handleOptionChange(i, e) {
        let options = this.state.options;
        options[i].option = e.target.value;
        this.setState({options: options});
    };

    handleSubmit(e) {
        e.preventDefault();

        if (this.formIsInvalid()) {
            return;
        }

        const newOptionsArray = this.state.options.reduce((a, op, i) => {
            if (i >= this.state.originalCount) {
                const key = op.option.trim();
                a.push(key);
            }
            return a;
        }, []);

        const updates = {};

        newOptionsArray.forEach(option => {
            updates[`polls/${this.props.match.params.pollId}/${option}`] = 0;
        });

        firebaseApp.database().ref().update(updates);

        history.push(`/polls/poll/${this.props.match.params.pollId}`);
    };

    handleAddOption() {
        let options = this.state.options;
        options.push({option: '', optionError: ''});

        this.setState({options: options});
    };

    handleCancel = () => {
        history.push(`/polls/poll/${this.props.match.params.pollId}`)
    };

    handleOptionDelete = (index) => {
        if (this.state.options.length > 2) {
            const options = this.state.options;
            options.splice(index, 1);
            this.setState({options: options});
        } else {
            alert('A minimum of 2 options are required!')
        }
    };

    render() {
        let options = this.state.options.map((option, i) => {
            return (
                <Row key={i} className='d-flex align-items-center'>
                    <div className='option-input'>
                        <input className='ghost-input'
                               placeholder={`Option ${i + 1}`}
                               value={this.state.options[i].option}
                               disabled={i < this.state.originalCount}
                               autoFocus={i === this.state.originalCount}
                               onChange={this.handleOptionChange.bind(this, i)}/>
                        {Boolean(this.state.options[i].optionError) ?
                            <span className='error-text'><i>{this.state.options[i].optionError}</i></span> : ''}
                    </div>
                    {i < this.state.originalCount ? '' :
                        <div>
                            <IconButton onClick={this.handleAddOption} size="small" className='option-icons'>
                                <AddIcon fontSize="inherit"/>
                            </IconButton>
                            <IconButton onClick={(e) => {
                                this.handleOptionDelete(i)
                            }} size="small" className='option-icons'>
                                <CloseIcon fontSize="inherit"/>
                            </IconButton>
                        </div>
                    }
                </Row>
            );
        });

        return (
            <Styles>
                <Container fluid style={{minHeight: "80vh"}}
                           className='d-flex justify-content-center align-items-center'>

                    <Col xs={{span: 10}}>

                        <Row className='d-flex justify-content-center align-items-center'>
                            <div>
                                <h3 className='type-title font'>{`Update "${this.state.title}"`}</h3>
                                <hr className='line'/>
                            </div>
                        </Row>
                        <Row>
                            {this.state.imgSrc !== null ?
                                <Col
                                    className='d-flex flex-column align-items-center'>
                                    {this.state.imgSrc !== null ?
                                        <div>
                                            <img src={this.state.imgSrc} alt='User Uploaded'/>
                                        </div> : ''}
                                </Col> : ''}
                            <Col className={this.state.imgSrc !== null ? '': 'd-flex justify-content-center align-items-center flex-column'}>
                                <fieldset>
                                    <Row className='title-section'>
                                        <input className='ghost-input title-input'
                                               placeholder='Please ask a question!'
                                               value={this.state.title}
                                               onChange={this.handleTitleChange} required disabled={true}/>
                                        {Boolean(this.state.titleError) ?
                                            <span
                                                className='error-text'> {this.state.titleError}</span> : ''}
                                    </Row>
                                    {options}
                                </fieldset>
                            </Col>
                        </Row>
                        <Row style={{margin: "20px 0px"}}>
                            <div className='d-flex align-items-center justify-content-center w-100'>
                                <Button
                                    size="medium"
                                    variant="outlined"
                                    className='poll-group-button'
                                    onClick={this.handleCancel}
                                    >
                                    <span><CloseIcon/> Cancel</span>
                                </Button>
                                <Button
                                    size="medium"
                                    variant="outlined"
                                    className='poll-group-button'
                                    onClick={this.handleSubmit}
                                    style={{marginLeft: '15px'}}>
                                    <span><DoneIcon/> Finished</span>
                                </Button>
                            </div>
                        </Row>
                        <Row className='d-flex align-items-center'>
                            <IconButton onClick={this.handleCancel}>
                                <ArrowBackIcon/>
                            </IconButton>
                            <span className='back-text'><i>Back to Previous Page</i></span>
                        </Row>
                    </Col>
                </Container>
            </Styles>
        );
    }

    formIsInvalid() {

        let isInvalid = false;
        const regex = /[\.#\$\/\[\]]/;

        this.state.options.forEach((o, i) => {

            if (i >= this.state.originalCount) {
                let options = this.state.options;
                let thisOption = o.option.trim();

                if (thisOption.length === 0) {
                    options[i] = {option: thisOption, optionError: 'This option must not be empty.'}
                    this.setState({options: options});
                    isInvalid = true;
                } else if (thisOption.match(regex)) {
                    options[i] = {
                        option: thisOption,
                        optionError: `Options can't contain ".", "#", "$", "/", "[", or "]"`
                    }
                    this.setState({options: options});
                    isInvalid = true;
                } else {

                    if (thisOption === 'title') { //can't have option with key "title"
                        thisOption = 'Title';
                    }

                    options[i] = {option: thisOption, optionError: ''}
                    this.setState({options: options});
                }
            }

        });

        return isInvalid;
    }
}

export default Update;

