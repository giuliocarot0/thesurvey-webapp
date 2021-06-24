import {Navbar,Col, Button} from 'react-bootstrap';
import {useLocation, Link} from 'react-router-dom'
import './components.css'


function SurveyNavbar(props){

  const location = useLocation();

  return(
        <Navbar className="thenavbar" expand="lg" fixed="top"  >
        <Col md={6}>
        <Navbar.Brand >
           <b>TheSurvey</b> {location.pathname.split("/").map(e => {return  e==="" ?  "" : " / " +e  })}
        </Navbar.Brand>
        </Col>
        <Col md={6} align="right">
        {location.pathname !== "/login"  &&  <Link to="login"> 
            <Button style={{margin:"5px"}}> Login</Button>
            </Link>}
        </Col> 
  </Navbar>
)
}

export default SurveyNavbar;