import React from 'react';
import {Paper, TextField, MenuItem} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import NewSingleOption from './Polls/NewSingleOption';
import NewOpenEnded from "./Polls/NewOpenEnded"
import NewOpenEndedMcq from "./Polls/NewOpenEndedMcq";
import {firebaseApp} from "../utils/firebase";
import history from "../history";
import Loading from "./Loading";

const pollOptions = [
    {
        value: 'mcq',
        label: 'Fixed answers',
    },
    {
        value: 'open',
        label: 'Open ended answers',
    },
    {
        value: 'openmcq',
        label: 'Custom answers',
    },
];

class NewPollGroupPoll extends React.Component {

    state = {
        typePoll: 'mcq',
        loggedIn: false,
        loading:true,
    };

    componentDidMount() {
        firebaseApp.auth().onAuthStateChanged(user => {
            if (user) {
                let currentuser = firebaseApp.auth().currentUser;
                this.setState({
                    uid: currentuser.uid,
                    username: currentuser.displayName,
                    loggedIn: true,
                    loading:false
                });
            } else {
                this.setState({loggedIn: false, loading:false})
            }
        });
    }

    render() {
        const handleChange = event => {
            this.setState({typePoll: event.target.value});
        };

        const showComponent = () => {
            switch (this.state.typePoll) {
                case 'mcq':
                    return <NewSingleOption pollGroup={true} pollId={this.props.match.params.pollId}/>;
                case 'open':
                    return <NewOpenEnded pollGroup={true} pollId={this.props.match.params.pollId}/>;
                case 'openmcq':
                    return <NewOpenEndedMcq pollGroup={true} pollId={this.props.match.params.pollId}/>;
                default:
                    return <NewSingleOption pollGroup={true} pollId={this.props.match.params.pollId}/>;
            }
        };

        switch (this.state.loggedIn) {
            case null:
                return <div></div>;
            case true:
                return (
                    <div>
                        <Grid>
                            <TextField
                                id="standard-select-currency"
                                select
                                label="Select your poll type"
                                value={this.state.typePoll}
                                onChange={handleChange}
                                helperText="Choose the best poll type for you"
                                margin="normal"

                            >
                                {pollOptions.map(option => (
                                    <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                    </MenuItem>
                                ))}
                            </TextField>
                            {showComponent()}
                        </Grid>
                    </div>
                );
            default:
                return (<Loading loading={this.state.loading}/>)
                // window.setTimeout(() => history.push(`/`), 5000);
        }
    }
}

export default NewPollGroupPoll;