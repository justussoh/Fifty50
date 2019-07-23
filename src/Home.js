import React from 'react';
import {Link} from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import Typography from '@material-ui/core/Typography';
import {makeStyles} from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';

import Title from './components/Home/Title';

const Styles = styled.div`

`;

export const Home = () => (
    <Styles>
        <div>
            <Grid container justify="center" alignItems="center">
                <Title text='FIFTY50'/>
            </Grid>
            <Grid container justify="center" alignItems="center">
                <h5>GATHERING ANSWERS FOR YOU</h5>
            </Grid>
            <Grid container justify="center" alignItems="center">
                <Link to="/polls/new">
                    <Fab
                        variant="extended"
                        size="medium"
                        color="primary"
                        background-color="#5baff5"
                        aria-label="Add"
                    >
                        Create new poll
                    </Fab>
                </Link>
            </Grid>
        </div>
    </Styles>
)