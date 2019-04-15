import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { Button, LinearProgress } from '@material-ui/core';
import PropTypes from 'prop-types';

const inputStyle = {
  display: 'none'
}

const root = {
  display: 'block'
}

let progressVal = 0;
let lastProgress = 0;
let content = null;

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      fileName: '',
      password: '',
      progressState: 0
    }
    this.fileinputRef = React.createRef();
    this.downloadButtonRef = React.createRef();
    window.setInterval(()=>{
      this.checkProgress();
    },250);
  }

  checkProgress = () => {
    if(progressVal !== lastProgress){
      lastProgress = progressVal;
      if(lastProgress !== 100) {
        this.downloadButtonRef.current.style.display = 'none';
      }
      this.setState({
        progressState: lastProgress
      });
    }
  }

  getButtonState = () => {
    if ( this.state.fileName === '') return true;
    return false;
  }

  onClickFileSelect = () => {
   this.fileinputRef.current.click();
  }

  fileSelected = () => {
    progressVal = 0;
    debugger;
    let fullPath = this.fileinputRef.current.value;
    if(fullPath === undefined) alert("Empty File! Please try again.");
    let startIndex = (fullPath.indexOf('\\') >= 0 ? fullPath.lastIndexOf('\\') : fullPath.lastIndexOf('/'));
    let filename = fullPath.substring(startIndex);
    if (filename.indexOf('\\') === 0 || filename.indexOf('/') === 0) {
        filename = filename.substring(1);
    }
    this.setState({
      fileName: filename,
      progressState: 0
    });
  }

  encrypt = () => {
    progressVal = 0;

    let password = prompt("Please enter secret key!", "");
    let key = 1;
    for(let i = 0; i < password.length; i++){
      key = key + password.charCodeAt(i); 
    }
    while(key < 500) {
      key = key + key;
    }

    // alert(this.fileinputRef.current.files[0].size);
    let reader = new FileReader();
    let useFile = this.fileinputRef.current.files[0];
    reader.readAsArrayBuffer(useFile);
    
    reader.onload = (e) => {
      let byteArray = new Uint8Array(reader.result);

      byteArray.reverse();
      let k;

      for(let i = key; i < byteArray.length; i += key){
        k = byteArray[i];
        byteArray[i] = byteArray[i-key];
        byteArray[i-key] = k; 
        progressVal = parseInt((i / byteArray.length) * 100);       
      }

      let output = new Blob([byteArray], {type: 'video/zim'});
      content = output;
      window.location = (URL.createObjectURL(output));
    }

    // reader.onprogress = (data) => {
    //   if(data.lengthComputable){
    //     progressVal = parseInt(((data.loaded/data.length) * 100), 10)
    //   }
    // }

  }

  decrypt = () => {
    progressVal = 0;

    let password = prompt("Please enter secret key!", "");
    let key = 1;
    for(let i = 0; i < password.length; i++){
      key = key + password.charCodeAt(i); 
    }
    while(key < 500) {
      key = key + key;
    }

    let reader = new FileReader();
    let useFile = this.fileinputRef.current.files[0];
    reader.readAsArrayBuffer(useFile);
    
    reader.onload = (e) => {
      let byteArray = new Uint8Array(reader.result);

      let k;

      for(let i = byteArray.length - (byteArray.length%key); i >= 0; i -= key){
        k = byteArray[i];
        byteArray[i] = byteArray[i-key];
        byteArray[i-key] = k;  
        progressVal = parseInt(((byteArray.length - i) / byteArray.length ) * 100);      
      }
      byteArray.reverse();

      let output = new Blob([byteArray], {type: 'video/mkv'});
      window.location = URL.createObjectURL(output);
    }

  }

  onClickDownload = () => {
    window.location = URL.createObjectURL(content);
  }

  getDownloadStatus = () => {
    if(lastProgress === 100) return inputStyle;
    return root;
  }


  render() {
    return (
      <div className="App">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
        <p class="title">Offline Encrypter: Encrypt/Decrypt files with password!</p>
        <h5>Please remember to set file extension after decrypting.</h5>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <TextField
            disabled
            id="filePath"
            value={this.state.fileName}
            placeholder="File Path"
            margin="normal"
          />
          <div className="button-common">
            <Button
            variant="outlined"
            color="primary"
            className="button-common"
            onClick={this.onClickFileSelect}
            >
            Select File
            </Button>
          </div>
          <input id="file-input" ref={this.fileinputRef} type="file" style={inputStyle} onChange={this.fileSelected}/>
          <div className="progressbar">
            <LinearProgress color="primary" variant="determinate" value={this.state.progressState } />
          </div>
          <div>
            
            <div className="combo-button">
              <Button
                variant="outlined"
                color="secondary" 
                className="button-common"
                onClick={this.encrypt}
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
                onClick={this.decrypt}
                disabled={this.getButtonState()}
              >
                Decrypt File
              </Button>
            </div>
          </div>
          
          <a
            className="App-link"
            href="http://github.com/triplemzim/encrypter"
            target="_blank"
            rel="noopener noreferrer"
          >
            Project link
          </a>
        </header>
        <footer>
          <a
          className="Footer"
          href="https://www.linkedin.com/in/md-muhim-muktadir-khan-997956115"
          target="_blank"
          rel="noopener noreferrer">
            Fun Tool by Md Muhim Muktadir Khan
          </a>          
        </footer>
      </div>
    );
  }
}

export default App;
