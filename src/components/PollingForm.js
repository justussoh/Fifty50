import React from 'react';
import { firebaseApp } from '../utils/firebase';

import styled from 'styled-components';

const Styles = styled.div`
  .post {
    text-align: center;
  }

  label {
    display: block;
    margin-bottom: 10px;
    font-weight: bold;
  }

  input, textarea {
    width: 100%;
    margin-bottom: 20px;
    border: 1px solid #dedede;
    padding: 10px;
  }

  button {
    display: inline-block;
    height: 38px;
    padding: 0 30px;
    color: white;
    text-align: center;
    font-size: 11px;
    font-weight: 700;
    line-height: 38px;
    letter-spacing: .1rem;
    text-transform: uppercase;
    text-decoration: none;
    white-space: nowrap;
    border-radius: 2px;
    background-color: #331550;
    border: 1px solid #331550;
    cursor: pointer;
    box-sizing: border-box;
  }

  .comment {
    padding-top: 20px;
    padding-bottom: 20px;
    border-bottom: 1px solid #ccc;
  }

  .voting {
    display: flex;
    justify-content: space-between;
    align-content: center;
  }

  .upvote {
    background-color: #073525;
    border: 1px solid #073525;
    margin-right: 10px;
  }

  .downvote {
    background-color: #FF0026;
    border: 1px solid #FF0026;
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
        this.setState({ loggedIn: false })
      }
    });

    this.pollRef = firebaseApp.database().ref(`comments/${this.state.pollId}`);
    this.pollRef.on('value', ((snapshot) => {
      const dbComment = snapshot.val();
      console.log(dbComment)
      if (dbComment != null){
      this.setState({ comments: dbComment });
      };
    })).bind(this);
  }

  componentDidUpdate() {
    //console.log(this.state)
  }

  componentWillUnmount() {
    this.pollRef.off();
  }

  updateInput = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value,
    });
  };

  handleCommentChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
    console.log(this.state)
  };

  postComment = event => {
    event.preventDefault();
    const { username, newComment } = this.state;
    if (username.trim() === '' || newComment.trim() === '') return;

    const data = {
      name: username,
      text: newComment,
      votes: 0,
    };

    this.state.comments.unshift(data);

    firebaseApp.database().ref().child(`comments/${this.state.pollId}`).set(this.state.comments).then(() => {
      this.setState({ newComment: '' });
    });

    console.log('sucess');
  };

  vote(id, num) {
    let { comments } = this.state;
    const comment = comments[id];
    comment.votes += num;
    console.log(comment);

    firebaseApp.database().ref().child(`comments/${this.state.pollId}`).set(this.state.comments);
    
    return;
  }

  render() {
    const { newComment } = this.state;

    let userComments = this.state.comments.map((comment,index) => {
      return (
        <div key={index}>
          <h1 className="comment-user">{comment.name}</h1>
          <p className="comment-text">{comment.text}</p>
          <div className="voting">
            <div className="vote-buttons">
              <button className="upvote" onClick={() => this.vote(index, 1)}>
                Upvote
                </button>
              <button className="downvote" onClick={() => this.vote(index, -1)}>
                Downvote
                </button>
            </div>
            <div className="votes">Votes: {comment.votes}</div>
          </div>
        </div>
      );
    });

    return (
      <Styles>
        <div>
          <section className="comments-form">
            <form onSubmit={this.postComment}>
              <label htmlFor="new-comment">Comment:</label>
              <textarea
                className="comment"
                name="newComment"
                id="new-comment"
                value={newComment}
                onChange={this.updateInput}
                disabled={this.props.disable}
              />
              <button type="submit">Have your say</button>
            </form>
          </section>
          {userComments}
        </div>
      </Styles>
    );
  }
}


export { Comment };