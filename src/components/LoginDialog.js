import React, { Component } from 'react';

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';

import history from '../history';

class LoginDialog extends Component {

    // Props: Close=Function to handle close, show=boolean to show modal// 

    handleLoginButton= ()=>{
        history.push(`/login`);
    }

    render() {

        return (
            <Dialog open={this.props.show} aria-labelledby="form-dialog-title">
                <DialogTitle id="alert-dialog-title"><div className='d-flex align-items-center'>
                    You need to login in order to answer question
                </div>
                </DialogTitle>
                <DialogActions>
                    <Button onClick={this.handleLoginButton} color="primary">
                        Login
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}

export default LoginDialog;