import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch-dom';

const searchClient = algoliasearch(
    '2X0VVQTWHD',
    'a6cff8012893a9999af7964ca7d0f948'
);

class Search extends React.Component{
    render(){
        return(
            <InstantSearch
                indexName="polls"
                searchClient={searchClient}
            >
                <SearchBox />
                <Hits />
            </InstantSearch>
        )
    }
}

export default Search;