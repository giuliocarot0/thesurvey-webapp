import {BrowserRouter as Router, Route } from 'react-router-dom';
import SurveyNavbar from './components/navbar';
import SurveysList from './components/SurveysList'
import SurveyViewer from './components/SurveyViewer'
import {Container} from 'react-bootstrap'
import './components/components.css'
require('bootstrap')
function App() {
  return ( 
      <>
      <Router>
        <SurveyNavbar></SurveyNavbar>
        <Container fluid className="thebodyofsurvey">
          <Route exact path="/login"> This is the login page </Route>
          <Route exact path="/"><SurveysList></SurveysList></Route>
          <Route exact path="/create"></Route>
          <Route path="/compile"> <SurveyViewer></SurveyViewer></Route>
        </Container>
      </Router>
      
    </>
  );
}

export default App;
