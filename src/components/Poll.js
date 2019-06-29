import React from 'react';
import { firebaseApp } from '../utils/firebase';
import Loading from './Loading';

import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';

import { Chart } from 'react-google-charts';

import { Comment } from '../components/PollingForm'

const keyTypes = ['title', 'imgSrc', 'pollType']

class Poll extends React.Component {
    constructor(props) {
        super(props);

        //console.log(this.props.match.params.pollId)
        this.state = {
            title: '',
            options: [],
            imgSrc: null,
            voted: localStorage.getItem(this.props.match.params.pollId) ? true : false,
            showSnackbar: false,
            loading: true
        };
    }

    componentWillMount() {
        this.pollRef = firebaseApp.database().ref(`polls/${this.props.match.params.pollId}`);
        console.log(this.pollRef)
        this.pollRef.on('value', ((snapshot) => {
            const dbPoll = snapshot.val();
            if (dbPoll.pollType === 'mcq') {
                const options = Object.keys(dbPoll).reduce((a, key) => {
                    if (!keyTypes.includes(key)) {
                        a.push({ [key]: dbPoll[key] });
                    }
                    return a;
                }, []);

                this.setState({ title: dbPoll.title, options: options, imgSrc: dbPoll.imgSrc, pollType: dbPoll.pollType, loading: false })
            }

            if(dbPoll.pollType === 'open'){
                this.setState({ title: dbPoll.title, imgSrc: dbPoll.imgSrc, pollType: dbPoll.pollType, loading: false })
            }
        })).bind(this);
    }

    componentWillUnmount() {
        this.pollRef.off();
    }

    handleVote(option) {
        let currentCount = this.state.options.filter(o => {
            return o.hasOwnProperty(option);
        })[0][option];

        firebaseApp.database().ref().update({ [`polls/${this.props.match.params.pollId}/${option}`]: currentCount += 1 })
        localStorage.setItem(this.props.match.params.pollId, 'true');
        this.setState({ voted: true, showSnackbar: true });
    }

    render() {

        const data = this.state.options.map(option => {
            return [Object.keys(option)[0], option[Object.keys(option)[0]]];
        });
        data.unshift(['option', 'votes']);

        let isAuthUser = firebaseApp.auth().currentUser ? true : false;

        let addOptionUI;
        if (isAuthUser) {
            addOptionUI = (
                <div>
                    <a href={`/polls/update/${this.props.match.params.pollId}`} >
                        <Button variant='contained'>
                            update
                        </ Button>
                    </a>
                </div>
            );
        }

        let optionsUI = this.state.options.map(option => {
            return (
                <div key={Object.keys(option)[0]}>
                    <Button
                        children={Object.keys(option)[0]}
                        onClick={() => this.handleVote(Object.keys(option)[0])}
                        disabled={this.state.voted}
                        variant='contained'
                    />
                    <br /><br />
                </div>
            );
        });

        switch (this.state.pollType){
            case 'mcq':
                    return (
                        <div className="row">
                            <div className="col-sm-12 text-xs-center">
            
                                <Snackbar
                                    open={this.state.showSnackbar}
                                    message="Thanks for your vote!"
                                    autoHideDuration={4000}
                                />
            
                                <Paper>
                                    <br /><br />
                                    <h2>{this.state.title}</h2>
                                    <br />
            
                                    {this.state.imgSrc !== null ?
                                        <div>
                                            <img src={this.state.imgSrc} alt='User Uploaded' />
                                        </div> : ''}
            
                                    <Loading loading={this.state.loading} />
            
                                    {optionsUI}
            
                                    {addOptionUI}
            
                                    <br />
                                    <Chart
                                        chartTitle="DonutChart"
                                        chartType="PieChart"
                                        width="100%"
                                        data={data}
                                        options={{ is3D: 'true' }}
                                    />
            
                                    <br /><br />
            
                                    <Comment pollId={this.props.match.params.pollId} />
            
                                </Paper>
                            </div>
                        </div>
                        );
            default:
                return (<h1>Unknown Poll Type</h1>);
        }
             
    }
}

export { Poll };