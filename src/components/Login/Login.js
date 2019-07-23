import React from 'react';
import {firebaseApp} from '../../utils/firebase';
import * as firebase from 'firebase';
import history from '../../history';
import {Button, FormControlLabel, Paper, Grid, TextField, Avatar, Typography, Checkbox, Link} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Title from "../Home/Title";
import Icon from '@mdi/react';
import {mdiFacebookBox, mdiGoogle} from '@mdi/js';
import styled from "styled-components";

const Styles = styled.div`
    .line{
        border: 1px solid #b1b1b1;
        width: 40%;
        margin: auto;
        margin-top: 5%;
        margin-bottom: 5%;
    }
    
    .font{
        font-family:Roboto;
        font-weight:bold;
        color:#b1b1b1;
    }
`;

class Login extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            emailError: '',
            passwordError: '',
            rememberMe: false,
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
    }

    componentDidMount() {
        if (localStorage.getItem("checked") && localStorage.getItem("checked") !== "") {
            this.setState({
                email: localStorage.getItem("email"),
                password: localStorage.getItem("password"),
                rememberMe: true,
            });
        }
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
            if (this.state.rememberMe) {
                localStorage.setItem("checked", "checked");
                localStorage.setItem("email", this.state.email);
                localStorage.setItem("password", this.state.password);
            } else {
                localStorage.setItem("checked", "");
            }
            history.push('/polls/dashboard');
        }).catch((error) => {

            if (error.code === 'auth/wrong-password') {
                this.setState({passwordError: error.message, emailError: ''});
            } else {
                this.setState({emailError: error.message, passwordError: ''});
            }

            //console.log(error);
        });
    };

    handleRememberMeChange = (e) => {
        this.setState({rememberMe: e.target.checked})
    };

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
                <Grid container component="main" style={{minHeight: '80vh'}} direction="row"
                      justify="center"
                      alignItems="stretch"
                >
                    <Grid item xs={false} sm={4} md={7}
                          className='d-flex align-items-center justify-content-center flex-column'>
                        <Title text='FIFTY50'/>
                        {/*<h4>Log in to unlock all the features</h4>*/}
                    </Grid>
                    <Grid item xs={12} sm={8} md={5} component={Paper} elevation={0} square
                          style={{padding: "30px 70px"}} className='d-flex align-items-center justify-content-center'>
                        <div className='d-flex align-items-center justify-content-center flex-column'>
                            <Avatar style={{backgroundColor: "#e91e63"}}>
                                <LockOutlinedIcon/>
                            </Avatar>
                            <Typography component="h1" variant="h5" style={{marginTop: "10px"}}>
                                Sign in
                            </Typography>
                            <Grid container style={{margin: '20px 0'}} className='d-flex align-items-center justify-content-center'
                            >
                                <Grid item xs={6} className='d-flex align-items-center justify-content-center'>
                                    <Button
                                        variant="outlined"
                                        onClick={this.handleFacebook}>
                                        <span><Icon path={mdiFacebookBox} size={1}/> Facebook</span>
                                    </Button>
                                </Grid >
                                <Grid item xs={6} className='d-flex align-items-center justify-content-center'>
                                    <Button
                                        variant="outlined"
                                        onClick={this.handleGoogle}>
                                        <span><Icon path={mdiGoogle} size={1}/> Google</span>
                                    </Button>
                                </Grid>
                            </Grid>
                            <div className='d-flex flex-row align-items-center justify-content-center w-75'>
                                <hr className='line'/>
                                <span style={{margin: '0 5px'}} className='font'>OR</span>
                                <hr className='line'/>
                            </div>
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
                                    control={<Checkbox value="remember" onChange={this.handleRememberMeChange}
                                                       checked={this.state.rememberMe} color="primary"/>}
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
                                <Grid container style={{marginTop: "10px"}}>
                                    <Grid item xs>
                                        <Link href="/recover" variant="body2">
                                            Forgot password?
                                        </Link>
                                    </Grid>
                                    <Grid item>
                                        <Link href="/signup" variant="body2">
                                            {"Don't have an account? Sign Up"}
                                        </Link>
                                    </Grid>
                                </Grid>
                            </form>
                        </div>
                    </Grid>
                </Grid>
            </Styles>
        );
    }
}


export default Login;

