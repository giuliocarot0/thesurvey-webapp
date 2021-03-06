import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {useState, useEffect} from 'react';

import SurveyNavbar from './components/Navbar';
import SurveyHome from './components/SurveyHome'
import SurveyEditor from './components/SurveyEditor'
import SurveyDashboard from './components/SurveyDashboard'
import ResultReader from './components/ResultReader';
import SurveyCompiler from './components/SurveyCompiler';
import Login from './components/Login'
import {Container} from 'react-bootstrap'
import './components/components.css'
import API from './API'
import LoadingComponent from './components/LoadingComponent';

require('bootstrap')
function App() {

  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)
  
  const logoutHandler = ()=>{
    API.logout().then()
    setLoggedIn(false);
  }
  const loginHandler = (u)=>{
    setLoggedIn(u)
  }

  useEffect(()=>{
    setLoading(true)
    API.getUserInfo().then((u)=>{
      setLoggedIn(u)
      setLoading(false)
    }).catch(e =>{      
      setLoading(false)
      setLoggedIn(false)
    })
  }, [])

  return ( 
      
      <>
      <Router>
        <SurveyNavbar loggedIn={loggedIn} onLogout={logoutHandler}></SurveyNavbar>
        <Container fluid className="thebodyofsurvey">
          {loading ?
          <>
            <LoadingComponent></LoadingComponent>
          </> 
          :
          <>
          <Switch>
            <Route  exact path="/login"><Login loggedIn={loggedIn} onLogin={loginHandler}></Login></Route>
            <Route  exact path="/"><SurveyHome loggedIn={loggedIn}></SurveyHome></Route>          
            <Route  path="/compiler"> <SurveyCompiler loggedIn={loggedIn}></SurveyCompiler></Route>
            
            <Route  exact path="/dashboard"><SurveyDashboard loggedIn={loggedIn}></SurveyDashboard></Route>
            <Route  exact path="/create"><SurveyEditor loggedIn={loggedIn}></SurveyEditor> </Route>
            <Route  path="/reader"> <ResultReader loggedIn={loggedIn}></ResultReader> </Route>
          </Switch>
          </>
        }
        </Container>
      </Router>
      
    </>
  );
}

export default App;
