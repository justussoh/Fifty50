import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export default (props) => (
    <div className="text-xs-center" style={props.loading ? {} : { display: 'none' }}>
        <br />
        <CircularProgress />
    </div>
);