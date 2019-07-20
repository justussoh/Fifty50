import React from 'react';
import {firebaseApp} from '../../utils/firebase';
import Loading from '../Loading';
import history from '../../history';

import Snackbar from '@material-ui/core/Snackbar';
import Button from 'react-bootstrap/Button';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

import PollShareDialog from '../Polls/PollShareDialog';
import LoginDialog from '../Polls/LoginDialog'
import ViewPoll from './ViewPoll'
import {Comment} from "../Polls/Comment";
import styled from "styled-components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Slide from "@material-ui/core/Slide";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import {CopyToClipboard} from "react-copy-to-clipboard";

const keyTypes = ['title', 'imgSrc', 'pollType', 'loginToAnswer', 'expire', 'categoryList', 'username', "createAt"];

const Styles = styled.div`

    .row-style{
        margin-top: 30px;
        margin-bottom: 30px;
        padding: 20px;
    }
    
    .row{
        margin-bottom:20px;
    }

    .results-circle{
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background-color:green;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: 'Roboto';
        font-weight: bold;
        font-size: 16px;
        margin-right: 20px;  
        margin-top: 20px;
    }
    
    .share-btn{
        margin-left: 20px;
    }
    
    .poll-title{
        font-weight:bold;
        font-family:'Roboto';
        font-size: 48px;
        margin-bottom:20px;
    }
    
    .background-color{
        background: linear-gradient(90deg, rgba(23,205,185,1) 44%, rgba(0,212,255,1) 100%);
    }
    
    img{
        width:100%;
    }
`;

class PollGroupView extends React.Component {
    constructor(props) {
        super(props);

        //console.log(this.props.match.params.pollId)
        this.state = {
            title: '',
            loading: true,
            showShareDialog: false,
            loginToAnswer: false,
            expire: null,
            status: '',
            categories: [],
            polls: [],
            index: null,
            copied: false,
        };

        this.formIsInvalid = this.formIsInvalid.bind(this);
    }

