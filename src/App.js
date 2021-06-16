import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import './App.css';
import Modal from './components/Modal/Modal';
import Profile from './components/Profile/Profile';

class App extends Component {
  constructor(){
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      isSignedIn: false,
      isProfileOpen: false,
      route: 'signin',
      user: {
        id: '',
        name: '',
        email: '',
        password: '',
        entries: 0,
        joined: ''
      }
    };
  }

  componentDidMount(){
    const token = window.localStorage.getItem('token');
    if(token){
      console.log('token: ',token)
      fetch('http://localhost:3000/signin',{
        method: 'post',
        headers:{
          'Content-Type': 'application/json',
          'Authorization': token
        }
      })
      .then(resp => resp.json())
      .then(data => {
        console.log('data: ',data)
        if(data && data.id){
          fetch(`http://localhost:3000/profile/${data.id}`,{
            method: 'get',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': token
            }
          })
          .then(resp => resp.json())
          .then(resp =>{
            fetch(`http://localhost:3000/profile/${resp.id}`,{
              method: 'get',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': token
              }
            })
            .then(resp => resp.json())
            .then(user => {
              if(user && user.email){
                this.loadUser(user);
                this.onRouteChange('home');
              }
            })
            .catch(err => console.log(err))
          })
          .catch(err => console.log(err))
        }
      })
      .catch(err => console.log(err));
    }
  }

  loadUser = (data)=> {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      password: data.password,
      entries: data.entries,
      joined: data.joined
    }});
  }

  onInputChange = (event)=> {
    this.setState({input: event.target.value});
  }

  onButtonSubmit = ()=> {
    this.setState({imageUrl: this.state.input}, () =>{
      // fetch('https://guarded-chamber-46165.herokuapp.com/imageurl', {
      fetch('http://localhost:3000/imageurl', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          input: this.state.input
        })
      })
      .then(response => response.json())
      .then(response => {
        if(response){
          // fetch('https://guarded-chamber-46165.herokuapp.com/image', {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user, {entries: count}));
          });
        }
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

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({isSignedIn: false, box: {}, imageUrl: ''});
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  toggleModal = () => {
    this.setState(previousState => ({
      isProfileOpen: !previousState.isProfileOpen
    }));
  }

  render(){
    const { isSignedIn, isProfileOpen, imageUrl, route, box, user } = this.state;
    return (
      <div className="App">
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} toggleModal={this.toggleModal} />
        { isProfileOpen && 
          <Modal>
            <Profile isProfileOpen={isProfileOpen} 
              toggleModal={this.toggleModal} 
              user={user}
              loadUser={this.loadUser}>
              { 'hello world' }
            </Profile>
          </Modal>}
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
                name={this.state.user.name}
                entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             ['signin', 'signout'].includes(route)
             ? <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
             : <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
            )
        }
      </div>
    );
  } 
}

export default App;
