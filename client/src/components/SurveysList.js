import {Col, Container, Button, Form, Row} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import {useLocation, Redirect, Link} from 'react-router-dom'
import {getSurveyList} from './surveymock'

/*this components list all the available surveys*/
export default function SurveysList(props) {

    const [surveys, setSurveys] = useState(false)
    const [refresh, setRefresh] = useState(true)

    useEffect(()=>{
        let list = getSurveyList();
        if(list.length > 0)
            setSurveys(list); 
        console.log(list)
        setRefresh(false);
    },[refresh])

    return (
        <>  
            <Container className="home">
                <Col className="theviewer list" md={{ span: 9, offset: 0 }}>
                    {surveys ? 
                        surveys.map(s =>
                        <>  
                            <Row>
                                <Col md={6}>
                                    <h3>{s.title}</h3> 
                                </Col> 
                                <Col md={6}>
                                <div align="right" className="thesurveybtns">
                                    <Link to={"/compile/"+s.id}><Button>Compile</Button></Link>
                                </div>
                                </Col>
                            </Row>
                            <hr></hr>
                        </>)
                    :   <div align="center">
                            <h3> I'm sorry but there is nothing to show here!</h3>
                            <p> Login and create a new survey!</p>
                        </div>
                    }
                </Col>
            </Container>
         
        </>
    )
}