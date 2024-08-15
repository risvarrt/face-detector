import React,{ Component } from 'react';
import Particles from 'react-particles-js';

import Navigation from './components/Navigation/Navigation'; 
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo'; 
import Rank from './components/Rank/Rank'; 
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import './App.css';




const particleOptions={
                        particles: {
                          number: {
                            value: 100,
                            density: {
                              enable:true,
                              value_area:900
                            }
                          }
                        }
                      }

const initialState = {
  input: '',
  imageUrl: '',
  box: {},
  route: 'SignIn',
  isSignedIn:false,
  user: {
    id: '',
    name: '',
    email: '',
    entries: 0,
    joined: ''
}
}
class App extends Component {
        constructor(){
          super();
          this.state ={
            input: '',
            imageUrl: '',
            box: {},
            route: 'SignIn',
            isSignedIn:false,
            user: {
              id: '',
              name: '',
              email: '',
              entries: 0,
              joined: ''
          }
          }
        }

        LoadUser = (data) => {
          this.setState({user: {
            id: data.id,
            name: data.name,
            email: data.email,
            entries: data.entries,
            joined: data.joined
        }})
        }
        
        // componentDidMount(){
        //   fetch('http://localhost:3000')
        //         .then(response => response.json())
        //         .then(console.log)
        // }

        calculateFaceLocation = (data) => {
          const clarifaiFace =  data.outputs[0].data.regions[0].region_info.bounding_box;
          const image = document.getElementById('inputimage');
          const width = Number(image.width);
          const height = Number(image.height);
          // console.log(width, height);
          return {
            leftCol: clarifaiFace.left_col * width,
            topRow: clarifaiFace.top_row * height,
            rightCol: width - (clarifaiFace.right_col * width),
            bottomRow: height - (clarifaiFace.bottom_row * height)
          }
        }

      displayFaceBox = (box) => {
        // console.log(box);
        this.setState({box: box});
      }
        onInputChange = (event) => {
          this.setState({input: event.target.value});
        }
        onButtonSubmit = () => {
          this.setState({imageUrl: this.state.input});
          fetch('https://hidden-bastion-22763.herokuapp.com/imageurl',{
                    method: 'post',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                    input: this.state.input
              })}
              )
              .then(response => response.json())
          .then(response => {
            if(response){
              fetch('https://hidden-bastion-22763.herokuapp.com/image',{
                    method: 'put',
                    headers: {'Content-Type':'application/json'},
                    body: JSON.stringify({
                    id:this.state.user.id
              })}
              )
              .then(response => response.json())
              .then(count => {
                this.setState(Object.assign(this.state.user, {entries: count})
                )
              })
              .catch(console.log)
            }
            this.displayFaceBox(this.calculateFaceLocation(response))
            })
          .catch(err => console.log(err));
        }

        onRouteChange = (route) => {
          if(route === 'signout'){
            this.setState(initialState)
          } else if(route === 'home'){
            this.setState({isSignedIn: true})
          }
          this.setState({route: route});
        }
        render(){
          const { isSignedIn, imageUrl, route, box } = this.state;
            return (
                <div className="App">
                <Particles className='particles' 
                        params={particleOptions}
                        />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
                {route === 'home'
                ? <div>
                  <Logo />
                  <Rank name={this.state.user.name} entries={this.state.user.entries}/>
                  <ImageLinkForm 
                  onButtonSubmit={this.onButtonSubmit}
                  onInputChange={this.onInputChange}/>
                  <FaceRecognition box={box} imageUrl={imageUrl}/>
                  </div>
                
                : (
                  route === 'SignIn'
                  ? <SignIn LoadUser={this.LoadUser} onRouteChange={this.onRouteChange}/>
                  : <Register LoadUser={this.LoadUser} onRouteChange={this.onRouteChange}/>
                )
                }          
                </div>
            );
          }
}

export default App;