import React from 'react';
import {firebaseApp} from "../utils/firebase";
import Loading from "./Loading";
import Paper from "@material-ui/core/Paper";

import {Container, Row, Col, CardColumns, Card,} from 'react-bootstrap';

import styled from "styled-components";
import Chip from "@material-ui/core/Chip";
import LinesEllipsis from 'react-lines-ellipsis'
import moment from 'moment';
import history from "../history";

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

class Category extends React.Component {
    state = {
        loading: true,
        polls: [],
        pollGroups: [],
        clickedPollId: '',
    };

    componentDidMount() {
        let cat = this.props.match.params.category;
        this.PollRef = firebaseApp.database().ref(`category/${cat}`);
        this.PollRef.once('value').then(snapshot => {
            if (!snapshot.hasChildren()) {
                if (this.mounted) {
                    this.setState({loading: false});
                }
            }
        });

        this.PollRef.on('child_added', ((newPollIdSnapshot) => {
            const pollId = newPollIdSnapshot.key;

            firebaseApp.database().ref(`polls/${pollId}`).once('value').then(snapshot => {
                const poll = snapshot.val();
                const polls = this.state.polls;
                if (poll) {
                    polls.push({poll: poll, id: pollId});
                }

                if (this.mounted) {
                    this.setState({
                        polls: polls,
                        loading: false
                    });
                }
            });

            firebaseApp.database().ref(`pollgroup/${pollId}`).once('value').then(snapshot => {
                const poll = snapshot.val();
                const pollgroups = this.state.pollGroups;
                if (poll) {
                    pollgroups.push({pollGroup: poll, id: pollId})
                }

                if (this.mounted) {
                    this.setState({
                        pollGroups: pollgroups,
                        loadingPollGroup: false
                    });
                }
            });
        })).bind(this);

        this.mounted = true;
    }

    componentWillUnmount() {
        this.PollRef.off();
        this.mounted = false;
    }

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
                            <Card.Subtitle>Poll Group</Card.Subtitle>
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
                                <h2 style={{marginBottom: '20px'}}>Category: <span style={{color:"red"}}>{this.props.match.params.category}</span></h2>
                                <div style={{margin: "15px 0 30px"}}>
                                    <CardColumns>
                                        {pollsUIs}
                                        {pollGroupUIs}
                                        <Loading loading={this.state.loading}/>
                                    </CardColumns>
                                </div>
                            </Paper>
                        </Col>
                    </Row>
                </Styles>
            </Container>
        );
    }
}


export default Category;