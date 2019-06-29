import React from 'react';
import { Paper, TextField, MenuItem} from '@material-ui/core';

import NewSingleOption from './NewSingleOption';
import NewOpenEnded from "./NewOpenEnded"

const pollOptions = [
    {
      value: 'mcq',
      label: 'Select Options',
    },
    {
      value: 'open',
      label: 'Open-Ended',
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
                <Paper>
                    <TextField
                        id="standard-select-currency"
                        select
                        label="Select"
                        value={this.state.typePoll}
                        onChange={handleChange}
                        helperText="Please the type of poll"
                        margin="normal"

                    >
                        {pollOptions.map(option => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    {showComponent()}
            </Paper>
                
            </div>

        )
    }
}

export default NewPoll