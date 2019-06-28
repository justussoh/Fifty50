import React from 'react';
import { Link } from 'react-router-dom';
import { firebaseApp } from '../utils/firebase';


import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

import Loading from './Loading';

import Icon from '@mdi/react';
import { mdiTrashCan } from '@mdi/js';

class Dashboard extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            dialogOpen: false,
            loading: true,
            polls: [] //items like { id: 34324, title: 'sdf'}
        };

        this.poll2Delete = '';
        this.poll2DeleteTitle = ''

        this.handleClose = this.handleClose.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    componentWillMount() {
        //const uid = getLocalUserId();

        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) { //this can get called after componentWillUnmount, make sure its there to avoid errors

                const uid = user.uid;

                this.userPollsRef = firebaseApp.database().ref(`user-polls/${uid}`);

                //check if user has no polls to quit loading indicator
                this.userPollsRef.once('value').then(snapshot => {
                    if (!snapshot.hasChildren()) {
                        if (this.mounted) {
                            this.setState({ loading: false });
                        }
                    }
                });

                this.userPollsRef.on('child_added', ((newPollIdSnapshot) => {
                    const pollId = newPollIdSnapshot.key;

                    firebaseApp.database().ref(`polls/${pollId}/title`).once('value').then(snapshot => {
                        const title = snapshot.val();

                        const polls = this.state.polls;
                        polls.push({ title: title, id: pollId })

                        if (this.mounted) {
                            this.setState({
                                polls: polls,
                                loading: false
                            });
                        }
                    });

                })).bind(this);

                this.userPollsRef.on('child_removed', ((removedPollIdSnapshot) => {
                    const pollId = removedPollIdSnapshot.key;
                    const polls = this.state.polls.filter(poll => poll.id !== pollId);

                    if (this.mounted) {
                        this.setState({
                            polls: polls
                        });
                    }

                })).bind(this);
            }
        });

        this.mounted = true; //the callbacks above can be called after componentWillUnmount(), to avoid errors, check
    }

    componentWillUnmount() {
        this.userPollsRef.off();
        this.mounted = false;
    }

    handleOpen(pollId) {
        this.setState({ dialogOpen: true });
        this.poll2Delete = pollId;
        this.poll2DeleteTitle = this.state.polls.find(poll => poll.id === this.poll2Delete).title;
    }

    handleClose() {
        this.setState({ dialogOpen: false });
    }

    handleDelete() {
        // updating to null deletes
        const updates = {};
        updates[`/polls/${this.poll2Delete}`] = null;
        updates[`/user-polls/${firebaseApp.auth().currentUser.uid}/${this.poll2Delete}`] = null;

        firebaseApp.database().ref().update(updates);

        this.setState({ dialogOpen: false });
    }

    render() {

        let pollsUIs = this.state.polls.map((poll) => {
            return (
                <div key={poll.id} >

                    <Button
                        tooltip={<span>Delete</span>}
                        onClick={() => this.handleOpen(poll.id)}
                        children={<Icon path={ mdiTrashCan } size={1}/>}
                        />
                    <Link to={`/polls/poll/${poll.id}`}>
                        <Button
                            children={poll.title}
                            style={{ textAlign: 'left', width: '50%' }}
                            />
                    </Link>
                    <Divider />

                </div>
            );
        });

        return (
            <div className="row">
                <div className="col-sm-12 text-xs-center">

                    <Paper>

                        <br />
                        <h2>Your Polls</h2>
                        <br />

                        <Dialog
                            open={this.state.dialogOpen}
                            onClose={this.handleClose}
                            >
                                <DialogTitle>Delete "{this.poll2DeleteTitle}"?</DialogTitle>
                                <DialogActions>
                                    <Button children="Cancel" onClick={this.handleClose}/>
                                    <Button children="Delete" onClick={this.handleDelete}/>
                                </DialogActions>
                            
                        </Dialog>

                        <Link to="/polls/new">
                            <Button
                                children="New Poll"
                                />
                        </Link>
                        <br /><br />

                        {pollsUIs}

                        <Loading loading={this.state.loading} />

                        <br /><br />
                    </Paper>
                </div>
            </div>
        );
    }
}


export {Dashboard};
