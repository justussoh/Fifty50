import React, { Component } from 'react';

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import Divider from '@material-ui/core/Divider';
import InputGroup from 'react-bootstrap/InputGroup'
import ButtonB from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import { CopyToClipboard } from 'react-copy-to-clipboard';

class PollShareDialog extends Component {

    state = {
        copied: false,
        email: '',
        emailList: [],
        message: '',
    };

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value });
    }

    handleMessageChange = (e) => {
        this.setState({ message: e.target.value });
    }

    handleEmailAdd = () => {
        this.state.emailList.push(this.state.email);
        this.setState({ email: '' })
        console.log(this.state.emailList)
    }


    render() {

        return (
            <Dialog open={this.props.show} onClose={this.props.Close} maxWidth="sm" fullWidth={true}>
                <DialogTitle id="alert-dialog-title"><div className='d-flex align-items-center'>
                    <IconButton aria-label="Close" className='closeButton ml-auto' onClick={this.props.Close}>
                        <CloseIcon />
                    </IconButton>
                </div></DialogTitle>
                <DialogContent>
                        Send the link to your friends!
                         <InputGroup>
                            <FormControl
                                value={this.props.url}
                                disabled={true}
                            />
                            <InputGroup.Append>
                                <CopyToClipboard text={this.props.url}
                                    onCopy={this.props.copied}>
                                    <ButtonB variant="outline-secondary">Copy</ButtonB>
                                </CopyToClipboard>
                            </InputGroup.Append>
                        </InputGroup>
                        <br />
                        <Divider />
                        <br />
                        <InputGroup>
                            <FormControl
                                placeholder='Please Enter Email Address'
                                value={this.state.email}
                                onChange={this.handleEmailChange}
                            />
                            <InputGroup.Append>
                                <ButtonB onClick={this.handleEmailAdd} variant="outline-secondary">+</ButtonB>
                            </InputGroup.Append>
                        </InputGroup>
                        <FormControl placeholder='Add a note (Optimal)' value={this.state.message} as="textarea" rows="3" onChange={this.handleMessageChange} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.props.Close} color="primary">
                        Send
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

}

export default PollShareDialog;