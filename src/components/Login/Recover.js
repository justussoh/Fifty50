import React from 'react';
import { firebaseApp } from '../../utils/firebase';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

class Recover extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailError: '',
      currentStep: 1
    };

    this.handleEmailSubmit = this.handleEmailSubmit.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
  }

  handleEmailChange(e) {
    this.setState({ email: e.target.value });
  }

  handleEmailSubmit(e) {
    e.preventDefault();
    const email = this.state.email.trim();

    firebaseApp.auth().sendPasswordResetEmail(email).then(() => {
      this.setState({ currentStep: 2 });
    }).catch((error) => {
      this.setState({ emailError: error.message });
      //console.log(error);
    });
  }

  render() {

    let step = (
      <form onSubmit={this.handleEmailSubmit}>

        <h2>We'll send you an email to reset your password.</h2>

        <TextField
          label="Email"
          value={this.state.email}
          onChange={this.handleEmailChange}
          error={this.state.emailError}
          helperText={this.state.emailError}
          />

        <br /><br />
        <Button
          children="Send Verification Email"
          type="submit"
          />

      </form>
    );

    if (this.state.currentStep === 2) {

      step = (
        <h2>Done! Follow the link in the email to change your password.</h2>
      );
    }

    return (
      <div className="row">
        <div className="col-sm-12 text-xs-center">
          <Grid>
            <br /><br />
            {step}
            <br /><br />
          </Grid>
        </div>
      </div>
    );
  }
}


export {Recover};

