import React, {Component} from 'react';
import styled from "styled-components";

const Styles = styled.div`
    .titleContainer{
        font-family:'Poppins', sans-serif;
           h1{
            font-size:150px;
            margin:0;
            line-height:1.1em;
        }
        position: relative;
        --maskX: 0;
        --maskY: 0;
        padding:50px 50px 0 50px;
        margin-top:10vh;
    }
    .titleWrapper{
        color:#f26f63;
        cursor:default;
    }
    .cloneWrapper{
        position:absolute;
        top:50px;
        left:50px;
        width: 100%;
        height: 100%;
        color:#5baff5;
        transition: all 0.8s cubic-bezier(0.165,0.84,0.44,1); 
        clip-path: polygon(0 0, calc(var(--maskX) * 1% + (var(--maskY) - 50) * .4%) 0, calc(var(--maskX) * 1% + (var(--maskY) - 50) * -.4%) 100%, 0 100%);
    }
    
`;

class Title extends Component {

    state = {
        x: 0,
        y: 0
    };

    _onMouseMove = (e) => {
        const width = this.refs.titleContainer.clientWidth;
        const height = this.refs.titleContainer.clientHeight;
        const oX = (e.nativeEvent.offsetX/width) * 100;
        const oY = (e.nativeEvent.offsetY/height) * 100;
        this.setState({
            x: oX,
            y: oY
        });
    };

    _onMouseOut = () => {
        this.setState({
            x: 0,
            y: 0
        });
    };

    render() {
        const {x, y} = this.state;
        const maskStyle = {
            '--maskX': x,
            '--maskY': y
        };

        return (
            <Styles>
                <div className='titleContainer'
                     onMouseMove={this._onMouseMove}
                     onMouseOut={this._onMouseOut}
                     ref="titleContainer"
                     style={maskStyle}>
                    <div className='titleWrapper'>
                        <h1>{this.props.text}</h1>
                    </div>
                    <div className='titleWrapper cloneWrapper'>
                        <h1>{this.props.text}</h1>
                    </div>
                </div>
            </Styles>
        );
    }

}

export default Title;