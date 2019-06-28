import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'react-bootstrap';

export const Home = () => (
    <div>
        <h2>Hello Welcome</h2>
        <Link to="/polls/new">
            <Button variant="dark">New Poll</Button>
        </Link>
    </div>
)