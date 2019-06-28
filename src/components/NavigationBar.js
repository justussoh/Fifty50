import React from 'react';
import { firebaseApp } from '../utils/firebase';
import history from '../history';
import styled from 'styled-components';

import { Nav, Navbar } from 'react-bootstrap';
import Button from '@material-ui/core/Button';

const Styles = styled.div`
    .Navbar{
        background-color: #222;
    }

    .Navbar-brand, .Navbar-nav .nav-link {
        color: #bbb;

        &:hover {
            color: white;
        }
    }
`;

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: (null !== firebaseApp.auth().currentUser) //currentUser is null when not loggedin 
        };
    }

    componentWillMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            this.setState({
                loggedIn: (null !== user) //user is null when not loggedin 
            })
        });
    }

    handleLogout() {
        firebaseApp.auth().signOut().then(() => {
            //console.log("sign out succesful");
            history.push('/');
        }, (error) => {
            console.log(error);
        });
    }

    render() {

        let login = <Nav.Link href="/login">Login</Nav.Link>

        if (this.state.loggedIn) {
            login = <Nav.Link href="/polls/dashboard">Dashboard</Nav.Link>
        }
                                
        return (
            <Styles>
                <Navbar expand="lg">
                    <Navbar.Brand href='/'>Fifty50</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="ml-auto">
                            <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link href="/about">About</Nav.Link></Nav.Item>
                            <Nav.Item><Nav.Link href="/contact">Contact</Nav.Link></Nav.Item>
                            <Nav.Item>{ login }</Nav.Item>
                            {this.state.loggedIn ?
                                <Nav.Item>
                                <Button
                                    onClick={this.handleLogout}
                                    children="Logout"
                                    />
                                </Nav.Item>
                                : ''}
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
            </Styles>
        )
    }

}

export { NavigationBar }