import React from 'react';
import { Paper, TextField, MenuItem} from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import NewSingleOption from './NewSingleOption';
import NewOpenEnded from "./NewOpenEnded"

const pollOptions = [
    {
      value: 'mcq',
      label: 'Fixed answers',
    },
    {
      value: 'open',
      label: 'Open ended answers',
    },
  ];

class NewPoll extends React.Component {

    state = {
        typePoll: 'mcq'
    }   

    render() {

        const handleChange = event => {
            this.setState({typePoll:event.target.value });
          };
        


        const showComponent = () => {
            switch (this.state.typePoll) {
                case 'mcq':
                    return <NewSingleOption />;
                case 'open':
                    return <NewOpenEnded />;
                default:
                    return <NewSingleOption />;
            }
        }
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

export default NewPoll