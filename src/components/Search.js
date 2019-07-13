import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import { InstantSearch, connectHits, connectSearchBox  } from 'react-instantsearch-dom';

const searchClient = algoliasearch(
    '2X0VVQTWHD',
    'a6cff8012893a9999af7964ca7d0f948'
);

class Search extends React.Component{

    state={
        query:''
    };

    componentDidMount() {
        this.setState({query:this.props.match.params.query})
    }

    render(){

        const Hits = ({ hits }) => (
            <ol>
                {hits.map(hit => (

                    <li key={hit.objectID}>{hit.title}</li>

                ))}
            </ol>
        );

        const CustomHits = connectHits(Hits);

        const SearchBox = ({ currentRefinement, isSearchStalled, refine }) => (
            <form noValidate action="" role="search">
                <input
                    type="search"
                    value={currentRefinement}
                    onChange={event => {
                        refine(event.currentTarget.value)
                    }}
                />
                <button onClick={() => {
                    this.setState({query:''});
                    refine('')
                }}>Reset query</button>
                {isSearchStalled ? 'My search is stalled' : ''}
            </form>
        );

        const CustomSearchBox = connectSearchBox(SearchBox);

        return(
            <InstantSearch
                indexName="polls"
                searchClient={searchClient}
            >
                <CustomSearchBox defaultRefinement={this.state.query} autoFocus/>
                <CustomHits />
            </InstantSearch>
        )
    }
}

export default Search;