import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import muiButton from '@material-ui/core/Button';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';

const Styles = styled.div`
  .blueColour{
    color:blue;
    text-align:center;
  }`;

export const Home = () => (
    <div>
      <Grid container justify = "center" alignItems = "center">
        <Typography variant="h1" component="h2" gutterBottom className='blueColour'>
        Fifty50</Typography>
      </Grid>  
      <Grid container justify = "center" alignItems = "center">
        <h5>GATHERING ANSWERS FOR YOU</h5>
      </Grid>
      <Grid container justify = "center" alignItems = "center">
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
      </Grid>  
    </div>
)