import React from 'react';
import { firebaseApp } from '../../utils/firebase';
import * as firebase from 'firebase';
import history from '../../history';

import Icon from '@mdi/react';
import { mdiFacebookBox, mdiGoogle } from '@mdi/js';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid'

import styled from 'styled-components';

const Styles = styled.div`
  .center{
    color:blue;
    text-align:center;
  }

    
`;

class Login extends React.Component {

  handleFacebook(e) {
    e.preventDefault();
    const provider = new firebase.auth.FacebookAuthProvider();
    firebaseApp.auth().signInWithPopup(provider).then((result) => {
      //console.log('Facebook login success');
      history.push('/polls/dashboard');
    }).catch((error) => {
      console.log(error);
    });
  }

  handleGoogle(e) {
    e.preventDefault();
    const provider = new firebase.auth.GoogleAuthProvider();
    firebaseApp.auth().signInWithPopup(provider).then((result) => {
      //console.log('Google login success');
      history.push('/polls/dashboard');
    }).catch((error) => {
      console.log(error);
    });
  }



  render() {
    return (
      <Styles>
        <div>
          <Grid container justify="center" alignItems="center">
            <Grid item xs={4}>

              <Paper>


                <br /><br />
                <h2 className='center'>Create and share polls, fast and easy. View results in real time!</h2>

                <br /><br />
                <Button
                  onClick={this.handleFacebook}>
                  <Icon path={mdiFacebookBox} size={1}/>
                  Login with Facebook
            </Button>

                <br /><br />
                <Button
                  onClick={this.handleGoogle}>
                  <Icon path={mdiGoogle} size={1} />
                  Login with Google
            </Button>

                <br /><br />
                <Button
                  href="/loginpage"
                  children="Login with Email"
                />
                <br /><br />
                <Button
                  href="/signup"
                  children="Sign Up"
                />
                <br /><br />
                <br /><br />

              </Paper>
            </Grid>
          </Grid>
        </div>
      </Styles>


    );
  }
}


export { Login };