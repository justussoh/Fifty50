import React from 'react';
import {firebaseApp} from '../../utils/firebase';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

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
        this.setState({email: e.target.value});
    }

    handleEmailSubmit(e) {
        e.preventDefault();
        const email = this.state.email.trim();

        firebaseApp.auth().sendPasswordResetEmail(email).then(() => {
            this.setState({currentStep: 2});
        }).catch((error) => {
            this.setState({emailError: error.message});
            //console.log(error);
        });
    }

    render() {

        let step = (
            <div className='d-flex align-items-center justify-content-center flex-column'>
                <Avatar style={{backgroundColor: "#e91e63"}}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5" style={{marginBottom: "20px", marginTop: "20px"}}
                            className='text-center'>
                    We'll send you an email to reset your password.
                </Typography>
                <form onSubmit={this.handleEmailSubmit} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={this.state.email}
                                type="email"
                                onChange={this.handleEmailChange}
                                error={Boolean(this.state.emailError)}
                                helperText={this.state.emailError}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Send Verification Email
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );

        if (this.state.currentStep === 2) {

            step = (
                <Typography component="h1" variant="h5" style={{marginBottom: "20px", marginTop: "20px"}}
                            className='text-center'>
                    Done! Follow the link in the email to change your password.
                </Typography>
            );
        }

        return (
            <Container component="main" maxWidth="xs" className='d-flex align-items-center justify-content-center'
                       style={{minHeight: "80vh"}}>
                {step}
            </Container>
        );
    }
}


export default Recover;

