import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import './App.css';
import jwtDecode from 'jwt-decode';
import { Provider } from 'react-redux';
import store from './redux/store';
import axios from 'axios';

//Components
import Navbar from './components/Navbar.js';
import AuthRoute from './components/AuthRoute.js';

//Pages
import home from './pages/home.js';
import login from './pages/login.js';
import signup from './pages/signup.js';
import user from './pages/user.js';

import { SET_AUTHENTICATED } from './redux/types';
import { logoutUser, getUserData } from './redux/actions/userActions';
 const token = localStorage.FBIdToken;

if(token){
  const decodedToken = jwtDecode(token);
  if(decodedToken.exp * 1000 < Date.now()){
    store.dispatch(logoutUser());
  } else {
    console.log("hii");   
    store.dispatch({ type: SET_AUTHENTICATED });
    axios.defaults.headers.common['Authorization'] = token;
    store.dispatch(getUserData());
  }
}

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#86b25f',
      main: '#689f38',
      dark: '#486f27',
      contrastText: '#fff'
    },
    secondary: {
      light: '#df6843',
      main: '#d84315',
      dark: '#972e0e',
      contrastText: '#fff'
    }
  }
});

function App() {
  return (
    <Provider store={store}>
    <ThemeProvider theme={theme}>
      <div className="App">
      <Router>
          <Navbar />
            <div className="container">
              <Switch>
                <Route 
                  exact path="/" 
                  component={home} 
                />
                {/* <Route 
                  exact path="/login" 
                  component={login} 
                />
                <Route 
                  exact path="/signup" 
                  component={signup} 
                /> */}
                <AuthRoute 
                  exact path="/login" 
                  component={login} 
                />
                <AuthRoute 
                  exact path="/signup" 
                  component={signup} 
                />
                <Route 
                  exact
                  path="/users/:handle"
                  component={user}
                />
                <Route 
                  exact
                  path="/users/:handle/post/:postId"
                  component={user}
                />
              </Switch>
            </div>
      </Router>
    </div>
    </ThemeProvider>
    </Provider>
  );
}

export default App;
