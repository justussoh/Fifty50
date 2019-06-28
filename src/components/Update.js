import React from 'react';
import { firebaseApp } from '../utils/firebase';
import history from '../history';
import Loading from './Loading';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

class Update extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            title: '',
            options: [],
            originalCount: 0,
            loading: true
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleAddOption = this.handleAddOption.bind(this);
        this.formIsInvalid = this.formIsInvalid.bind(this);
    }

    componentWillMount() {

        this.pollRef = firebaseApp.database().ref(`polls/${this.props.match.params.pollId}`);
        this.pollRef.on('value', ((snapshot) => {
            const dbPoll = snapshot.val();

            const options = Object.keys(dbPoll).reduce((a, key) => {
                if (key !== 'title') {
                    a.push({ option: [key], optionError: '' }); //[key]is es6 computed property name
                }
                return a;
            }, []);

            //to start with a new option
            options.push({ option: '', optionError: '' });

            this.setState({ title: dbPoll.title, options: options, originalCount: options.length - 1, loading: false })
        })).bind(this);
    }

    componentWillUnmount() {
        this.pollRef.off();
    }

    handleOptionChange(i, e) {
        let options = this.state.options;
        options[i].option = e.target.value;
        this.setState({ options: options });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (this.formIsInvalid()) {
            return;
        }

        const newOptionsArray = this.state.options.reduce((a, op, i) => {
            if (i >= this.state.originalCount) {
                const key = op.option.trim();
                a.push(key);
            }
            return a;
        }, [])

        const updates = {};

        newOptionsArray.forEach(option => {
            updates[`polls/${this.props.match.params.pollId}/${option}`] = 0;
        });

        firebaseApp.database().ref().update(updates);

        history.push(`/polls/poll/${this.props.match.params.pollId}`);
    }

    handleAddOption() {
        let options = this.state.options;
        options.push({ option: '', optionError: '' });

        this.setState({ options: options });
    }

    render() {
        let options = this.state.options.map((option, i) => {
            return (
                <div key={i}>
                    <br />
                    <TextField
                        label={`Option ${i + 1}`}
                        value={this.state.options[i].option}
                        onChange={this.handleOptionChange.bind(this, i)}
                        error={this.state.options[i].optionError}
                        helperText={this.state.options[i].optionError}
                        disabled={i < this.state.originalCount ? true : false}
                        autoFocus={i === this.state.originalCount ? true : false} //focus on the new element for better user experience
                    />
                </div>
            );
        });

        return (
            <div className="row">
                <div className="col-sm-12 text-xs-center">

                    <Paper>
                        <br /><br />
                        <h2>{`Update "${this.state.title}"`}</h2>

                        <Loading loading={this.state.loading} />

                        <form onSubmit={this.handleSubmit}>

                            <TextField
                                label="Title"
                                value={this.state.title}
                                disabled={true}
                            />

                            {options}

                            <br />
                            <Fab color="primary" aria-label="Add" onClick={this.handleAddOption}>
                                    <AddIcon />
                            </Fab>

                            <br /><br />
                            <Button
                                variant="contained"
                                label="Create"
                                type="submit"
                                />
                        </form>
                        <br /><br />
                    </Paper>
                </div>
            </div>
        );
    }

    //firebase keys must be non-empty strings and can't contain ".", "#", "$", "/", "[", or "]"
    //option must not be named "title", TODO: better data structure in firebase
    //options must be different, firebase removes dups keys automatically
    //more robust validation is done firebase-side
    formIsInvalid() {

        let isInvalid = false;
        const regex = /[\.#\$\/\[\]]/;

        this.state.options.forEach((o, i) => {

            if (i >= this.state.originalCount) {
                let options = this.state.options;
                let thisOption = o.option.trim();

                if (thisOption.length === 0) {
                    options[i] = { option: thisOption, optionError: 'This option must not be empty.' }
                    this.setState({ options: options });
                    isInvalid = true;
                } else if (thisOption.match(regex)) {
                    options[i] = { option: thisOption, optionError: `Options can't contain ".", "#", "$", "/", "[", or "]"` }
                    this.setState({ options: options });
                    isInvalid = true;
                } else {

                    if (thisOption === 'title') { //can't have option with key "title"
                        thisOption = 'Title';
                    }

                    options[i] = { option: thisOption, optionError: '' }
                    this.setState({ options: options });
                }
            }

        });

        return isInvalid;
    }
}

export { Update };

