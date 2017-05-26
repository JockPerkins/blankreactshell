const React = require('react');
// DEFAULT
const Header = require('./components/Header');
const Footer = require('./components/Footer');

class App extends React.Component {
  render() {
    var displayContent = (
      <div>
        <Header history={this.props.history} />
        {this.props.children}
        <Footer />
      </div>
    );

    return displayContent;
  }
}

export default App;
