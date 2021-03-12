import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import Clarifai from 'clarifai';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';

const app = new Clarifai.App({
  apiKey: '5c3b2d28107b422bb8a6140e7d7c70e3'
});

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin'
    };
  }

  onInputChange = (event)=> {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = ()=> {
    this.setState({imageUrl: this.state.input}, () =>{
      app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.imageUrl)
      .then(response => {
        const faceData = this.calculateFaceLocation(response);
        this.displayFaceBox(faceData);
      })
      .catch(err => {
        console.log('error: ', err);
      })
    });
  }

  calculateFaceLocation = (data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('face-reco-img');
    const width = image.width;
    const height = image.height;
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    };
  }

  displayFaceBox = (data) => {
    this.setState({box: data});
  }

  onRouteChange = (value) => {
    this.setState({route: value});
  }

  render(){
    return (
      <div className="App">
        <Navigation onRouteChange={ this.onRouteChange } route={ this.state.route } />
        { this.state.route === 'home' ? 
          < >
            <Logo />
            <Rank />
            <ImageLinkForm onInputChange={ this.onInputChange } onButtonSubmit={ this.onButtonSubmit } />
            <FaceRecognition box={ this.state.box } imageUrl={ this.state.imageUrl } />
          </ >
          : (this.state.route === 'signin' ? <SignIn onRouteChange={ this.onRouteChange } />  :
            <Register onRouteChange={ this.onRouteChange } />
          )
        }
      </div>
    );
  } 
}

export default App;
