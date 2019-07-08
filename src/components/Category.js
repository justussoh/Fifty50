import React from 'react';
import {firebaseApp} from "../utils/firebase";
import Button from "@material-ui/core/Button";

import {Link} from "react-router-dom";
import Divider from "@material-ui/core/Divider";
import Loading from "./Loading";
import Paper from "@material-ui/core/Paper";


class Category extends React.Component {
    state = {
        loading: true,
        polls: [],
    };

    componentDidMount() {
        let cat = this.props.match.params.category;
        this.PollRef = firebaseApp.database().ref(`category/${cat}`);
        this.PollRef.once('value').then(snapshot => {
            if (!snapshot.hasChildren()) {
                if (this.mounted) {
                    this.setState({loading: false});
                }
            }
        });

        this.PollRef.on('child_added', ((newPollIdSnapshot) => {
            const pollId = newPollIdSnapshot.key;

            firebaseApp.database().ref(`polls/${pollId}/title`).once('value').then(snapshot => {
                const title = snapshot.val();

                const polls = this.state.polls;
                polls.push({title: title, id: pollId})

                if (this.mounted) {
                    this.setState({
                        polls: polls,
                        loading: false
                    });
                }
            });

        })).bind(this);

        this.mounted = true;
    }

    componentWillUnmount() {
        this.PollRef.off();
        this.mounted = false;
    }


    render() {

        let pollsUIs = this.state.polls.map((poll) => {
            return (
                <div key={poll.id}>
                    <Link to={`/polls/poll/${poll.id}`}>
                        <Button
                            children={poll.title}
                            style={{textAlign: 'left', width: '50%'}}
                        />
                    </Link>
                    <Divider/>

                </div>
            );
        });

        return (
            <div>
                <Paper>
                    <h2>{this.props.match.params.category}</h2>

                    {pollsUIs}

                    <Loading loading={this.state.loading}/>

                </Paper>
            </div>
        );
    }
}


export default Category;