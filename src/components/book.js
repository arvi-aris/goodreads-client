import React, { Component } from 'react';
import axios from 'axios';
//import {xmlParser} from 'xml2js';
const xmlParser = require('xml2js');
var Loader = require('react-loader');

class Book extends Component {

  constructor() {
    super();
    this.state = {
      bookName : '',
      isbn: '',
      noRecordsFound: false,
      loaded: false
    }
  }

  componentDidMount  = () => {
    this.searchBooks(this.props.match.params.name);
  }


  searchBooks = (bookName) => {
    //
    let url = `https://mysterious-dawn-20548.herokuapp.com/getBookReviews?bookName=${bookName}`;
    axios.get(url)
    .then((data) => {
      console.log(data);
      let xmlParser = new DOMParser();
      let xmlDoc = xmlParser.parseFromString(data.data.body,"text/xml");
      let isbn = xmlDoc.getElementsByTagName('isbn');
      isbn = isbn[0].textContent;
      console.log(isbn);
      this.setState({
        bookName: bookName,
        isbn: isbn,
        loaded: true
      })
    })
    .catch(e => console.log);
  }

  render() {
    let url = `https://www.goodreads.com/api/reviews_widget_iframe?did=31392&format=html&header_text=Goodreads+reviews+for+${this.state.bookName}&isbn=${this.state.isbn}&links=660&min_rating=&num_reviews=&review_back=ffffff&stars=000000&stylesheet=&text=444`
    return (
          <div>
          <Loader loaded={this.state.loaded}>
          <div> Reviews : {this.state.bookName} </div>
          {this.state.isbn && <div id="goodreads-widget">
            <iframe id="the_iframe" src={url} frameborder="0"></iframe>
            <div id="gr_footer">
              <a class="gr_branding" target="_blank" rel="nofollow" href="#">Reviews from Goodreads.com</a>
            </div>
          </div>}
          </Loader>
          </div>
    );
  }
}

export default Book;
