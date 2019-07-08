import React from 'react';
import { firebaseApp } from '../utils/firebase';
import history from '../history';
import styled from 'styled-components';

import { Nav, Navbar } from 'react-bootstrap';
import Button from '@material-ui/core/Button';
import AvatarIcon from "./AvatarIcon";
import Dropdown from 'react-bootstrap/Dropdown';

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
            loggedIn: (null !== firebaseApp.auth().currentUser), //currentUser is null when not loggedin
            hover: false,
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

    handleAvatarMenuToggle = () => {
        this.setState({ hover: !this.state.hover })
    };

    renderNav = () => {
        switch (this.state.loggedIn) {
            case null:
                return <div></div>
            case true:
                return (
                    <Nav className="ml-auto">
                        <Dropdown as={Nav.Item} show={this.state.hover} onClick={this.handleAvatarMenuToggle}
                            alignRight={true}>
                            <Dropdown.Toggle as={AvatarIcon} />
                            <Dropdown.Menu>
                                <Dropdown.Item as={Nav.Link} href="/polls/dashboard" >Dashboard</Dropdown.Item>
                                <Dropdown.Divider />
                                <Dropdown.Item><Button
                                    onClick={this.handleLogout}
                                    children="Logout"
                                /></Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>);
            default:
                return (
                    <Nav className="ml-auto">
                        <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
                        < Nav.Item>< Nav.Link href="/about"> About </Nav.Link></Nav.Item>
                        < Nav.Item> < Nav.Link href="/contact"> Contact </Nav.Link></Nav.Item>
                        < Nav.Item> < Nav.Link href="/login"> Login </Nav.Link></Nav.Item>
                    </Nav>
                );
        }
    }

    render() {

        return (
            <Styles>
                <Navbar expand="lg">
                    <Navbar.Brand href='/'>Fifty50</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">

                        {this.renderNav()}

                    </Navbar.Collapse>
                </Navbar>
            </Styles>
        );
    }

}

export { NavigationBar }