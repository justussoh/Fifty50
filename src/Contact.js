import React from 'react';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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
    	<Grid container direction = "column" alignItems = "center">
        <h1>    </h1>
        <h1>    </h1>
        <h1>    </h1>
        <h1>    </h1>      
        <Grid>
        <h2>We're here to help</h2>
       	</Grid>

       	<Grid container direction = "column" alignItems = "center">
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
	        rowsMax="20"
	        margin="normal"
	        variant="outlined"
	    />   

      <Button
        variant="outlined"
        label="Create"
        type="submit">
        Submit
      </Button>  
        <h1>    </h1>
        <h1>    </h1>
	    <h6>Our goal is to reply within the same day, but it</h6>
	    <h6>might take us until the next business day.</h6> 	
	    </Grid>

       	<Grid container direction = "column" alignItems = "center">
       	<h1>    </h1>
       	<h1>    </h1>
       	<h1>    </h1>
       	<h1>    </h1>
       	<h1>    </h1>
        <h6>EMAIL US</h6>
        <h6>support@fifty50.com</h6>

       	<h6>CALL US</h6>
       	<h6>+65 91234567</h6>
       	<h6>Monday - Friday: 11am - 5pm SGT</h6>
       	<h6>(excluding public holidays)</h6>
       	</Grid>
       	</Grid>
    </div>
)