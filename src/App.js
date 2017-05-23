import React from 'react';
// DEFAULT
import Header from './components/Header';
import Footer from './components/Footer';

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