    componentWillMount() {
        this.pollRef = firebaseApp.database().ref(`pollgroup/${this.props.match.params.pollId}`);
        // console.log(this.pollRef)

        this.pollRef.on('value', ((snapshot) => {
                const dbPoll = snapshot.val();
                if (dbPoll.expire && dbPoll.expire.check) {
                    if (new Date().getTime() > new Date(dbPoll.expire.expireDate).getTime()) {
                        this.setState({voted: true, status: 'expired'})
                    }
                }

                const pollIdArray = Object.keys(dbPoll).reduce((a, key) => {
                    if (!keyTypes.includes(key)) {
                        a.push(key);
                    }
                    return a;
                }, []);

                if (dbPoll.categoryList && dbPoll.categoryList.length > 0) {
                    this.setState({categories: dbPoll.categoryList});
                }

                this.setState({
                    title: dbPoll.title,
                    loginToAnswer: dbPoll.loginToAnswer,
                    expire: dbPoll.expire,
                    polls: pollIdArray,
                    loading: false,
                })

            })
        ).bind(this);
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.state)
    }

    componentWillUnmount() {
        this.pollRef.off();
    };

    handleShareModelClose = () => {
        this.setState({showShareDialog: false});
    };

    handleShareModelOpen = () => {
        this.setState({showShareDialog: true});
    };

    handlePollGroupStart = () => {
        this.setState({index: 0})
    };

    handlePollGroupNext = () => {
        this.setState({index: this.state.index + 1})
    };

    handlePollGroupPrev = () => {
        if (this.state.index === 0) {
            this.setState({index: null})
        } else {
            this.setState({index: this.state.index -= 1})
        }
    };

    renderTimer = () => {
        if (this.state.expire && this.state.expire.check) {
            if (this.state.status === 'expired') {
                return (
                    <h2>Poll has expired</h2>
                );
            } else {
                return (
                    <h2>Time
                        Remaining: {(new Date(this.state.expire.expireDate).getTime() - new Date().getTime()) / 60 / 1000} Minutes</h2>
                );
            }
        }
        return ''
    };

    handleChipClick = (cat) => {
        const query = cat.split(' ').join('%20');
        history.push(`/category/${query}`);
    };

    handleCopy = () => {
        this.setState({copied: true});
        window.setTimeout(() => {
            this.setState({copied: false})
        }, 5000)
    };

    SlideTransition = (props) => {
        return <Slide {...props} direction="up"/>
    };

    handleCopySnackBarClose = () => {
        this.setState({copied: false})
    };

    handleUpdatePoll = () => {
        history.push(`/pollgroup/newpoll/${this.props.match.params.pollId}`)
    };


    render() {

        let isAuthUser = firebaseApp.auth().currentUser ? true : false;
        const maxCount = this.state.polls.length;

        let addNewPoll;
        if (isAuthUser) {
            addNewPoll = (
                <div>
                    <Button onClick={this.handleUpdatePoll} variant="outline-warning" style={{marginLeft: "10px"}}>
                        Add New Poll To Group
                    </ Button>
                </div>
            );
        }

        let renderPoll;
        if (this.state.index === null) {
            renderPoll =
                <div className='d-flex justify-content-center flex-column align-items-center' style={{margin:'40px 0'}}>
                    <h2 className='poll-title text-center'>{this.state.title}</h2>
                    <Button variant="primary" size="lg"  onClick={this.handlePollGroupStart} >Start</Button>
                </div>;
        } else if (this.state.index === maxCount) {
            renderPoll =
                <div className='d-flex justify-content-center flex-column align-items-center' style={{margin:'40px 0'}}>
                    <h3 className='poll-title text-center'>Thank You For Answering</h3>
                    <h4>Share the poll with your friends!</h4>
                    <InputGroup>
                        <FormControl
                            value={`localhost:3000/pollgroup/view/${this.props.match.params.pollId}`}
                            disabled={true}
                        />
                        <InputGroup.Append>
                            <CopyToClipboard text={`localhost:3000/pollgroup/view/${this.props.match.params.pollId}`}
                                             onCopy={this.handleCopy}>
                                <Button variant="outline-secondary">Copy</Button>
                            </CopyToClipboard>
                        </InputGroup.Append>
                    </InputGroup>
                </div>;
        } else {
            renderPoll = this.state.polls.map((pollId, index) => {
                    return (
                        <div key={pollId}>
                            {this.state.index === index ?
                                <ViewPoll polls={this.state.polls}
                                          index={this.state.index}
                                          pollId={pollId}
                                          handleNext={this.handlePollGroupNext}
                                          handlePrev={this.handlePollGroupPrev}
                                          key={pollId}/> : ''}
                        </div>);
                }
            )
        }


        let renderCategories = this.state.categories.map((cat, index) => {
            return (
                <Chip
                    key={index}
                    label={cat}
                    onClick={() => this.handleChipClick(cat)}
                    clickable
                />
            );
        });

        return (
            <Styles>
                <div className='background-color'>
                    <Container fluid>
                        <Row style={{marginBottom: '0px'}}>
                            <Col xs={{span: 10, offset: 1}}>
                                <Paper className='row-style' elevation={5}>
                                    <Container fluid>
                                        <Row className='d-flex align-items-center'>
                                            <div className='share-btn ml-auto'>
                                                <Button variant="outline-primary"
                                                        onClick={this.handleShareModelOpen}>Share</Button>
                                            </div>
                                            {addNewPoll}
                                        </Row>
                                        <Row>
                                            <Col xs={{span: 10, offset: 1}}>
                                                {this.state.loading ? <Loading loading={this.state.loading}/>
                                                    : <div>{renderPoll}</div>}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={{span: 10, offset: 1}}>
                                                {this.renderTimer()}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={{span: 10, offset: 1}}>
                                                {this.state.categories.length > 0 ? <div>
                                                    <h6>Categories:</h6>
                                                    {renderCategories}
                                                </div> : ''}
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col xs={{span: 10, offset: 1}}>
                                                <Comment pollId={this.props.match.params.pollId}
                                                         disable={!isAuthUser}/>
                                            </Col>
                                        </Row>
                                    </Container>
                                </Paper>
                            </Col>
                        </Row>
                    </Container>
                    <div>
                        <Snackbar
                            open={this.state.showSnackbar}
                            message="Thanks for your vote!"
                            autoHideDuration={4000}
                        />
                    </div>
                    <div>
                        <PollShareDialog
                            show={this.state.showShareDialog}
                            Close={this.handleShareModelClose}
                            url={`localhost:3000/pollgroup/view/${this.props.match.params.pollId}`}
                            copied={this.handleCopy}/>
                        <Snackbar anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                  open={this.state.copied}
                                  message={<span id="message-id">Link Has Been Copied</span>}
                                  action={
                                      <IconButton
                                          key="close"
                                          color="inherit"
                                          onClick={this.handleCopySnackBarClose}
                                      >
                                          <CloseIcon/>
                                      </IconButton>
                                  }
                                  TransitionComponent={this.SlideTransition}
                        />
                    </div>
                    <div>
                        <LoginDialog show={this.state.loginToAnswer && !isAuthUser}/>
                    </div>
                </div>
            </Styles>
        );
    }

    formIsInvalid() {

        let isInvalid = false;
        const regex = /[\.#\$\/\[\]]/;

        let newOption = this.state.newOption;
        let thisOption = newOption.option.trim();

        if (thisOption.length === 0) {
            this.setState({newOption: {option: thisOption, optionError: 'This option must not be empty.'}})
            isInvalid = true;
        } else if (thisOption.match(regex)) {
            this.setState({
                newOption: {
                    option: thisOption,
                    optionError: `Options can't contain ".", "#", "$", "/", "[", or "]"`
                }
            })
            isInvalid = true;
        } else {
            this.setState({newOption: {option: thisOption, optionError: ''}})
        }
        return isInvalid;
    }
}

export default PollGroupView;