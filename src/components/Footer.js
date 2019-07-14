import React from 'react';
import styled from 'styled-components';

import {Nav, Navbar} from 'react-bootstrap';

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

class Footer extends React.Component {

    render() {

        return (
            <Styles>
                <Navbar expand="lg" sticky='bottom'>
                    <Nav>
                        <Nav.Item><Nav.Link href="/">Home</Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link href="/about"> About </Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link href="/contact"> Contact </Nav.Link></Nav.Item>
                        <Nav.Item><Nav.Link href="/login"> Login </Nav.Link></Nav.Item>
                    </Nav>
                    <div className='ml-auto'>
                        <span>© Al Dante</span>
                    </div>
                </Navbar>
            </Styles>
        );
    }

}

export default Footer;