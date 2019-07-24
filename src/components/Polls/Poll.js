import React from 'react';
import {firebaseApp} from '../../utils/firebase';
import Loading from '../Loading';
import history from '../../history';

import Snackbar from '@material-ui/core/Snackbar';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import {Chart} from 'react-google-charts';

import PollShareDialog from './PollShareDialog';
import {Comment} from './Comment';
import LoginDialog from './LoginDialog'
import ReactWordcloud from 'react-wordcloud'
import styled from "styled-components";
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import Slide from "@material-ui/core/Slide";

var randomColor = require('randomcolor');

const keyTypes = ['title', 'imgSrc', 'pollType', 'loginToAnswer', 'expire', 'categoryList', 'username', 'createAt'];

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
    
    .poll-question{
        font-weight:bold;
        font-family:'Roboto';
        font-size: 48px;
    }
    
    .background-color{
        background: linear-gradient(90deg, rgba(23,205,185,1) 44%, rgba(0,212,255,1) 100%);
    }
    
    img{
        width:100%;
    }
`;

class Poll extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            options: [],
            newOption: {option: '', optionError: ''},
            originalCount: 0,
            imgSrc: null,
            pollType: null,
            voted: localStorage.getItem(this.props.match.params.pollId) ? true : false,
            showSnackbar: false,
            loading: true,
            showShareDialog: false,
            loginToAnswer: false,
            expire: null,
            status: '',
            categories: [],
            showResults: false,
            copied:false,
        };

        this.formIsInvalid = this.formIsInvalid.bind(this);
        this.handleAnswerOpen = this.handleAnswerOpen.bind(this);
        this.handleAnswerChange = this.handleAnswerChange.bind(this);
    }

    componentWillMount() {
        this.pollRef = firebaseApp.database().ref(`polls/${this.props.match.params.pollId}`);
        //console.log(this.pollRef);
        this.pollRef.on('value', ((snapshot) => {
            const dbPoll = snapshot.val();
            if (this.state.voted) {
                this.setState({showResults: true})
            }
            if (dbPoll.expire && dbPoll.expire.check) {
                if (new Date().getTime() > new Date(dbPoll.expire.expireDate).getTime()) {
                    this.setState({voted: true, status: 'expired', showResults: true})
                }
            }
            if (dbPoll.pollType === 'mcq') {
                const options = Object.keys(dbPoll).reduce((a, key) => {
                    if (!keyTypes.includes(key)) {
                        a.push({[key]: dbPoll[key]});
                    }
                    return a;
                }, []);

                if (dbPoll.hasOwnProperty('imgSrc')) {
                    this.setState({imgSrc: dbPoll.imgSrc});
                }

                if (dbPoll.categoryList && dbPoll.categoryList.length > 0) {
                    this.setState({categories: dbPoll.categoryList});
                }

                this.setState({
                    title: dbPoll.title,
                    options: options, pollType: dbPoll.pollType,
                    loginToAnswer: dbPoll.loginToAnswer,
                    expire: dbPoll.expire,
                    loading: false
                })
            }

            if (dbPoll.pollType === 'open') {

                const options = Object.keys(dbPoll).reduce((a, key) => {
                    if (!keyTypes.includes(key)) {
                        a.push({[key]: dbPoll[key]});
                    }
                    return a;
                }, []);

                if (options.length === 0) {
                    this.setState({originalCount: 0})
                } else {
                    this.setState({originalCount: options.length - 1})
                }

                if (dbPoll.hasOwnProperty('imgSrc')) {
                    this.setState({imgSrc: dbPoll.imgSrc});
                }

                if (dbPoll.categoryList && dbPoll.categoryList.length > 0) {
                    this.setState({categories: dbPoll.categoryList});
                }

                this.setState({
                    title: dbPoll.title,
                    options: options,
                    pollType: dbPoll.pollType,
                    loginToAnswer: dbPoll.loginToAnswer,
                    expire: dbPoll.expire,
                    loading: false
                })
            }

            if (dbPoll.pollType === 'openmcq') {
                const options = Object.keys(dbPoll).reduce((a, key) => {
                    if (!keyTypes.includes(key)) {
                        a.push({[key]: dbPoll[key]});
                    }
                    return a;
                }, []);

                if (dbPoll.hasOwnProperty('imgSrc')) {
                    this.setState({imgSrc: dbPoll.imgSrc});
                }

                if (dbPoll.categoryList && dbPoll.categoryList.length > 0) {
                    this.setState({categories: dbPoll.categoryList});
                }

                this.setState({
                    title: dbPoll.title,
                    options: options, pollType: dbPoll.pollType,
                    loginToAnswer: dbPoll.loginToAnswer,
                    expire: dbPoll.expire,
                    loading: false
                })
            }
        })).bind(this);
    }

    componentWillUnmount() {
        this.pollRef.off();
    }

    handleVote(option) {
        let currentCount = this.state.options.filter(o => {
            return o.hasOwnProperty(option);
        })[0][option];

        firebaseApp.database().ref().update({[`polls/${this.props.match.params.pollId}/${option}`]: currentCount += 1})
        localStorage.setItem(this.props.match.params.pollId, 'true');
        this.setState({voted: true, showSnackbar: true, showResults: true});
    }

    handleAnswerChange(e) {
        this.setState({newOption: {option: e.target.value, optionError: ''}});
    }

    handleAnswerOpen(e) {
        e.preventDefault();

        if (this.formIsInvalid()) {
            console.log('Invalid Answer');
            return;
        }

        const newOption = this.state.newOption.option;

        if (this.state.options.filter(o => {
            return o.hasOwnProperty(newOption);
        }).length > 0) {
            let currentCount = this.state.options.filter(o => {
                return o.hasOwnProperty(newOption);
            })[0][newOption];

            firebaseApp.database().ref().update({[`polls/${this.props.match.params.pollId}/${newOption}`]: currentCount += 1})
            localStorage.setItem(this.props.match.params.pollId, 'true');
            this.setState({voted: true, showSnackbar: true});
        } else {

            const updates = {}

            updates[`polls/${this.props.match.params.pollId}/${newOption}`] = 1;

            firebaseApp.database().ref().update(updates);
            localStorage.setItem(this.props.match.params.pollId, 'true');
            this.setState({voted: true, showSnackbar: true, showResults: true});
        }
    }

    handleShareModelClose = () => {
        this.setState({showShareDialog: false});
    };

    handleShareModelOpen = () => {
        this.setState({showShareDialog: true});
    };

    renderTimer = () => {
        if (this.state.expire && this.state.expire.check) {
            if (this.state.status === 'expired') {
                return (
                    <h6>Poll has expired</h6>
                );
            } else {
                return (
                    <h6>Time
                        Remaining: {Math.floor((new Date(this.state.expire.expireDate).getTime() - new Date().getTime()) / 60 / 1000)} Minutes</h6>
                );
            }
        }
        return ''
    };

    handleChipClick = (cat) => {
        const query = cat.split(' ').join('%20');
        history.push(`/category/${query}`);
    };

    handleMouseHoverIn = () => {
        this.setState({showResults: true})
    };

    handleMouseHoverOut = () => {
        this.setState({showResults: false})
    };

    handleUpdatePoll = () => {
        history.push(`/polls/update/${this.props.match.params.pollId}`)
    };

    handleCopy = () => {
        this.setState({copied: true});
        window.setTimeout(() => {
            this.setState({copied: false})
        }, 5000)
    };

    handleCopySnackBarClose = () => {
        this.setState({copied: false})
    };

    SlideTransition = (props) => {
        return <Slide {...props} direction="up"/>
    };


    render() {
        let data;
        if (this.state.options.length < 4) {
            data = this.state.options.map(option => {
                return [Object.keys(option)[0], option[Object.keys(option)[0]]];
            });
            data.unshift(['Option', 'Votes',]);
        } else {
            data = this.state.options.map(option => {
                return [Object.keys(option)[0], option[Object.keys(option)[0]], `color:${randomColor()}`];
            });
            data.unshift(['Option', 'Votes', {role: 'style'},]);
        }


        let customData = this.state.options.map(option => {
            return [Object.keys(option)[0], option[Object.keys(option)[0]], `color:${randomColor()}`];
        });
        customData.unshift(['Option', 'Votes', {role: 'style'},]);

        const words = this.state.options.reduce((a, option) => {
            a.push({text: Object.keys(option)[0], value: option[Object.keys(option)[0]]});
            return a;
        }, []);

        let isAuthUser = firebaseApp.auth().currentUser ? true : false;

        let addOptionUI;
        if (isAuthUser && this.state.status !== "expired") {
            addOptionUI = (
                <div>
                    <Button onClick={this.handleUpdatePoll} variant="outline-warning" style={{marginLeft: "10px"}}>
                        Update
                    </ Button>
                </div>
            );
        }

        let optionsUI = this.state.options.map(option => {
            return (
                <Row className='d-flex justify-content-center' key={Object.keys(option)[0]}>
                    <Button
                        children={Object.keys(option)[0]}
                        onClick={() => this.handleVote(Object.keys(option)[0])}
                        disabled={this.state.voted}
                        size='lg'
                        block
                    />
                </Row>

            );
        });

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


        switch (this.state.pollType) {
            case 'mcq':
                return (
                    <Styles>
                        <div className='background-color'>
                            <Container fluid>
                                <Row style={{marginBottom: '0px'}}>
                                    <Col xs={{span: 10, offset: 1}}>
                                        <Loading loading={this.state.loading}/>
                                        <Paper className='row-style' elevation={5}>
                                            <Container fluid>
                                                <Row className='d-flex align-items-center'>
                                                    <div className='share-btn'>
                                                        <Button variant="outline-primary"
                                                                onClick={this.handleShareModelOpen}>Share</Button>
                                                    </div>
                                                    {addOptionUI}
                                                    {this.state.status === 'expired' ? '' :
                                                        <div className='ml-auto results-circle'
                                                             onMouseEnter={this.handleMouseHoverIn}
                                                             onMouseLeave={this.handleMouseHoverOut}>
                                                            <span>R</span>
                                                        </div>
                                                    }
                                                </Row>
                                                <Row className='d-flex justify-content-center'>
                                                    <Col xs={{span: 8}}>
                                                        <h2 className='poll-question text-center'>{this.state.title}</h2>
                                                    </Col>
                                                </Row>
                                                {this.state.showResults ?
                                                    <Row>
                                                        <Col xs={{span: 8, offset: 2}}>
                                                            {this.state.options.length < 4 && this.state.options.length > 0 ?
                                                                <Chart
                                                                    chartType="PieChart"
                                                                    width="100%"
                                                                    data={data}
                                                                    options={{
                                                                        animation: {
                                                                            startup: true,
                                                                            easing: 'linear',
                                                                            duration: 1500,
                                                                        },
                                                                    }}
                                                                /> :
                                                                <Chart
                                                                    chartType="BarChart"
                                                                    loader={<div>Loading Chart</div>}
                                                                    width="100%"
                                                                    data={data}
                                                                    options={{
                                                                        animation: {
                                                                            startup: true,
                                                                            easing: 'linear',
                                                                            duration: 1500,
                                                                        },
                                                                        bars: 'horizontal',
                                                                        hAxis: {
                                                                            minValue: 0,
                                                                            gridlines: {
                                                                                count: 0
                                                                            },
                                                                            textPosition: "none",
                                                                            baselineColor: '#fff'
                                                                        },
                                                                        vAxis: {
                                                                            title: 'Options',
                                                                            baselineColor: '#fff',
                                                                            gridlines: {
                                                                                count: 0
                                                                            },
                                                                        },
                                                                        legend: {position: 'none'},
                                                                    }}
                                                                />
                                                            }
                                                        </Col>
                                                    </Row>
                                                    : <div>
                                                        <Row>
                                                            <Col xs={{span: 8, offset: 2}}>
                                                                {this.state.imgSrc !== null ?
                                                                    <Row>
                                                                        <div>
                                                                            <img src={this.state.imgSrc}
                                                                                 alt='User Uploaded'/>
                                                                        </div>
                                                                    </Row> : ''}
                                                                <Row>
                                                                    <Col xs={{span: 4, offset: 4}}>
                                                                        {optionsUI}
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                }
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
                                    url={`https://fifty50x.firebaseapp.com/polls/poll/${this.props.match.params.pollId}`}
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
            case 'open':
                return (
                    <Styles>
                        <div className='background-color'>
                            <Container fluid>
                                <Row style={{marginBottom: '0px'}}>
                                    <Col xs={{span: 10, offset: 1}}>
                                        <Loading loading={this.state.loading}/>
                                        <Paper className='row-style' elevation={5}>
                                            <Container fluid>
                                                <Row className='d-flex align-items-center'>
                                                    <div className='share-btn'>
                                                        <Button variant="outline-primary"
                                                                onClick={this.handleShareModelOpen}>Share</Button>
                                                    </div>
                                                    {this.state.status === 'expired' || this.state.voted ? '' :
                                                        <div className='ml-auto results-circle'
                                                             onMouseEnter={this.handleMouseHoverIn}
                                                             onMouseLeave={this.handleMouseHoverOut}>
                                                            <span>R</span>
                                                        </div>
                                                    }
                                                </Row>
                                                <Row className='d-flex justify-content-center'>
                                                    <Col xs={{span: 8}}>
                                                        <h2 className='poll-question text-center'>{this.state.title}</h2>
                                                    </Col>
                                                </Row>
                                                {this.state.showResults ?
                                                    <Row>
                                                        <Col xs={{span: 8, offset: 2}}>
                                                            {words.length > 0 ?
                                                                <ReactWordcloud words={words}
                                                                                options={{
                                                                                    rotations: 2,
                                                                                    scale: 'log',
                                                                                    fontSizes: [35, 60],
                                                                                    rotationAngles: [0, 90],
                                                                                    fontFamily: 'Roboto',
                                                                                    spiral: 'archimedean',
                                                                                    deterministic: true,
                                                                                }}/> :
                                                                <h5 className='text-center'>No Data Yet</h5>}
                                                        </Col>
                                                    </Row>
                                                    : <div>
                                                        <Row>
                                                            <Col xs={{span: 8, offset: 2}}>
                                                                {this.state.imgSrc !== null ?
                                                                    <Row>
                                                                        <div>
                                                                            <img src={this.state.imgSrc}
                                                                                 alt='User Uploaded'/>
                                                                        </div>
                                                                    </Row> : ''}
                                                                <Row>
                                                                    <Col xs={{span: 8, offset: 2}}>
                                                                        {this.state.voted ? <h2>Already Answer</h2> :
                                                                            <form onSubmit={this.handleAnswerOpen}>
                                                                                <InputGroup>
                                                                                    <FormControl
                                                                                        placeholder="Your Answer Here"
                                                                                        value={this.state.newOption.option}
                                                                                        onChange={this.handleAnswerChange}
                                                                                        isInvalid={Boolean(this.state.newOption.optionError)}
                                                                                        disabled={this.state.voted}
                                                                                    />
                                                                                    {/*<FormControl.Feedback  type="invalid">{this.state.newOption.optionError}</FormControl.Feedback>*/}
                                                                                    <InputGroup.Append>
                                                                                        <Button
                                                                                            variant="outline-primary"
                                                                                            type='submit'>Submit</Button>
                                                                                    </InputGroup.Append>
                                                                                </InputGroup>
                                                                            </form>}
                                                                    </Col>
                                                                </Row>
                                                            </Col>
                                                        </Row>
                                                    </div>
                                                }
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
                                    url={`https://fifty50x.firebaseapp.com/polls/poll/${this.props.match.params.pollId}`}
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
            case 'openmcq':
                return (
                    <Styles>
                        <div className='background-color'>
                            <Container fluid>
                                <Row style={{marginBottom: '0px'}}>
                                    <Col xs={{span: 10, offset: 1}}>
                                        <Loading loading={this.state.loading}/>
                                        <Paper className='row-style' elevation={5}>
                                            <Container fluid>
                                                <Row className='d-flex align-items-center'>
                                                    <div className='share-btn ml-auto'>
                                                        <Button variant="outline-primary"
                                                                onClick={this.handleShareModelOpen}>Share</Button>
                                                    </div>
                                                </Row>
                                                <Row className='d-flex justify-content-center'>
                                                    <Col xs={{span: 8}}>
                                                        <h2 className='poll-question text-center'>{this.state.title}</h2>
                                                    </Col>
                                                </Row>
                                                <Row>
                                                    <Col xs={{span: 8, offset: 2}}>
                                                        {this.state.imgSrc !== null ?
                                                            <Row>
                                                                <div>
                                                                    <img src={this.state.imgSrc}
                                                                         alt='User Uploaded'/>
                                                                </div>
                                                            </Row> : ''}
                                                        <Row>
                                                            <Col xs={{span: 10, offset: 2}}>
                                                                {this.state.options.length > 0 ?
                                                                    <Chart
                                                                        chartType="BarChart"
                                                                        loader={<div>Loading Chart</div>}
                                                                        width="100%"
                                                                        data={customData}
                                                                        chartEvents={[
                                                                            {
                                                                                eventName: 'select',
                                                                                callback: ({chartWrapper}) => {
                                                                                    const chart = chartWrapper.getChart();
                                                                                    const selection = chart.getSelection();
                                                                                    if (selection.length === 1 && !this.state.voted) {
                                                                                        const [selectedItem] = selection;
                                                                                        const {row} = selectedItem;
                                                                                        this.handleVote(customData[row + 1][0])
                                                                                    }
                                                                                },
                                                                            },
                                                                        ]}
                                                                        options={{
                                                                            animation: {
                                                                                startup: true,
                                                                                easing: 'linear',
                                                                                duration: 750,
                                                                            },
                                                                            hAxis: {
                                                                                minValue: 0,
                                                                                gridlines: {
                                                                                    count: 0
                                                                                },
                                                                                textPosition: "none",
                                                                                baselineColor: '#fff'
                                                                            },
                                                                            vAxis: {
                                                                                title: 'Options',
                                                                                baselineColor: '#fff'
                                                                            },
                                                                            legend: {position: 'none'},
                                                                        }}
                                                                    /> : ''}
                                                            </Col>
                                                        </Row>
                                                        <Row>
                                                            <Col xs={{span: 8, offset: 2}}>
                                                                {this.state.voted ? '' :
                                                                    <form onSubmit={this.handleAnswerOpen}>
                                                                        <InputGroup>
                                                                            <FormControl
                                                                                placeholder="Your Answer Here"
                                                                                value={this.state.newOption.option}
                                                                                onChange={this.handleAnswerChange}
                                                                                isInvalid={Boolean(this.state.newOption.optionError)}
                                                                                disabled={this.state.voted}
                                                                            />
                                                                            {/*<FormControl.Feedback  type="invalid">{this.state.newOption.optionError}</FormControl.Feedback>*/}
                                                                            <InputGroup.Append>
                                                                                <Button
                                                                                    variant="outline-primary"
                                                                                    type='submit'>Submit</Button>
                                                                            </InputGroup.Append>
                                                                        </InputGroup>
                                                                    </form>}
                                                            </Col>
                                                        </Row>
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
                                    url={`https://fifty50x.firebaseapp.com/polls/poll/${this.props.match.params.pollId}`}
                                    copied={this.handleCopy}/>
                                <Snackbar anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
                                          open={this.state.copied}
                                          message={<span id="message-id">Link has been copied.</span>}
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
                )
                    ;
            default:
                return (
                    <h1>Loading</h1>
                );
        }

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

export default Poll;