import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import muiButton from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: {
    padding: 16,
    color: 'red',
    '& p': {
      color: 'green',
      '& span': {
        color: 'blue'
      }
    }
  },
});

export const Home = () => (
    <div>
        <Typography variant="h1" component="h2" gutterBottom>
        Fifty50</Typography>
        <h5>GATHERING ANSWERS FOR YOU</h5>
        <Link to="/polls/new">
            <Fab
          		variant="extended"
          		size="medium"
		        color="secondary"
		        aria-label="Add"
	        >
          		Create new poll
        	</Fab>
        </Link>
    </div>
)