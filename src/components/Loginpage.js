import React from 'react';
import { firebaseApp } from '../utils/firebase';
import history from '../history';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Loginpage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      emailError: '',
      passwordError: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handlePasswordChange(e) {
    this.setState({ password: e.target.value });
  }

  handleSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();
    const password = this.state.password.trim();

    firebaseApp.auth().signInWithEmailAndPassword(email, password).then((user) => {
      history.push('/polls/dashboard');
    }).catch((error) => {

      if (error.code === 'auth/wrong-password') {
        this.setState({ passwordError: error.message, emailError: '' });
      } else {
        this.setState({ emailError: error.message, passwordError: '' });
      }

      //console.log(error);
    });
  }

  render() {
    return (

      <div className="row">
        <div className="col-sm-12 text-xs-center">

          <Grid container justify = "center" alignItems = "center">
            <br /><br />
            <h2>Log in to Fifty50</h2>
          </Grid>  

          <Grid container justify = "center" alignItems = "center">
            <form onSubmit={this.handleSubmit}>

              <TextField
                label="Email"
                value={this.state.email}
                onChange={this.handleEmailChange}
                type="email"
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
                children="Log in"
                type="submit"
                />

            </form>
          </Grid>
          <Grid container justify = "center" alignItems = "center">
            <br />
              <Button 
                children="Forgot your password?"
                href = "/recover"
                />

            <br /><br />
          </Grid>  
        </div>
      </div>

    );
  }
}


export { Loginpage };

