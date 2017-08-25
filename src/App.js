import React, { Component } from 'react';
import logo from './logo.svg';
import '../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';
import SubmitForm from './components/SubmitForm';
import ValidatedInput from './components/ValidatedInput';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <p className="App-intro">
          <SubmitForm formName="Name" onSubmit={(e) => console.log(e)}>
            <ValidatedInput   labelText="Letter"
                              name="test"
                              maxLength="10"
                              labelClass="col-xs-4"
                              inputClass="col-xs-3 col-md-4" />
          </SubmitForm>
        </p>
      </div>
    );
  }
}

export default App;
