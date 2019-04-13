import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import TextField from '@material-ui/core/TextField';
import { Button } from '@material-ui/core';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      filepath: '',
      password: ''
    }
  }

  getButtonState = () => {
    if ( this.state.filepath === '') return true;
    return false;
  }
  render() {
    return (
      <div className="App">
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <TextField
            disabled
            id="filePath"
            value={this.state.filepath}
            placeholder="File Path"
            margin="normal"
          />
          <div className="button-common">
            <Button
            variant="outlined"
            color="primary"
            className="button-common"
            >
            Select File
            </Button>
          </div>
          <div>
            
            <div className="combo-button">
              <Button
                variant="outlined"
                color="secondary" 
                className="button-common"
                disabled={this.getButtonState()}
              >
                Encrypt File
              </Button>
            </div>
            <div className="combo-button">
              <Button
                variant="outlined"
                color="secondary" 
                className="button-common"
                disabled={this.getButtonState()}
              >
                Decrypt File
              </Button>
            </div>
          </div>
          <a
            className="App-link"
            href="http://github.com/triplemzim"
            target="_blank"
            rel="noopener noreferrer"
          >
            Project link
          </a>
        </header>
      </div>
    );
  }
}

export default App;
