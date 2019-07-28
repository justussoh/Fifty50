import React from 'react';
import Avatar from '@material-ui/core/Avatar'
import {firebaseApp} from "../../utils/firebase";
import styled from "styled-components";


const Styles = styled.div`
    .avatar-icon{
        margin: 10px;
        color: white;
        background-color: #5baff5 !important;
    }
`;

class AvatarIcon extends React.Component {

    state = {
        displayName: '',
    }

    componentDidMount() {
        let user = firebaseApp.auth().currentUser;
        this.setState({displayName: user.displayName})
    }

    render() {
        return (
            <Styles>
                <Avatar className='avatar-icon'>{this.state.displayName.charAt(0).toUpperCase()}</Avatar>
            </Styles>
        );
    }
}

export default AvatarIcon;