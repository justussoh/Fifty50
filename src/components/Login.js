import React from 'react';
import { firebaseApp } from '../utils/firebase';
import * as firebase from 'firebase'; 
import history from '../history';

import Icon from '@mdi/react';
import {  mdiFacebookBox, mdiGoogle } from '@mdi/js';

import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

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
      <div className="row">
        <div className="col-sm-12 text-xs-center">

          <Paper>
          

            <br /><br />
            <h2>Create and share polls, fast and easy. View results in real time!</h2>

            <br /><br />
            <Button
              onClick={this.handleFacebook}>
              <Icon path={mdiFacebookBox} size={1}/> 
              Login with Facebook
            </Button>
            
            <br /><br />
            <Button
              onClick={this.handleGoogle}>
                   <Icon path = {mdiGoogle} size={1}/>
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

        </div>
      </div>

    );
  }
}


export { Login };