import React from 'react';
import {firebaseApp} from '../../utils/firebase';
import history from '../../history';
import {Button, FormControlLabel,Paper, Grid, TextField, Avatar, Typography, Checkbox } from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import { Link } from 'react-router-dom'
import Title from "../Home/Title";

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
        this.setState({email: e.target.value});
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    handleSubmit(e) {
        e.preventDefault();
        const email = this.state.email.trim();
        const password = this.state.password.trim();

        firebaseApp.auth().signInWithEmailAndPassword(email, password).then((user) => {
            history.push('/polls/dashboard');
        }).catch((error) => {

            if (error.code === 'auth/wrong-password') {
                this.setState({passwordError: error.message, emailError: ''});
            } else {
                this.setState({emailError: error.message, passwordError: ''});
            }

            //console.log(error);
        });
    }

    render() {
        return (
            <Grid container component="main" style={{minHeight:'80vh'}}>
                <Grid item xs={false} sm={4} md={7}>
                    <Title text='FIFTY50'/>
                </Grid>
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square>
                    <div>
                        <Avatar>
                            <LockOutlinedIcon/>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form onSubmit={this.handleSubmit} noValidate>
                            <TextField
                                type="email"
                                value={this.state.email}
                                onChange={this.handleEmailChange}
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                error={Boolean(this.state.emailError)}
                                helperText={this.state.emailError}
                            />
                            <TextField
                                variant="outlined"
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={this.state.password}
                                onChange={this.handlePasswordChange}
                                error={Boolean(this.state.passwordError)}
                                helperText={this.state.passwordError}
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary"/>}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                            >
                                Sign In
                            </Button>
                            <Grid container>
                                <Grid item xs>
                                    <Link href="/recover" variant="body2">
                                        Forgot password?
                                    </Link>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        {"Don't have an account? Sign Up"}
                                    </Link>
                                </Grid>
                            </Grid>
                        </form>
                    </div>
                </Grid>
            </Grid>
        );
    }
}


export {Loginpage};

