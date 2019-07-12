import React from 'react';
import { Paper, TextField, MenuItem} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import NewSingleOption from './NewSingleOption';
import NewOpenEnded from "./NewOpenEnded"
import NewOpenEndedMcq from "./NewOpenEndedMcq";
import {firebaseApp} from "../utils/firebase";
import history from "../history";

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
        typePoll: 'mcq'
    };

    render() {
        let isAuthUser = firebaseApp.auth().currentUser ? true : false;
        const handleChange = event => {
            this.setState({typePoll:event.target.value });
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

        switch (isAuthUser){
            case null:
                return <div></div>
            case false:
                history.push(`/`);
            default:
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

                )
        }
    }
}

export default NewPollGroupPoll;