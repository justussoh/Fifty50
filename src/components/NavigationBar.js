import React from 'react';
import {firebaseApp} from '../utils/firebase';
import history from '../history';
import styled from 'styled-components';

import {Nav, Navbar} from 'react-bootstrap';
import AvatarIcon from "./AvatarIcon";
import Dropdown from 'react-bootstrap/Dropdown';
import SearchBar from "./SearchBar";
import Button from 'react-bootstrap/Button'

const Styles = styled.div`
    .Navbar{
        background-color: #222;
    }
    
    .navbar{
        box-shadow: 0px 3px 6px 0px rgba(0,0,0,0.16);
        z-index:1;
    }

    .Navbar-brand, .Navbar-nav .nav-link {
        color: #bbb;

        &:hover {
            color: white;
        }
    }
    
    .logout-btn{
        font-size: 14px;
        font-family: Roboto;
        font-weight: bold;
    }
    
    .avatar-dropdown{
        padding-bottom: 0px!important;
    }
`;

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            loggedIn: (null !== firebaseApp.auth().currentUser), //currentUser is null when not loggedin
            hover: false,
            user:null,
        };
    }

    componentWillMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            this.setState({
                loggedIn: (null !== user), //user is null when not loggedin
                user: user
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
        this.setState({hover: !this.state.hover})
    };

    renderNav = () => {
        switch (this.state.loggedIn) {
            case null:
                return <div></div>;
            case true:
                return (
                    <Nav className="ml-auto d-flex align-items-center">
                        <SearchBar/>
                        <Dropdown as={Nav.Item} show={this.state.hover} onClick={this.handleAvatarMenuToggle}
                                  alignRight={true}>
                            <Dropdown.Toggle as={AvatarIcon}/>
                            <Dropdown.Menu alignRight className='avatar-dropdown'>
                                <Dropdown.Header style={{marginBottom: '4px', marginTop: '4px'}}>
                                    <div className='d-flex align-items-center'>
                                        <AvatarIcon/>
                                        <div className='d-flex flex-column'>
                                            <strong>{this.state.user.displayName}</strong>
                                            {this.state.user.email}
                                        </div>
                                    </div>
                                </Dropdown.Header>
                                {/*<Dropdown.Item as={NavLink} href="#" onClick={(e) => {*/}
                                {/*    this.props.history.push('/');*/}
                                {/*}} className='header-avatar-icon-nav-link'>Home</Dropdown.Item>*/}
                                <Dropdown.Divider style={{marginBottom: '0px'}}/>
                                <Dropdown.Header>
                                    <div className='d-flex'>
                                        <Button onClick={this.handleLogout}
                                                variant="secondary"
                                                className="ml-auto logout-btn"
                                        >Sign Out
                                        </Button>
                                    </div>
                                </Dropdown.Header>
                            </Dropdown.Menu>
                        </Dropdown>
                    </Nav>
                );
            default:
                return (
                    <Nav className="ml-auto">
                        <Nav.Item><Nav.Link href="/login"> Login </Nav.Link></Nav.Item>
                        <Nav.Item><SearchBar/></Nav.Item>
                    </Nav>
                );
        }
    };

    render() {

        return (
            <Styles>
                <Navbar expand="lg">
                    <Navbar.Brand href='/'>Fifty50</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav"/>
                    <Navbar.Collapse id="basic-navbar-nav">
                        {this.renderNav()}
                    </Navbar.Collapse>
                </Navbar>
            </Styles>
        );
    }

}

export default NavigationBar;