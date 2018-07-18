import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router'
var Loader = require('react-loader');

class Home extends Component {

  constructor() {
    super();
    this.state = {
      searchTerm : '',
      searchResults: [],
      noRecordsFound: false,
      redirect: false,
      loaded: true
    }
  }

  updateValue = (event) => {
    this.setState({
      searchTerm : event.target.value
    });
  }

  clearSearch = () => {
    this.setState({
      searchTerm : '',
      searchResults : [],
      noRecordsFound : false
    })
  }

  searchBooks = () => {
    this.setState({
      loaded: false
    });
    let bookName = this.state.searchTerm;
    let url = `https://mysterious-dawn-20548.herokuapp.com/getBooks?bookName=${bookName}`;
    axios.get(url)
    .then((data) => {
      let xmlParser = new DOMParser();
      let xmlDoc = xmlParser.parseFromString(data.data.body,"text/xml");
      let searchResults = xmlDoc.getElementsByTagName('best_book');
      searchResults = Array.prototype.slice.call(searchResults);
      searchResults = searchResults.map(book => {
        let tempObj = {
          title: book.getElementsByTagName('title')[0].textContent,
          author: book.getElementsByTagName('author')[0].textContent.split(/\n/).filter(content => {
            if(content.trim()) {
              return true; 
            }
          })[1].trim(),
          image: book.getElementsByTagName('image_url')[0].textContent,
        };
        return tempObj;
      });
      this.setState({
        searchResults: searchResults,
        loaded: true
      })
    })
    .catch(e => console.log);
  }

  seeBookReviews = (bookName) => {
    this.setState({
      redirect: 'book/'+bookName
    });
  }

  searchThis = (event) => {
    this.setState({
      searchTerm: event.target.textContent
    }, () => {
      this.searchBooks();
    });
  }

  render() {
    if (this.state.redirect) {
     return <Redirect to={'/'+this.state.redirect} />;
    }
    return (
      <div className="home">
        <div className="grid-container">
          <div className="grid-item grid-input">
            <input className="search-input" placeholder="Search with book name or author name (Eg. Harry potter)" value={this.state.searchTerm} onChange={this.updateValue}/>
          </div>
          <div className="grid-item grid-button">
            <button type="button" onClick={this.searchBooks}> Search </button>
            <button type="button" onClick={this.clearSearch}> Clear </button>
          </div>
        </div>
        <div>
        {this.state.searchResults.length === 0 && <div className="list-grid-container">
          <div className="grid-item">
            <li onClick={this.searchThis}> Harry potter </li>
            <li onClick={this.searchThis}> Game of thrones </li>
            <li onClick={this.searchThis}> Neil gaiman </li>
          </div>
          <div className="grid-item">
            <li onClick={this.searchThis}> Percy jackson </li>
            <li onClick={this.searchThis}> American gods </li>
            <li onClick={this.searchThis}> Cassandra clare </li>
          </div>
          <div className="grid-item">
            <li onClick={this.searchThis}> Kane chronicles </li>
            <li onClick={this.searchThis}> John green </li>
          </div>
        </div>}
          <Loader loaded={this.state.loaded}>
          {this.state.searchResults.length > 0 && <table>
            <thead>
              <tr>
                <td> No. </td>
                <td> Image </td>
                <td> Title </td>
                <td> Author </td>
              </tr>
            </thead>
            <tbody>
              {this.state.searchResults.map((book, index) => {
                return (<tr key={index}>
                           <td> {index+1} </td> 
                           <td> <img src={book.image} /> </td> 
                           <td className="clickable" onClick={this.seeBookReviews.bind(this, book.title)}> {book.title} </td>
                           <td className="clickable"> {book.author} </td>
                        </tr>)
              })}
            </tbody>
          </table>}
          {this.state.noRecordsFound && <p className="noRec"> No records found.... </p>}
          </Loader>
        </div>
      </div>
    );
  }
}

export default Home;
