import React from 'react';
import {Router, Route, Switch} from 'react-router-dom';
import history from './history';

import {Home} from './Home';
import {About} from './About';
import {Contact} from './Contact';
import {NoMatch} from './NoMatch';
import NavigationBar from './components/Header/NavigationBar';
import {Comment} from './components/Polls/Comment';
import NewPoll from './components/Polls/NewPoll';
import Poll from './components/Polls/Poll';
import {Update} from './components/Update';
import {Login} from './components/Login/Login';
import {Loginpage} from './components/Login/Loginpage';
import {Signup} from './components/Signup';
import {Recover} from './components/Login/Recover';
import Dashboard from './components/Dashboard';
import Category from './components/Category';
import NewPollGroup from './components/PollGroup/NewPollGroup';
import NewPollGroupPoll from './components/PollGroup/NewPollGroupPoll';
import PollGroupView from './components/PollGroup/PollGroupView';
import Search from './components/Search';
import Footer from './components/Footer/Footer';

function App() {
    return (
        <React.Fragment>
            <NavigationBar/>
            <Router history={history}>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/about" component={About}/>
                    <Route exact path="/contact" component={Contact}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/loginpage" component={Loginpage}/>
                    <Route exact path="/recover" component={Recover}/>
                    <Route exact path="/signup" component={Signup}/>
                    <Route exact path="/polls/dashboard" component={Dashboard}/>
                    <Route exact path="/polls/new" component={NewPoll}/>
                    <Route exact path="/polls/poll/:pollId" component={Poll}/>
                    <Route path="/polls/update/:pollId" component={Update}/>
                    <Route exact path="/category/:category" component={Category}/>
                    <Route exact path="/pollgroup/new" component={NewPollGroup}/>
                    <Route exact path="/pollgroup/newpoll/:pollId" component={NewPollGroupPoll}/>
                    <Route exact path="/pollgroup/view/:pollId" component={PollGroupView}/>
                    <Route exact path="/search" component={Search}/>
                    <Route exact path="/search/:query" component={Search}/>
                    <Route exact path="/pollingform" component={Comment}/>
                    <Route component={NoMatch}/>
                </Switch>
            </Router>
            <Footer />
        </React.Fragment>
    );
}

export default App;
