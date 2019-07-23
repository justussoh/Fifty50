import React from 'react';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import styled from "styled-components";
import {Container, Row, Col} from "react-bootstrap";

const Styles = styled.div`
    .section{
        height:80vh;
        padding: 5vh 0;
    }
`;

class Contact extends React.Component {

    constructor(){
        super();

        this.state = {
            name: '',
            email: '',
            contact: '',
            message: ''
        };

        this.onSubmit=this.onSubmit.bind(this);
    }



    handleNameChange = (e) => {
        this.setState({name: e.target.value})
    };

    handleEmailChange = (e) => {
        this.setState({email: e.target.value})
    };

    handleContactChange = (e) => {
        this.setState({contact: e.target.value})
    };

    handleMessageChange = (e) => {
        this.setState({message: e.target.value})
    };

    async onSubmit(e) {
        e.preventDefault();
        let {name, email, contact, message} = this.state;

        await axios.post('/api/contact', {
            name,
            email,
            contact,
            message,
        }).then(res => {
            alert('Message has been successfully sent!')
        }).catch(err => {
            console.log(err);
        });
    };

    render() {
        return (
            <Styles>
                <Container className='section'>
                    <Row>
                        <Col xs={{span: 10, offset: 1}}>
                            <Row className='d-flex align-items-center justify-content-center'
                                 style={{marginBottom: "20px"}}>
                                <h2 className='text-center'>We're here to help</h2>
                            </Row>
                            <Row>
                                <Col className='d-flex align-items-center justify-content-center'>
                                    <div className='d-flex flex-column align-items-center justify-content-center'>
                                        <h6>EMAIL US</h6>
                                        <h6>support@fifty50.com</h6>
                                        <br/>
                                        <h6>CALL US</h6>
                                        <h6>+65 91234567</h6>
                                        <h6>Monday - Friday: 11am - 5pm SGT</h6>
                                        <h6>(excluding public holidays)</h6>
                                        <br/>
                                        <h6>Our goal is to reply within the same day, but it</h6>
                                        <h6>might take us until the next business day.</h6>
                                    </div>
                                </Col>
                                <Col className='d-flex flex-column' xs={{span: 4}}>
                                    <form onSubmit={this.onSubmit}>
                                        <TextField
                                            value={this.state.name}
                                            id="standard-dense"
                                            label="Name"
                                            margin="dense"
                                            variant="outlined"
                                            onChange={this.handleNameChange}
                                        />
                                        <TextField
                                            value={this.state.email}
                                            id="standard-dense"
                                            label="Email"
                                            margin="dense"
                                            variant="outlined"
                                            onChange={this.handleEmailChange}
                                        />
                                        <TextField
                                            value={this.state.contact}
                                            id="standard-dense"
                                            label="contact"
                                            margin="dense"
                                            variant="outlined"
                                            onChange={this.handleContactChange}
                                        />
                                        <TextField
                                            value={this.state.message}
                                            id="outlined-multiline-flexible"
                                            label="Message"
                                            multiline
                                            rows={4}
                                            rowsMax="20"
                                            margin="normal"
                                            variant="outlined"
                                            onChange={this.handleMessageChange}
                                        />

                                        <Button
                                            variant="outlined"
                                            label="Create"
                                            type="submit">
                                            Submit
                                        </Button>
                                    </form>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
            </Styles>)
    }
}


export default Contact;