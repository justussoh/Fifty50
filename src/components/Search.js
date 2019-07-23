import React from 'react';
import algoliasearch from 'algoliasearch/lite';
import {InstantSearch, connectHits, connectSearchBox} from 'react-instantsearch-dom';
import styled from "styled-components";
import LinesEllipsis from "react-lines-ellipsis";
import moment from "moment";
import Chip from "@material-ui/core/Chip";
import {Container, Row, Col, CardColumns, Card, InputGroup, FormControl, Button} from 'react-bootstrap';
import history from "../history";
import Paper from "@material-ui/core/Paper";


const searchClient = algoliasearch(
    '2X0VVQTWHD',
    'a6cff8012893a9999af7964ca7d0f948'
);

const Styles = styled.div`
    .card-content{
        padding: 20px 10px 10px 10px;
        
        &:hover{
            cursor: pointer;
        }
    }
    
    .card-cat{
        padding-top:10px;
    }  
    
    .card-poll:hover{
        -webkit-box-shadow: 0px 0px 25px 0px rgba(177,177,177,1);
        -moz-box-shadow: 0px 0px 25px 0px rgba(177,177,177,1);
        box-shadow: 0px 0px 25px 0px rgba(177,177,177,1);
    }
    
    .dashboard-row{
        margin-top:30px;
        margin-bottom:30px;
    }
    
     .dashboard-paper{
        padding-top:30px;
        padding-bottom:30px;
    }
      
  }`;

class Search extends React.Component {

    state = {
        query: ''
    };

    componentDidMount() {
        this.setState({query: this.props.match.params.query})
    }

    handlePollClick = (pollId) => {
        history.push(`/polls/poll/${pollId}`)
    };

    handleChipClick = (cat) => {
        const query = cat.split(' ').join('%20');
        history.push(`/category/${query}`);
    };

    render() {

        let renderType = (pollType) => {
            switch (pollType) {
                case 'mcq':
                    return (<Card.Subtitle>Fixed Answer Question</Card.Subtitle>);
                case 'open':
                    return (<Card.Subtitle>Open Ended Question</Card.Subtitle>);
                case 'openmcq':
                    return (<Card.Subtitle>Custom Question</Card.Subtitle>);
                default:
                    return (<Card.Subtitle>Unknown Question Type</Card.Subtitle>)
            }
        };

        const Hits = ({hits}) => (
            <CardColumns>
                {hits.map(hit => (
                    <Card key={hit.objectID} className='card-poll'>
                        <Card.Body>
                            <div onClick={() => this.handlePollClick(hit.objectID)}
                                 className='d-flex flex-column align-items-center card-content'>
                                <LinesEllipsis
                                    text={<h3 className='text-center'>{hit.title}</h3>}
                                    maxLine='3'
                                    ellipsis='...'
                                    trimRight
                                    basedOn='letters'
                                />
                                {renderType(hit.pollType)}
                                {hit.username !== '' ?
                                    <span>Created by {hit.username}, <span>{moment(hit.createAt).format("DD MMM YYYY")}</span></span>
                                    :
                                    <span>Created by <i>Anonymous</i>, <span>{moment(hit.createAt).format("DD MMM YYYY")}</span></span>}
                            </div>
                            <div>
                                {Boolean(hit.categoryList) ?
                                    <div className='card-cat'>
                                        <h6>Categories: </h6>
                                        {hit.categoryList.map((cat, catIndex) => {
                                            return (
                                                <Chip
                                                    key={catIndex}
                                                    label={cat}
                                                    onClick={() => this.handleChipClick(cat)}
                                                    clickable
                                                />
                                            );
                                        })}</div> : ''}
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </CardColumns>
        );

        const CustomHits = connectHits(Hits);

        const SearchBox = ({currentRefinement, isSearchStalled, refine}) => (
            <form noValidate action="" role="search">
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Search"
                        type="search"
                        value={currentRefinement}
                        onChange={event => {
                            refine(event.currentTarget.value)
                        }}
                    />
                    <InputGroup.Append>
                        <Button variant="outline-secondary" onClick={() => {
                            this.setState({query: ''});
                            refine('')
                        }}>Reset query</Button>
                    </InputGroup.Append>
                </InputGroup>
                {isSearchStalled ? 'My search is stalled' : ''}
            </form>
        );

        const CustomSearchBox = connectSearchBox(SearchBox);

        return (
            <Container fluid={true}>
                <Styles>
                    <Row className='dashboard-row'>
                        <Col xs={{span: 10, offset: 1}}>
                            <Paper elevation={0} className='dashboard-paper'>
                                <InstantSearch
                                    indexName="polls"
                                    searchClient={searchClient}
                                >
                                    <Row className='d-flex align-items-center justify-content-center' style={{marginBottom:20}}>
                                        <Col xs={6}>
                                            <CustomSearchBox defaultRefinement={this.state.query} autoFocus/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <CustomHits/>
                                    </Row>
                                </InstantSearch>
                            </Paper>
                        </Col>
                    </Row>
                </Styles>
            </Container>
        )
    }
}

export default Search;