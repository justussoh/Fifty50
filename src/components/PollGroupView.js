import React from 'react';
import {firebaseApp} from '../utils/firebase';
import Loading from './Loading';
import history from '../history';

import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Chip from '@material-ui/core/Chip';

import PollShareDialog from './PollShareDialog';
import LoginDialog from './LoginDialog'
import ViewPoll from './ViewPoll'
import {Comment} from "./PollingForm";

const keyTypes = ['title', 'imgSrc', 'pollType', 'loginToAnswer', 'expire', 'categoryList'];

class PollGroupView extends React.Component {
    constructor(props) {
        super(props);

        //console.log(this.props.match.params.pollId)
        this.state = {
            title: '',
            loading: true,
            showShareDialog: false,
            loginToAnswer: false,
            expire: null,
            status: '',
            categories: [],
            polls:[],
            index:null,
        };

        this.formIsInvalid = this.formIsInvalid.bind(this);
    }

    componentWillMount() {
        this.pollRef = firebaseApp.database().ref(`pollgroup/${this.props.match.params.pollId}`);
        // console.log(this.pollRef)

        this.pollRef.on('value', ((snapshot) => {
                const dbPoll = snapshot.val();
                if (dbPoll.expire && dbPoll.expire.check) {
                    if (new Date().getTime() > new Date(dbPoll.expire.expireDate).getTime()) {
                        this.setState({voted: true, status: 'expired'})
                    }
                }

                const pollIdArray = Object.keys(dbPoll).reduce((a, key) => {
                    if (!keyTypes.includes(key)) {
                        a.push(key);
                    }
                    return a;
                }, []);

                if (dbPoll.categoryList && dbPoll.categoryList.length > 0) {
                    this.setState({categories: dbPoll.categoryList});
                }

                this.setState({
                    title: dbPoll.title,
                    loginToAnswer: dbPoll.loginToAnswer,
                    expire: dbPoll.expire,
                    polls: pollIdArray,
                    loading: false,
                })

            })
        ).bind(this);
    };

    componentWillUnmount() {
        this.pollRef.off();
    };

    handleShareModelClose = () => {
        this.setState({showShareDialog: false});
    };

    handleShareModelOpen = () => {
        this.setState({showShareDialog: true});
    };

    handlePollGroupStart = () => {
        this.setState({index: 0})
    };

    handlePollGroupNext = () =>{
        this.setState({index: this.state.index + 1})
    };

    handlePollGroupPrev = () =>{
        if (this.state.index=== 0) {
            this.setState({index: null})
        }else{
            this.setState({index: this.state.index -= 1})
        }
    };

    renderPoll = () =>{
        const maxCount =this.state.polls.length;
        switch (this.state.index) {
            case null:
                return  <Button variant='contained' onClick={this.handlePollGroupStart}>Start</Button>;
            case maxCount:
                return <h3>Finished</h3>;
            default:
                const viewpolls = this.state.polls.reduce((a, pollId)=>{
                    a.push(<ViewPoll polls={this.state.polls}
                              index={this.state.index}
                              pollId={pollId}
                              handleNext={this.handlePollGroupNext}
                              handlePrev={this.handlePollGroupPrev}/>);
                    return a;
                },[]);
                return viewpolls;

        }
    };

    renderTimer = () => {
        if (this.state.expire && this.state.expire.check) {
            if (this.state.status === 'expired') {
                return (
                    <h2>Poll has expired</h2>
                );
            } else {
                return (
                    <h2>Time
                        Remaining: {(new Date(this.state.expire.expireDate).getTime() - new Date().getTime()) / 60 / 1000} Minutes</h2>
                );
            }
        }
        return ''
    };

    handleChipClick = (cat) => {
        const query = cat.split(' ').join('%20');
        history.push(`/category/${query}`);
    };

    render() {

        let isAuthUser = firebaseApp.auth().currentUser ? true : false;

        let renderCategories = this.state.categories.map((cat, index) => {
            return (
                <Chip
                    key={index}
                    label={cat}
                    onClick={() => this.handleChipClick(cat)}
                    clickable
                />
            );
        });

        return (
            <div className="row">
                <div className="col-sm-12 text-xs-center">

                    <Snackbar
                        open={this.state.showSnackbar}
                        message="Thanks for your answering!"
                        autoHideDuration={4000}
                    />

                    <Paper>
                        <br/><br/>
                        <h2>{this.state.title}</h2>
                        <br/>
                        <Button variant="outlined" color="primary"
                                onClick={this.handleShareModelOpen}>Share</Button>
                        <br/>

                        {this.renderTimer()}

                        <Loading loading={this.state.loading}/>
                        <br/>
                        {this.renderPoll()}
                        <br/>
                        {this.state.categories.length > 0 ? <div>
                            <h4>Categories:</h4>
                            {renderCategories}
                        </div> : <h4> No Categories</h4>}
                        <br/>
                        <Comment pollId={this.props.match.params.pollId} disable={!isAuthUser}/>
                        <br/><br/>
                    </Paper>
                </div>
                <div>
                    <PollShareDialog
                        show={this.state.showShareDialog}
                        Close={this.handleShareModelClose}
                        url={`localhost:3000/pollgroup/view/${this.props.match.params.pollId}`}/>
                </div>
                <div>
                    <LoginDialog show={this.state.loginToAnswer && !isAuthUser}/>
                </div>

            </div>
        );

    }

    formIsInvalid() {

        let isInvalid = false;
        const regex = /[\.#\$\/\[\]]/;

        let newOption = this.state.newOption;
        let thisOption = newOption.option.trim();

        if (thisOption.length === 0) {
            this.setState({newOption: {option: thisOption, optionError: 'This option must not be empty.'}})
            isInvalid = true;
        } else if (thisOption.match(regex)) {
            this.setState({
                newOption: {
                    option: thisOption,
                    optionError: `Options can't contain ".", "#", "$", "/", "[", or "]"`
                }
            })
            isInvalid = true;
        } else {
            this.setState({newOption: {option: thisOption, optionError: ''}})
        }
        return isInvalid;
    }
}

export default PollGroupView;