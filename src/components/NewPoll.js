import React from 'react';
import {Paper, Card, CardActionArea, CardContent} from '@material-ui/core';
import NewSingleOption from './NewSingleOption';
import NewOpenEnded from "./NewOpenEnded"
import NewOpenEndedMcq from "./NewOpenEndedMcq";
import {Container, Row, Col, Button} from 'react-bootstrap';
import styled from "styled-components";
import history from '../history';

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
        background-color:#cbcbe6;
        min-height:75vh;
     }
     
     .main-paper{
     padding: 30px;
     margin-top:30px;
     margin-bottom:30px;
     min-height:65vh;
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
        color:#707070;
    }
    
    .font{
        font-family:Roboto;
    }
    
    .option-desc{
        font-size:12px;
        color:#707070;
    }
    
    .option-logo{
        height: 60px;
        margin-top:20px;
        margin-bottom:20px;
    }
`;

class NewPoll extends React.Component {

    state = {
        typePoll: 'main'
    };

    handleCardClick = (value) => {
        this.setState({typePoll: value});
    };

    handleCancel = (e) => {
        history.push('/polls/dashboard')
    };

    handleCreatePollGroup = (e) => {
        history.push('/pollgroup/new')
    };

    render() {

        const showComponent = () => {
            switch (this.state.typePoll) {
                case 'mcq':
                    return <NewSingleOption/>;
                case 'open':
                    return <NewOpenEnded/>;
                case 'openmcq':
                    return <NewOpenEndedMcq/>;
                default:
                    return (
                        <Paper className='main-paper'>
                            <Container fluid>
                                <Row className='d-flex justify-content-center align-items-center'>
                                    <div>
                                        <h3 className='type-title font'>SELECT THE TYPE OF POLL QUESTION</h3>
                                        <hr className='line'/>
                                    </div>
                                </Row>
                                <Row className='d-flex align-items-stretch justify-content-center' style={{marginBottom:'20px'}}>
                                    {renderCards}
                                </Row>
                                <Row>
                                    <Col xs={{span: 3, offset: 3}}>
                                        <Button variant="outline-danger" onClick={this.handleCancel}
                                                block>Cancel</Button>
                                    </Col>
                                    <Col xs={3}>
                                        <Button variant="outline-warning" onClick={this.handleCreatePollGroup}
                                                block>Try creating a Poll Group</Button>
                                    </Col>
                                </Row>
                            </Container>
                        </Paper>
                    );
            }
        };

        const renderCards = pollOptions.map((option) => {
            return (
                <Card key={option.value} className='option-card'>
                    <CardActionArea onClick={(e) => {
                        this.handleCardClick(option.value)
                    }} style={{height: "100%"}}>
                        <CardContent className='d-flex flex-column align-items-center'>
                            <img src={`/images/${option.value}.png`} alt={option.value} className='option-logo'/>
                            <h4 className='text-center font'>{option.label}</h4>
                            <p className='text-center font option-desc'>{option.desc}</p>
                        </CardContent>
                    </CardActionArea>
                </Card>
            );
        });

        return (
            <Styles>
                <Container fluid className='background'>
                    <Row>
                        <Col xs={{span: 10, offset: 1}}>
                            {showComponent()}
                        </Col>
                    </Row>
                </Container>
            </Styles>
        )
    }
}

export default NewPoll