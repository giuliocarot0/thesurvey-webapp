import {BrowserRouter as Router, Route } from 'react-router-dom';
import SurveyNavbar from './components/navbar';
import SurveyHome from './components/SurveyHome'
import SurveyEditor from './components/SurveyEditor'
import {Container} from 'react-bootstrap'
import './components/components.css'
import ResultReader from './components/ResultReader';
import SurveyCompiler from './components/SurveyCompiler';

require('bootstrap')
function App() {
  return ( 
      <>
      <Router>
        <SurveyNavbar></SurveyNavbar>
        <Container fluid className="thebodyofsurvey">
          <Route exact path="/login"> This is the login page </Route>
          <Route exact path="/"><SurveyHome></SurveyHome></Route>
          <Route exact path="/dashboard"></Route>
          <Route exact path="/create"><SurveyEditor></SurveyEditor> </Route>
          <Route path="/reader"> <ResultReader></ResultReader></Route>
          <Route path="/compiler"> <SurveyCompiler></SurveyCompiler></Route>
        </Container>
      </Router>
      
    </>
  );
}

export default App;
