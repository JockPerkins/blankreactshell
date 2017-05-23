import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom';
import HeaderStore from '../stores/HeaderStore';
import HeaderActions from '../actions/HeaderActions';

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = HeaderStore.getState();
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    HeaderStore.listen(this.onChange);
  }

  componentWillUnmount() {
    HeaderStore.unlisten(this.onChange);
  }

  onChange(state) {
    this.setState(state);
  }


  render() {
    return (
      <div id="header" className="clearfix">
        <div className="container">
          <ul className="menu">
            <li>Menu</li>
            <li>Here</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default Header;
