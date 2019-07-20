import React from 'react';
import {firebaseApp} from '../utils/firebase';
import history from '../history';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import Snackbar from '@material-ui/core/Snackbar';
import Slide from '@material-ui/core/Slide';
import ButtonRB from 'react-bootstrap/Button';

import {Container, Row, Col, CardColumns, Card,} from 'react-bootstrap';

import Loading from './Loading';

import styled from "styled-components";
import Chip from "@material-ui/core/Chip";
import DeleteIcon from '@material-ui/icons/DeleteOutline';
import ShareIcon from '@material-ui/icons/ShareOutlined';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import PollShareDialog from "./Polls/PollShareDialog";
import LinesEllipsis from 'react-lines-ellipsis'

import moment from 'moment';


const Styles = styled.div`
    .card-content{
        padding: 20px 10px 10px 10px;
        
        &:hover{
            cursor: pointer;
        }
    }
    
    .card-cat{
        padding-top:10px;
    }  
    
    .card-poll:hover{
        -webkit-box-shadow: 0px 0px 25px 0px rgba(177,177,177,1);
        -moz-box-shadow: 0px 0px 25px 0px rgba(177,177,177,1);
        box-shadow: 0px 0px 25px 0px rgba(177,177,177,1);
    }
    
    .dashboard-row{
        margin-top:30px;
        margin-bottom:30px;
    }
    
     .dashboard-paper{
        padding-top:30px;
        padding-bottom:30px;
    }
      
  }`;

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            loading: true,
            loadingPollGroup: true,
            polls: [],
            pollGroups: [],
            user: null,
            clickedPollId: '',
            showShareDialog: false,
            copied: false,
            deleteType: '',
            shareType: '',
        };

        this.poll2Delete = '';
        this.poll2DeleteTitle = '';

        this.handleClose = this.handleClose.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                const uid = user.uid;
                this.setState({user: user});
                this.userPollsRef = firebaseApp.database().ref(`user-polls/${uid}`);

                this.userPollsRef.once('value').then(snapshot => {
                    if (!snapshot.hasChildren()) {
                        if (this.mounted) {
                            this.setState({loading: false});
                        }
                    }
                });

                this.userPollsRef.on('child_added', ((newPollIdSnapshot) => {
                    const pollId = newPollIdSnapshot.key;

                    firebaseApp.database().ref(`polls/${pollId}`).once('value').then(snapshot => {
                        const poll = snapshot.val();
                        const polls = this.state.polls;
                        polls.push({poll: poll, id: pollId})

                        if (this.mounted) {
                            this.setState({
                                polls: polls,
                                loading: false
                            });
                        }
                    });
                })).bind(this);

                this.userPollsRef.on('child_removed', ((removedPollIdSnapshot) => {
                    const pollId = removedPollIdSnapshot.key;
                    const polls = this.state.polls.filter(poll => poll.id !== pollId);
                    if (this.mounted) {
                        this.setState({
                            polls: polls
                        });
                    }
                })).bind(this);

                this.userPollGroupRef = firebaseApp.database().ref(`user-pollgroup/${uid}`);

                this.userPollGroupRef.once('value').then(snapshot => {
                    if (!snapshot.hasChildren()) {
                        if (this.mounted) {
                            this.setState({loadingPollGroup: false});
                        }
                    }
                });

                this.userPollGroupRef.on('child_added', ((newPollIdSnapshot) => {
                    const pollId = newPollIdSnapshot.key;

                    firebaseApp.database().ref(`pollgroup/${pollId}`).once('value').then(snapshot => {
                        const poll = snapshot.val();
                        const pollgroups = this.state.pollGroups;
                        pollgroups.push({pollGroup: poll, id: pollId})

                        if (this.mounted) {
                            this.setState({
                                pollGroups: pollgroups,
                                loadingPollGroup: false
                            });
                        }
                    });
                })).bind(this);

                this.userPollGroupRef.on('child_removed', ((removedPollIdSnapshot) => {
                    const pollId = removedPollIdSnapshot.key;
                    const polls = this.state.pollGroups.filter(poll => poll.id !== pollId);
                    if (this.mounted) {
                        this.setState({
                            pollGroups: polls
                        });
                    }
                })).bind(this);
            }
        });

        this.mounted = true;
    }

    componentWillUnmount() {
        this.userPollsRef.off();
        this.userPollGroupRef.off();
        this.mounted = false;
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log(this.state)
    }

    handleOpen(pollId, type) {
        if (type === 'poll') {
            this.setState({dialogOpen: true, deleteType: type});
            this.poll2Delete = pollId;
            this.poll2DeleteTitle = this.state.polls.find(poll => poll.id === this.poll2Delete).poll.title;
        } else {
            this.setState({dialogOpen: true, deleteType: type});
            this.poll2Delete = pollId;
            this.poll2DeleteTitle = this.state.pollGroups.find(poll => poll.id === this.poll2Delete).pollGroup.title;
        }

    };

    handleClose() {
        this.setState({dialogOpen: false});
    };

    handleDelete() {
        // updating to null deletes
        if (this.state.deleteType === 'poll') {
            const updates = {};
            updates[`/polls/${this.poll2Delete}`] = null;
            updates[`/user-polls/${firebaseApp.auth().currentUser.uid}/${this.poll2Delete}`] = null;

            firebaseApp.database().ref().update(updates);

            this.setState({dialogOpen: false});
        } else {
            const updates = {};
            updates[`/pollgroup/${this.poll2Delete}`] = null;
            updates[`/user-pollgroup/${firebaseApp.auth().currentUser.uid}/${this.poll2Delete}`] = null;

            firebaseApp.database().ref().update(updates);

            this.setState({dialogOpen: false});
        }
    };

    handleCreateNewPoll = () => {
        history.push("/polls/new")
    };

    handleCreateNewPollGroup = () => {
        history.push("/pollgroup/new")
    };

    handlePollClick = (pollId) => {
        history.push(`/polls/poll/${pollId}`)
    };

    handlePollGroupClick = (pollId) => {
        history.push(`/pollgroup/view/${pollId}`)
    };

    handleChipClick = (cat) => {
        const query = cat.split(' ').join('%20');
        history.push(`/category/${query}`);
    };

    handleShareModelClose = () => {
        this.setState({showShareDialog: false});
    };

    handleShareModelOpen = (pollid, type) => {
        this.setState({showShareDialog: true, clickedPollId: pollid, shareType: type});
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

        let renderType = (pollType) => {
            switch (pollType) {
                case 'mcq':
                    return (<Card.Subtitle>Fixed Answer Question</Card.Subtitle>);
                case 'open':
                    return (<Card.Subtitle>Open Ended Question</Card.Subtitle>);
                case 'openmcq':
                    return (<Card.Subtitle>Custom Question</Card.Subtitle>);
                default:
                    return (<Card.Subtitle>Unknown Question Type</Card.Subtitle>)
            }
        };

        let pollsUIs = this.state.polls.map((poll) => {
            return (
                <Card key={poll.id} className='card-poll'>
                    <Card.Body>
                        <div onClick={() => this.handlePollClick(poll.id)}
                             className='d-flex flex-column align-items-center card-content'>
                            <LinesEllipsis
                                text={<h3 className='text-center'>{poll.poll.title}</h3>}
                                maxLine='3'
                                ellipsis='...'
                                trimRight
                                basedOn='letters'
                            />
                            {renderType(poll.poll.pollType)}
                            {poll.poll.username !== '' ?
                                <span>Created by {poll.poll.username}, <span>{moment(poll.poll.createAt).format("DD MMM YYYY")}</span></span>
                                :
                                <span>Created by <i>Anonymous</i>, <span>{moment(poll.poll.createAt).format("DD MMM YYYY")}</span></span>}
                        </div>
                        <div>
                            {Boolean(poll.poll.categoryList) ?
                                <div className='card-cat'>
                                    <h6>Categories: </h6>
                                    {poll.poll.categoryList.map((cat, catIndex) => {
                                        return (
                                            <Chip
                                                key={catIndex}
                                                label={cat}
                                                onClick={() => this.handleChipClick(cat)}
                                                clickable
                                            />
                                        );
                                    })}</div> : ''}
                        </div>
                        <div className='d-flex'>
                            <IconButton className='ml-auto' onClick={() => this.handleOpen(poll.id, 'poll')}>
                                <DeleteIcon/>
                            </IconButton>
                            <IconButton onClick={() => this.handleShareModelOpen(poll.id, 'poll')}>
                                <ShareIcon/>
                            </IconButton>
                        </div>
                    </Card.Body>
                </Card>
            );
        });

        let pollGroupUIs = this.state.pollGroups.map((poll) => {
            return (
                <Card key={poll.id} className='card-poll'>
                    <Card.Body>
                        <div onClick={() => this.handlePollGroupClick(poll.id)}
                             className='d-flex flex-column align-items-center card-content'>
                            <LinesEllipsis
                                text={<h3 className='text-center'>{poll.pollGroup.title}</h3>}
                                maxLine='3'
                                ellipsis='...'
                                trimRight
                                basedOn='letters'
                            />
                            {poll.pollGroup.username !== '' ?
                                <span>Created by {poll.pollGroup.username}, <span>{moment(poll.pollGroup.createAt).format("DD MMM YYYY")}</span></span>
                                :
                                <span>Created by <i>Anonymous</i>, <span>{moment(poll.pollGroup.createAt).format("DD MMM YYYY")}</span></span>}
                        </div>
                        <div>
                            {Boolean(poll.pollGroup.categoryList) ?
                                <div className='card-cat'>
                                    <h6>Categories: </h6>
                                    {poll.pollGroup.categoryList.map((cat, catIndex) => {
                                        return (
                                            <Chip
                                                key={catIndex}
                                                label={cat}
                                                onClick={() => this.handleChipClick(cat)}
                                                clickable
                                            />
                                        );
                                    })}</div> : ''}
                        </div>
                        <div className='d-flex'>
                            <IconButton className='ml-auto' onClick={() => this.handleOpen(poll.id, 'pollGroup')}>
                                <DeleteIcon/>
                            </IconButton>
                            <IconButton onClick={() => this.handleShareModelOpen(poll.id, 'pollGroup')}>
                                <ShareIcon/>
                            </IconButton>
                        </div>
                    </Card.Body>
                </Card>
            );
        });

        return (
            <Container fluid={true}>
                <Styles>
                    <Row className='dashboard-row'>
                        <Col xs={{span: 10, offset: 1}}>
                            <Paper elevation={0} className='dashboard-paper'>
                                <h2 style={{marginBottom: '20px'}}>Dashboard</h2>
                                <Paper style={{padding: "30px", marginBottom:'30px'}} elevation={5}>
                                    <Row>
                                        <Col style={{borderRight: '1px solid #b1b1b1'}}
                                             className='d-flex flex-column align-items-center justify-content-center'>
                                            <h1>{this.state.polls.length}</h1>
                                            <h5>Open Polls</h5>
                                        </Col>
                                        <Col className='d-flex flex-column align-items-center justify-content-center'>
                                            <h1>{this.state.pollGroups.length}</h1>
                                            <h5>Poll Groups</h5>
                                        </Col>
                                    </Row>
                                </Paper>
                                <div style={{margin: "15px 0 30px"}}>
                                    <div className='d-flex align-items-center' style={{margin: "10px 0"}}>
                                        <h4>My Polls</h4>
                                        <ButtonRB onClick={this.handleCreateNewPoll} className='ml-auto' variant="outline-success">
                                            Create New Poll
                                        </ButtonRB>
                                    </div>
                                    <CardColumns>
                                        {pollsUIs}
                                        <Loading loading={this.state.loading}/>
                                    </CardColumns>
                                </div>
                                <div style={{margin: "15px 0 30px"}}>
                                    <div className='d-flex align-items-center' style={{margin: "10px 0"}}>
                                        <h4>My Polls Groups</h4>
                                        <ButtonRB onClick={this.handleCreateNewPollGroup} className='ml-auto' variant="outline-success">
                                            Create New Poll Group
                                        </ButtonRB>
                                    </div>
                                    <CardColumns>
                                        {pollGroupUIs}
                                        <Loading loading={this.state.loading}/>
                                    </CardColumns>
                                </div>
                            </Paper>
                        </Col>
                    </Row>
                    <Dialog
                        open={this.state.dialogOpen}
                        onClose={this.handleClose}
                    >
                        <DialogTitle>Delete "{this.poll2DeleteTitle}"?</DialogTitle>
                        <DialogActions>
                            <Button children="Cancel" onClick={this.handleClose}/>
                            <Button children="Delete" onClick={this.handleDelete}/>
                        </DialogActions>
                    </Dialog>
                    <PollShareDialog
                        show={this.state.showShareDialog}
                        Close={this.handleShareModelClose}
                        url={this.state.shareType === 'poll' ? `localhost:3000/polls/poll/${this.state.clickedPollId}` : `localhost:3000/pollgroup/view/${this.state.clickedPollId}`}
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
                </Styles>
            </Container>
        );
    }
}


export default Dashboard;
