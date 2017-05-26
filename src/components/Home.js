import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import HomeStore from '../stores/HomeStore';
import HomeActions from '../actions/HomeActions';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = HomeStore.getState();
    this.onChange = this.onChange.bind(this);
    this.getNewsStories();
  }

  componentDidMount() {
    HomeStore.listen(this.onChange);
  }

  componentWillUnmount() {
    HomeStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }

  getNewsStories(){
    HomeActions.getNewsStories();
  }

  render() {
    if(this.state.newsstories){
      var newsList = [];
      var newsStories = this.state.newsstories;

      for(var index = 0; index < newsStories.length; index++){
        newsList.push(
          <li>{newsStories[index].Title}</li>
        )
      }
    }
    return (
      <div id="home">
        <div className="container">
          <div className="main-content">
            <h1>This is a shell</h1>
            <ul>
              {newsList}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
