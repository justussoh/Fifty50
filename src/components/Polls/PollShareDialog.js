import React, {Component} from 'react';

import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import InputGroup from 'react-bootstrap/InputGroup'
import ButtonB from 'react-bootstrap/Button'
import FormControl from 'react-bootstrap/FormControl'
import {CopyToClipboard} from 'react-copy-to-clipboard';
import styled from "styled-components";

const Styles = styled.div`

    .dialog-top{
        background-color: #49AE4B !important;
    }
    
    .share-modal-copy-title {
        font-family: 'Roboto medium';
        font-size: 14px;
        color: #707070;
    }
    
    .share-modal-copy{
        padding-top: 10px;
    }
    
    .share-modal-title{
        color: #fff;
        font-weight: bold;
        font-family: 'Roboto';
        font-size: 18px;
        margin-bottom: 0px !important;
    }
    
    .share-modal-content{
        padding: 25px 85px 5px 85px !important;
    }
    
    .closeButton{
        color:white;
    }
    
    .share-modal-message{
        margin-top:20px;
        font-family: 'Roboto';
        color: #707070;
        font-size: 14px;
    }
    
    .share-modal-email{
        margin-top: 25px;
    }
    
    .share-modal-bottom{
        padding: 20px 85px 26px 85px !important;
    }
    
     .MuiButton-outlined {
        padding: 8px 30px !important;
     }
     
     .share-modal-button{
        color: white;
        font-family: 'Roboto';
        font-weight: bold;
        background-color: #49AE4B;
        }
        
     .share-modal-button:hover{
        background-color: #7AC4A7;
      }

`;


class PollShareDialog extends Component {

    state = {
        copied: false,
        email: '',
        emailList: [],
        message: '',
    };

    handleEmailChange = (e) => {
        this.setState({email: e.target.value});
    };

    handleMessageChange = (e) => {
        this.setState({message: e.target.value});
    };

    handleEmailAdd = () => {
        this.state.emailList.push(this.state.email);
        this.setState({email: ''});
        console.log(this.state.emailList)
    };


    render() {

        return (

            <Dialog open={this.props.show} onClose={this.props.Close} maxWidth="sm" fullWidth={true}>
                <Styles>
                    <DialogTitle className='dialog-top'>
                        <div className='d-flex align-items-center'>
                            <p className='share-modal-title'>Share Poll!</p>
                            <IconButton aria-label="Close" className='closeButton ml-auto' onClick={this.props.Close}>
                                <CloseIcon/>
                            </IconButton>
                        </div>
                    </DialogTitle>
                    <DialogContent className='share-modal-content'>
                        <div className='share-modal-copy'>
                            <h6 className='share-modal-copy-title'>Send the link to your friends! </h6>
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
                        </div>
                        <div className='share-modal-email'>
                            <h6 className='share-modal-copy-title'>People</h6>
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
                            <FormControl placeholder='Add a note (Optimal)' value={this.state.message} as="textarea"
                                         rows="3" onChange={this.handleMessageChange} className='share-modal-message'/>
                        </div>
                    </DialogContent>
                    <DialogActions className='d-flex justify-content-center share-modal-bottom'>
                        <Button onClick={this.props.Close} variant="contained" size="large"
                                className='share-modal-button'>
                            Send
                        </Button>
                    </DialogActions>
                </Styles>
            </Dialog>

        );
    }

}

export default PollShareDialog;