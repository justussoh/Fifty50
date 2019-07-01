import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 200,
  },
  dense: {
    marginTop: 19,
  },
  menu: {
    width: 200,
  },
}));


export const Contact = () => (
    <div>
    	<Grid container direction = "row">
        <Grid>
        <h2>We're here to help</h2>
       	</Grid>

       	<Grid container direction = "column">
		<TextField
	        id="standard-dense"
	        label="Name"
	        margin="dense"
	        variant="outlined"
      	/>       	   	
		<TextField
	        id="standard-dense"
	        label="Email"
	        margin="dense"
	        variant="outlined"
      	/>    
		<TextField
	        id="standard-dense"
	        label="Subject"
	        margin="dense"
	        variant="outlined"
      	/>  
		<TextField
	        id="outlined-multiline-flexible"
	        label="Message"
	        multiline
	        rowsMax="4"
	        margin="normal"
	        variant="outlined"
	    />     
	    <h5>Our goal is to reply within the same day, but it</h5>
	    <h5>might take us until the next business day.</h5> 	
	    </Grid>

       	<Grid container direction = "column">
       	<h1>    </h1>
       	<h1>    </h1>
       	<h1>    </h1>
       	<h1>    </h1>
       	<h1>    </h1>
        <h5>EMAIL US</h5>
        <h5>support@fifty50.com</h5>

       	<h5>CALL US</h5>
       	<h5>+65 91234567</h5>
       	<h5>Monday - Friday: 11am - 5pm SGT</h5>
       	<h5>(excluding public holidays)</h5>
       	</Grid>
       	</Grid>
    </div>
)