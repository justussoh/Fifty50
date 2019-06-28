import React from 'react';
import { firebaseApp } from '../utils/firebase';
import history from '../history';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';

class Signup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      userid: '',
      password: '',
      emailError: '',
      useridError: '',
      useridExist:'',
      passwordError: ''

    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUserIdChange = this.handleUserIdChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  componentWillMount() {
    this.pollRef = firebaseApp.database().ref();
    this.pollRef.once('value').then((snapshot) => {
      const id = snapshot.child(`user_ids`).val();
      //console.log(id);
      this.setState({useridExist: id});
    });
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handleUserIdChange(e) {
    this.setState({ userid: e.target.value });
    //console.log(Object.keys(this.state.useridExist));
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  FormIsInvalid() {
    let isInvalid = false;
    const regex = /[\.#\$\/\[\]]/;
    const userid = this.state.userid.trim();

    if (userid.length === 0) {
      this.setState({ useridError: 'Username must no be empty.' });
      isInvalid = true;
    } else if (userid.match(regex)) {
      this.setState({ useridError: `Username can't contain ".", "#", "$", "/", "[", or "]"` });
      isInvalid = true;
    } else if (Object.keys(this.state.useridExist).includes(userid)) {
      //console.log("Username Exist");
      this.setState({ useridError: 'Username Already Taken' });
      isInvalid = true;
    } else {
      this.setState({ userid: userid, useridError: '' });
    }

    return isInvalid;
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();
    const userid = this.state.userid.trim();

    if (this.FormIsInvalid()) {
      //console.log("Form is Invalid");
      return;
    } 

    firebaseApp.auth().createUserWithEmailAndPassword(email, password).then((user) => {
      firebaseApp.database().ref().child("user_ids").child(userid).set(email);
      history.push('/polls/dashboard');
    }).catch((error) => {
      if (error.code === 'auth/weak-password') {
        this.setState({ passwordError: error.message, emailError: '' });
      } else {
        this.setState({ emailError: error.message, passwordError: '' });
      }
      //console.log(error);
    });

    firebaseApp.auth().onAuthStateChanged(function(user) {
      if (user) {
        user.updateProfile( {
          displayName: userid
        }).then(function() {
          // /var username = user.displayName;
          //console.log(username)
        }).catch ((error) => {
          console.log(error)
        });     
      }
    });
  
  }

  render() {
    return (
      <div className="row">
        <div className="col-sm-12 text-xs-center">

          <Paper>
            <br /><br />
            <h2>Signup</h2>

            <form onSubmit={this.handleSubmit}>

            <TextField
                label="Username"
                value={this.state.userid}
                onChange={this.handleUserIdChange}
                error={this.state.useridError}
                helperText={this.state.useridError}
              />

              <br /><br />

              <TextField
                label="Email"
                value={this.state.email}
                type="email"
                onChange={this.handleEmailChange}
                error={this.state.emailError}
                helperText={this.state.emailError}
              />

              <br /><br />

              <TextField
                label="Password"
                value={this.state.password}
                onChange={this.handlePasswordChange}
                type="password"
                error={this.state.passwordError}
                helperText={this.state.passwordError}
              />

              <br /><br />
              <Button
                children="Signup"
                type="submit"
              />

            </form>
            <br /><br />
          </Paper>
        </div>
      </div>

    );
  }
}


export {Signup};
