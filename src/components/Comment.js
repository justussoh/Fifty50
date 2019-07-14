import React from 'react';
import {firebaseApp} from '../utils/firebase';

import styled from 'styled-components';
import AvatarIcon from "./AvatarIcon";
import Button from 'react-bootstrap/Button'
import Avatar from "@material-ui/core/Avatar";
import ThumbUp from '@material-ui/icons/ThumbUp'
import Thumbdown from '@material-ui/icons/ThumbDown'


const Styles = styled.div`

  input, textarea {
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid #dedede;
    padding: 10px;
    border-radius:10px;
  }
  
  .vote-buttons{
    color: #B1B1B1;
  }
  
  .comment-label{
  
  }
  
  .avatar-icon{
    margin-right:10px;
  }
`;

class Comment extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: '',
            newComment: '',
            uid: '',
            loggedIn: (null !== firebaseApp.auth().currentUser),
            comments: [],
            pollId: this.props.pollId,
            selected: false,
        };

    }

    componentDidMount() {

        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                let currentuser = firebaseApp.auth().currentUser;
                this.setState({
                    uid: currentuser.uid,
                    username: currentuser.displayName,
                    loggedIn: true
                });
            } else {
                this.setState({loggedIn: false})
            }
        });

        this.pollRef = firebaseApp.database().ref(`comments/${this.state.pollId}`);
        this.pollRef.on('value', ((snapshot) => {
            const dbComment = snapshot.val();
            if (dbComment != null) {
                this.setState({comments: dbComment});
            };
        })).bind(this);
    }

    componentWillUnmount() {
        this.pollRef.off();
    }

    updateInput = event => {
        const {name, value} = event.target;
        this.setState({
            [name]: value,
        });
    };

    postComment = event => {
        event.preventDefault();
        const {username, newComment} = this.state;
        if (username.trim() === '' || newComment.trim() === '') return;

        const data = {
            name: username,
            text: newComment,
            votes: 0,
        };

        this.state.comments.unshift(data);

        firebaseApp.database().ref().child(`comments/${this.state.pollId}`).set(this.state.comments).then(() => {
            this.setState({newComment: ''});
        });

        this.setState({selected: false})

    };

    vote(id, num) {
        let {comments} = this.state;
        const comment = comments[id];
        comment.votes += num;
        firebaseApp.database().ref().child(`comments/${this.state.pollId}`).set(this.state.comments);
    }

    handleSelect = () => {
        this.setState({selected: true})
    };

    handleDeselect = () => {
        this.setState({selected: false})
    };


    render() {

        const {newComment} = this.state;
        let isAuthUser = firebaseApp.auth().currentUser ? true : false;

        let userComments = this.state.comments.map((comment, index) => {
            return (
                <div key={index}>
                    <div className='d-flex'>
                        <Avatar className='avatar-icon'>{comment.name.charAt(0).toUpperCase()}</Avatar>
                        <div style={{width:"100%"}}>
                            <span className="comment-user"><strong>{comment.name}</strong></span>
                            <br/>
                            <span className="comment-text">{comment.text}</span>
                            <br/>
                            <div className='d-flex'>
                                <ThumbUp  style={{marginRight:'5px'}} className="vote-buttons" onClick={() => this.vote(index, 1)}/>
                                <Thumbdown className="vote-buttons" onClick={() => this.vote(index, -1)}/>
                                <div className="ml-auto">Votes: {comment.votes}</div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });

        return (
            <Styles>
                <div>
                    <h6 className='comment-label'>{this.state.comments.length} Comments</h6>
                    <form onSubmit={this.postComment}>
                        <div className='d-flex'>
                            {isAuthUser ?
                                <AvatarIcon/> : ''
                            }
                            <textarea
                                className="comment"
                                name="newComment"
                                id="new-comment"
                                value={newComment}
                                onClick={this.handleSelect}
                                onChange={this.updateInput}
                                disabled={this.props.disable}
                                placeholder={isAuthUser ? 'Add a public Comment': 'Please Sign In!'}
                            />
                        </div>
                        {
                            this.state.selected ?
                                <div className='d-flex flex-row-reverse'>
                                    <Button style={{marginLeft: "10px"}} variant="outline-success"
                                            type="submit">Submit</Button>
                                    <Button variant="outline-danger" onClick={this.handleDeselect}>Cancel</Button>
                                </div>
                                : ''
                        }
                    </form>
                    {userComments}
                </div>
            </Styles>
        );
    }
}


export {Comment};