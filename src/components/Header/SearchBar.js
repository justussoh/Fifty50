import React from 'react';
import {firebaseApp} from "../../utils/firebase";
import {Typeahead, Highlighter} from 'react-bootstrap-typeahead';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead-bs4.css';
import styled from "styled-components";
import history from '../../history';

const Styles = styled.div`
  .round-search-bar .rbt-input-hint-container .form-control {
    border-radius: 500px;
    margin-right: 20px;
    }
`;


class SearchBar extends React.Component {

    state = {
        categories: [],
        categorySelected: '',
        searchBarQuery: '',
    };

    componentDidMount() {
        //Get Poll files
        this.pollRef = firebaseApp.database().ref();
        this.pollRef.on('value', ((snapshot) => {
            const db = snapshot.val();
            this.setState({categories: db.categoryList});
        })).bind(this);
    };

    componentWillUnmount() {
        this.pollRef.off();
    }

    handleSearchSelect = (selected) => {
        this.setState({
            categorySelected: selected[0]
        });
    };

    handleKeyDown = (e) => {
        if (e.keyCode === 13) {
            window.setTimeout(()=>{
                if(this.state.categories.includes(this.state.categorySelected)){
                    history.push(`/category/${this.state.categorySelected}`);
                }else{
                    window.open(`/search/${this.state.searchBarQuery}`,"_self");
                }
            },100)
        }
    };

    handleInputChange = (value) => {
        this.setState({
            searchBarQuery: value
        });
    };

    render() {

        const options = this.state.categories;

        return (
            <Styles>
                <div>
                    <Typeahead
                        id='appBarSearch'
                        className='round-search-bar'
                        options={options}
                        placeholder="Search"
                        maxResults={5}
                        paginate={false}
                        minLength={2}
                        onKeyDown={this.handleKeyDown}
                        onInputChange={this.handleInputChange}
                        onChange={(selected) => {
                            this.handleSearchSelect(selected)
                        }}

                    />
                </div>
            </Styles>
        );
    }


}

export default SearchBar;