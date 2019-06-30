import React from 'react';
import { firebaseApp } from '../utils/firebase';
import Loading from './Loading';
import history from '../history';

import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';

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
            newOption: { option: '', optionError: '' },
            originalCount: 0,
            imgSrc: null,
            pollType: null,
            voted: localStorage.getItem(this.props.match.params.pollId) ? true : false,
            showSnackbar: false,
            loading: true,
        };

        this.formIsInvalid = this.formIsInvalid.bind(this);
        this.handleAnswerOpen = this.handleAnswerOpen.bind(this);
        this.handleAnswerChange = this.handleAnswerChange.bind(this);
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

            if (dbPoll.pollType === 'open') {

                const options = Object.keys(dbPoll).reduce((a, key) => {
                    if (!keyTypes.includes(key)) {
                        a.push({ [key]: dbPoll[key] });
                    }
                    return a;
                }, []);

                if (options.length === 0) {
                    this.setState({ originalCount: 0 })
                } else {
                    this.setState({ originalCount: options.length - 1 })
                }

                this.setState({ title: dbPoll.title, options: options, imgSrc: dbPoll.imgSrc, pollType: dbPoll.pollType, loading: false })
            }
        })).bind(this);
    }

    componentWillUnmount() {
        this.pollRef.off();
    }

    componentDidUpdate() {
        console.log(this.state)
    }

    handleVote(option) {
        let currentCount = this.state.options.filter(o => {
            return o.hasOwnProperty(option);
        })[0][option];

        firebaseApp.database().ref().update({ [`polls/${this.props.match.params.pollId}/${option}`]: currentCount += 1 })
        localStorage.setItem(this.props.match.params.pollId, 'true');
        this.setState({ voted: true, showSnackbar: true });
    }

    handleAnswerChange(e) {
        this.setState({ newOption: { option: e.target.value, optionError: '' } });
    }

    handleAnswerOpen(e) {
        e.preventDefault();

        if (this.formIsInvalid()) {
            console.log('Invalid Answer')
            return;
        }

        const newOption = this.state.newOption.option;

        if (this.state.options.filter(o => {
            return o.hasOwnProperty(newOption);
        }).length > 0) {
            console.log('hello')
            let currentCount = this.state.options.filter(o => {
                return o.hasOwnProperty(newOption);
            })[0][newOption];

            firebaseApp.database().ref().update({ [`polls/${this.props.match.params.pollId}/${newOption}`]: currentCount += 1 })
            localStorage.setItem(this.props.match.params.pollId, 'true');
            this.setState({ voted: true, showSnackbar: true });
        }
        else {

            const updates = {}

            updates[`polls/${this.props.match.params.pollId}/${newOption}`] = 1;

            firebaseApp.database().ref().update(updates);
            localStorage.setItem(this.props.match.params.pollId, 'true');
            this.setState({ voted: true, showSnackbar: true });
        }
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

        switch (this.state.pollType) {
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
            case 'open':
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
                                
                                {this.state.voted ? <h2>Already Answer</h2> :
                                    <form onSubmit={this.handleAnswerOpen}>
                                        <TextField
                                            label="Your Answer Here"
                                            value={this.state.newOption.option}
                                            onChange={this.handleAnswerChange}
                                            error={this.state.newOption.optionError}
                                            helperText={this.state.newOption.optionError}
                                            disabled={this.state.voted}
                                        />
                                        <Button variant='outlined' type='submit'>Submit</Button>
                                    </form>}

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

    formIsInvalid() {

        let isInvalid = false;
        const regex = /[\.#\$\/\[\]]/;

        let newOption = this.state.newOption;
        let thisOption = newOption.option.trim();

        if (thisOption.length === 0) {
            this.setState({ newOption: { option: thisOption, optionError: 'This option must not be empty.' } })
            isInvalid = true;
        } else if (thisOption.match(regex)) {
            this.setState({ newOption: { option: thisOption, optionError: `Options can't contain ".", "#", "$", "/", "[", or "]"` } })
            isInvalid = true;
        } else {
            this.setState({ newOption: { option: thisOption, optionError: '' } })
        }
        return isInvalid;
    }
}

export { Poll };