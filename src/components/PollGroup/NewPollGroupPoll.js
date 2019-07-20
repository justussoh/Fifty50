import React from 'react';
import {Card, CardActionArea, CardContent} from '@material-ui/core';
import {Container, Row, Col} from 'react-bootstrap';
import NewSingleOption from '../Polls/NewSingleOption';
import NewOpenEnded from "../Polls/NewOpenEnded"
import NewOpenEndedMcq from "../Polls/NewOpenEndedMcq";
import {firebaseApp} from "../../utils/firebase";
import history from "../../history";
import Loading from "../Loading";
import styled from "styled-components";
import CardDeck from "react-bootstrap/CardDeck";

const pollOptions = [
    {
        value: 'mcq',
        label: 'Fixed',
        desc: 'Defined fixed answer options for your target audience',
    },
    {
        value: 'open',
        label: 'Open-Ended',
        desc: 'Allow your target audience to respond freely',
    },
    {
        value: 'openmcq',
        label: 'Custom',
        desc: 'Allow your target audience to respond freely and vote based on others answers',
    },
];

const Styles = styled.div`
    .background{
        min-height:75vh;
        
     }
     
     .main-paper{
         padding: 30px;
         margin-top:20px;
         min-height:45vh;
     }
     
     .option-card{
         width:30%;
         margin:10px;
     }
     
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
        color:#00001a;
    }
    
    .font{
        font-family:Roboto;
    }
    
    .option-title{
        color:#00001a;
    }
    
    .option-desc{
        font-size:12px;
        color:#00001a;
    }
    
    .option-logo{
        height: 60px;
        margin-top:20px;
        margin-bottom:20px;
    }
    
    .section-heading{
        margin: 30px 0px;
    }
    
    .green-circle{
        border-radius: 50%;
        background-color: #49AE4B;
        height: 35px;
        width: 35px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-family: 'Roboto';
        font-weight: bold;
        font-size: 16px;
        margin-right: 10px;
    }
    
    .section-header{
        font-family: 'Roboto';
        font-weight: bold;
        font-size: 18px;
        color: #49AE4B;
        margin-bottom: 0px;
    }
    
    
`;


class NewPollGroupPoll extends React.Component {

    state = {
        typePoll: 'mcq',
        loggedIn: false,
        loading: true,
    };

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                let currentuser = firebaseApp.auth().currentUser;
                this.setState({
                    uid: currentuser.uid,
                    username: currentuser.displayName,
                    loggedIn: true,
                    loading: false
                });
            } else {
                this.setState({loggedIn: false, loading: false})
            }
        });
    }

    handleBack = () => {
        history.push(`/pollgroup/view/${this.props.match.params.pollId}`);
    };

    handleCardClick = (type) => {
        this.setState({typePoll: type})
    };


    render() {

        const showComponent = () => {
            switch (this.state.typePoll) {
                case 'mcq':
                    return <NewSingleOption pollGroup={true} pollId={this.props.match.params.pollId}
                                            handleBack={this.handleBack}/>;
                case 'open':
                    return <NewOpenEnded pollGroup={true} pollId={this.props.match.params.pollId}
                                         handleBack={this.handleBack}/>;
                case 'openmcq':
                    return <NewOpenEndedMcq pollGroup={true} pollId={this.props.match.params.pollId}
                                            handleBack={this.handleBack}/>;
                default:
                    return <NewSingleOption pollGroup={true} pollId={this.props.match.params.pollId}
                                            handleBack={this.handleBack}/>;
            }
        };

        const renderPollType = pollOptions.map((option) => {
            return (
                <Card key={option.value} className='option-card'>
                    <CardActionArea onClick={(e) => {
                        this.handleCardClick(option.value)
                    }} style={{height: "100%"}}>
                        <CardContent className='d-flex flex-column align-items-center'>
                            <img src={`/images/${option.value}.png`} alt={option.value} className='option-logo'/>
                            <h4 className='text-center font option-title'>{option.label}</h4>
                            <p className='text-center font option-desc'>{option.desc}</p>
                        </CardContent>
                    </CardActionArea>
                </Card>
            );
        });


        switch (this.state.loggedIn) {
            case null:
                return <div></div>;
            case true:
                return (
                    <Styles>
                        <Container fluid>
                            <Row className='d-flex flex-column justify-content-center align-items-center'>
                                <div className='d-flex align-items-center section-heading justify-content-center'>
                                    <div className='green-circle'><strong>1</strong></div>
                                    <h1 className='section-header'>Add New Poll to Poll Group</h1>
                                </div>
                                <CardDeck>
                                    {renderPollType}
                                </CardDeck>
                            </Row>
                            <Row className='d-flex flex-column justify-content-center align-items-center'>
                                <div className='d-flex align-items-center section-heading justify-content-center'>
                                    <div className='green-circle'><strong>2</strong></div>
                                    <h1 className='section-header'>Enter Poll Details</h1>
                                </div>
                                <div>
                                {showComponent()}
                                </div>
                            </Row>
                        </Container>
                    </Styles>
                );
            default:
                return (<Loading loading={this.state.loading}/>)
            // window.setTimeout(() => history.push(`/`), 5000);
        }
    }
}

export default NewPollGroupPoll;