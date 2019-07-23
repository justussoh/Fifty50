import React from 'react';
import {Link} from 'react-router-dom';
import Fab from '@material-ui/core/Fab';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';
import Title from './components/Home/Title';

const Styles = styled.div`
    .section{
        height:80vh;
    }
`;

class Home extends React.Component {
    render() {
        return (
            <Styles>
                <div className="section">
                    <Grid container className='d-flex align-items-center justify-content-center flex-column'>
                        <Grid item xs={12}>
                            <Title text='FIFTY50'/>
                        </Grid>
                        <Grid item xs={12}>
                            <h5>GATHERING ANSWERS FOR YOU</h5>
                        </Grid>
                        <Grid item xs={12}>
                            <Link to="/polls/new">
                                <Fab
                                    variant="extended"
                                    size="medium"
                                    color="secondary"
                                    aria-label="Add"
                                    background-color="#5baff5"
                                >
                                    Create new poll
                                </Fab>
                            </Link>
                        </Grid>
                    </Grid>
                </div>
            </Styles>
        );
    }
}

export default Home;

