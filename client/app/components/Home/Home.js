import React, { Component } from 'react';
import 'whatwg-fetch';
import {Button} from 'reactstrap';
import { setInStorage, getFromStorage, } from '../../utils/storage';

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      token: '',
      signUpError: '',
      signInError: '',
      signInEmail: '',
      signInPassword: '',
      signUpEmail: '',
      signUpPassword: '',
      UICError: '',
      UIC: '',
      helpline: false
    };
    this.onTextboxChangeSignInEmail = this.onTextboxChangeSignInEmail.bind(this);
    this.onTextboxChangeSignInPassword = this.onTextboxChangeSignInPassword.bind(this);
    this.onTextboxChangeUIC = this.onTextboxChangeUIC.bind(this);
    this.onTextboxChangeSignUpEmail = this.onTextboxChangeSignUpEmail.bind(this);
    this.onTextboxChangeSignUpPassword = this.onTextboxChangeSignUpPassword.bind(this);
    this.onSignUp = this.onSignUp.bind(this);
    this.onSignIn = this.onSignIn.bind(this);
    this.logout = this.logout.bind(this);
    this.forgot = () => {
      this.setState({
        helpline: true,
      });
    }
}

  onTextboxChangeSignInEmail(event) {
    this.setState({
      signInEmail: event.target.value,
    });
  }

  onTextboxChangeSignInPassword(event) {
    this.setState({
      signInPassword: event.target.value,
    });
  }

  onTextboxChangeSignUpEmail(event) {
    this.setState({
      signUpEmail: event.target.value,
    });
  }

  onTextboxChangeSignUpPassword(event) {
    this.setState({
      signUpPassword: event.target.value,
    });
  }

  onTextboxChangeUIC(event) {
    this.setState({
      UIC: event.target.value,
    });
  }

  onSignUp() {
    // Grab state
    const {
      UIC,
      signUpEmail,
      signUpPassword,
    } = this.state;
    if(UIC == '09061996'){
      this.setState({
        isLoading: true,
      });
    // Post request to backend
    fetch('/api/account/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        UniqueCode: UIC,
        email: signUpEmail,
        password: signUpPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          this.setState({
            signUpError: json.message,
            isLoading: false,
            signUpEmail: '',
            signUpPassword: '',
            UIC: '',
          });
        } else {
          this.setState({
            signUpError: json.message,
            isLoading: false,
          });
        }
      });
    } else{
      alert("Incorrect Unique Identifier Code");
    }
  }

  onSignIn() {
    // Grab state
    const {
      signInEmail,
      signInPassword,
    } = this.state;
    this.setState({
      isLoading: true,
    });
    
    // Post request to backend
    fetch('/api/account/signin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: signInEmail,
        password: signInPassword,
      }),
    }).then(res => res.json())
      .then(json => {
        console.log('json', json);
        if (json.success) {
          setInStorage('project_Yellowstone', { token: json.token });
          this.setState({
            signInError: json.message,
            isLoading: false,
            signInPassword: '',
            signInEmail: '',
            token: json.token,
          });
        } else {
          this.setState({
            signInError: json.message,
            isLoading: false,
          });
        }
      });
  }

  

  logout() {
    this.setState({
      isLoading: true,
    });
    const obj = getFromStorage('project_Yellowstone');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/logout?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            localStorage.removeItem('project_Yellowstone')
            this.setState({
              token: '',
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }
  reloadHome(event) {
    this.setState({ helpline: false});
  }

  componentDidMount() {
    const obj = getFromStorage('project_Yellowstone');
    if (obj && obj.token) {
      const { token } = obj;
      // Verify token
      fetch('/api/account/verify?token=' + token)
        .then(res => res.json())
        .then(json => {
          if (json.success) {
            this.setState({
              token,
              isLoading: false
            });
          } else {
            this.setState({
              isLoading: false,
            });
          }
        });
    } else {
      this.setState({
        isLoading: false,
      });
    }
  }

  renderRedirect(){
      console.log("redirect attempt");
      return <Redirect to='51.137.151.100:3000'/>
  }

  render() {
    const {
      helpline,
      isLoading,
      token,
      signInError,
      signInEmail,
      signInPassword,
      signUpEmail,
      signUpPassword,
      signUpError,
      UIC,
    } = this.state;
    if (isLoading) {
      return (<div><p>Loading...</p></div>);
    }
    if (helpline) {
      return (<div><p>Please call 0300 1236600</p><p><Button type="button" onClick={ this.reloadHome.bind(this) }>
      <span>Go Back</span>
    </Button></p></div>)
    }
    if (!token) {
      return (
        <div className="whole">
          <div>
            {
              (signInError) ? (
                <p>{signInError}</p>
              ) : (null)
            }
            <p>Sign In</p>
            <input
              type="email"
              placeholder="Email"
              value={signInEmail}
              onChange={this.onTextboxChangeSignInEmail}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={signInPassword}
              onChange={this.onTextboxChangeSignInPassword}
            />
            <br />
            <Button onClick={this.onSignIn}>Sign In</Button>
            <Button onClick={this.forgot}>Forgotten Password</Button>
          </div>
          <br />
          <br />
          <div>
            {
              (signUpError) ? (
                <p>{signUpError}</p>
              ) : (null)
            }

            <p>{helpline}</p>

            <p>Sign Up</p>
            <input
              type="password"
              placeholder="UIC"
              value={UIC}
              onChange={this.onTextboxChangeUIC}
            /><br />
            <input
              type="email"
              placeholder="Email"
              value={signUpEmail}
              onChange={this.onTextboxChangeSignUpEmail}
            /><br />
            <input
              type="password"
              placeholder="Password"
              value={signUpPassword}
              onChange={this.onTextboxChangeSignUpPassword}
            /><br />
            <Button onClick={this.onSignUp}>Sign Up</Button>
          </div>
       </div>
      );
    }
    return (
      <div>
        <h3> Access Granted. </h3>
        <form action="http://51.137.151.100:3000">
          <Button type="submit">Yellowstone</Button>
          <Button>Yosemite</Button>
          <Button>Sequoia</Button>
        </form>
        <Button onClick={this.logout}>Logout</Button>
      </div>
    );
  }
}

export default Home;
