import {BrowserRouter as Router, Route} from 'react-router-dom';
import {useState, useEffect} from 'react';

import SurveyNavbar from './components/navbar';
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
  const [loading, setLoading] = useState(false)
  const [refresh, setRefresh] = useState(true)
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
      setRefresh(false)
    }).catch(e =>{      
      setLoading(false)
      setLoggedIn(false)
      setRefresh(false)
    })
  }, [refresh])

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
          <Route  exact path="/login"><Login loggedIn={loggedIn} onLogin={loginHandler}></Login></Route>
          <Route  exact path="/"><SurveyHome loggedIn={loggedIn}></SurveyHome></Route>          
          <Route  path="/compiler"> <SurveyCompiler loggedIn={loggedIn}></SurveyCompiler></Route>

          <Route  exact path="/dashboard"><SurveyDashboard refresh={refresh} loaded={setRefresh} loggedIn={loggedIn}></SurveyDashboard></Route>
          <Route  exact path="/create"><SurveyEditor loggedIn={loggedIn}></SurveyEditor> </Route>
          <Route  path="/reader"> <ResultReader loggedIn={loggedIn}></ResultReader></Route>
          </>
        }
        </Container>
      </Router>
      
    </>
  );
}

export default App;
