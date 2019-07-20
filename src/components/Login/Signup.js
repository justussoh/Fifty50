import React from 'react';
import {firebaseApp} from '../../utils/firebase';
import history from '../../history';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Avatar from '@material-ui/core/Avatar';
import Link from '@material-ui/core/Link';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';

class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            userid: '',
            password: '',
            emailError: '',
            useridError: '',
            useridExist: '',
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
        this.setState({email: e.target.value});
    }

    handleUserIdChange(e) {
        this.setState({userid: e.target.value});
        //console.log(Object.keys(this.state.useridExist));
    }

    handlePasswordChange(e) {
        this.setState({password: e.target.value});
    }

    FormIsInvalid() {
        let isInvalid = false;
        const regex = /[\.#\$\/\[\]]/;
        const userid = this.state.userid.trim();

        if (userid.length === 0) {
            this.setState({useridError: 'Username must no be empty.'});
            isInvalid = true;
        } else if (userid.match(regex)) {
            this.setState({useridError: `Username can't contain ".", "#", "$", "/", "[", or "]"`});
            isInvalid = true;
        } else if (Object.keys(this.state.useridExist).includes(userid)) {
            //console.log("Username Exist");
            this.setState({useridError: 'Username Already Taken'});
            isInvalid = true;
        } else {
            this.setState({userid: userid, useridError: ''});
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
                this.setState({passwordError: error.message, emailError: ''});
            } else {
                this.setState({emailError: error.message, passwordError: ''});
            }
            //console.log(error);
        });

        firebaseApp.auth().onAuthStateChanged(function (user) {
            if (user) {
                user.updateProfile({
                    displayName: userid
                }).then(function () {
                    // /var username = user.displayName;
                    //console.log(username)
                }).catch((error) => {
                    console.log(error)
                });
            }
        });

    }

    render() {
        return (
            <Container component="main" maxWidth="xs" className='d-flex align-items-center justify-content-center'
                       style={{minHeight: "80vh"}}>
                <div className='d-flex align-items-center justify-content-center flex-column'>
                    <Avatar style={{backgroundColor:"#e91e63"}}>
                        <LockOutlinedIcon/>
                    </Avatar>
                    <Typography component="h1" variant="h5" style={{marginBottom:"20px"}}>
                        Sign up
                    </Typography>
                    <form onSubmit={this.handleSubmit} noValidate>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="username"
                                    name="userName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="userName"
                                    label="Username"
                                    autoFocus
                                    value={this.state.userid}
                                    onChange={this.handleUserIdChange}
                                    error={Boolean(this.state.useridError)}
                                    helperText={this.state.useridError}
                                />
                            </Grid>
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
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    value={this.state.password}
                                    onChange={this.handlePasswordChange}
                                    type="password"
                                    error={Boolean(this.state.passwordError)}
                                    helperText={this.state.passwordError}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    Sign Up
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container justify="flex-end" style={{marginTop: "10px"}}>
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>
            </Container>
        );
    }
}


export default Signup;
