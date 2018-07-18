import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Search from './search.js';
import Book from './book.js';

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {
		};
	}
	render() {
		return(
			<div><main>
		    <Switch>
		      <Route exact path='/' component={Search}/>
		      <Route exact path='/book/:name' component={Book}/>
		      <Route path="*" component={Search} />
		    </Switch>
		  </main></div>
		);
	}
}

export default Main;