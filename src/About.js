import React from 'react';
import Grid from '@material-ui/core/Grid';
import styled from 'styled-components';


const Styles = styled.div`
    .section{
        height:80vh;
        padding: 8vh 30vw;
    }
`;

class About extends React.Component {
    render() {
        return (
            <Styles>
                <div className="section">
                    <Grid container className='d-flex flex-column align-items-center justify-content-center'
                          style={{marginBottom: "5vh"}}>
                        <Grid item xs={12}>
                            <h2 className='text-center'>About</h2>
                        </Grid>
                        <Grid item xs={10} style={{marginBottom: "5vh", marginTop:'3vh'}}>
                            <div className='d-flex align-items-center justify-content-center'>
                                <div>
                                    <h3 className='text-center'>Justus</h3>
                                    <p className='text-center'>Mostly work on the backend and functionality of the application</p>
                                </div>
                                <div style={{marginLeft:"5vw"}}>
                                    <h3 className='text-center'>Clara</h3>
                                    <p className='text-center'>Worked on the frontend and design of the application</p>
                                </div>
                            </div>
                        </Grid>
                        <Grid item xs={12}>
                            <h3>Fifty50</h3>
                            <p>Fifty50 was created to help people make better and wiser decisions
                                base on the wisdom from the internet. We hope that Fifty50 will aid
                                everyone in their decision making or help quickly gather responses
                                to their questions.</p>
                            <p>You can check out our project <a href='https://github.com/justussoh/Fifity50'>here</a></p>
                        </Grid>
                    </Grid>
                </div>
            </Styles>
        );
    }
}

export default About;