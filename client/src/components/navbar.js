import {Navbar} from 'react-bootstrap';
import {useLocation} from 'react-router-dom'
import './components.css'


function SurveyNavbar(props){

  const location = useLocation();

  return(
        <Navbar className="thenavbar" expand="lg" fixed="top"  >
        <Navbar.Brand >
           <b>TheSurvey</b> {location.pathname.split("/").map(e => {return " / " +e  })}
        </Navbar.Brand>
        <div align="center"></div>
       
  </Navbar>
)
}

export default SurveyNavbar;