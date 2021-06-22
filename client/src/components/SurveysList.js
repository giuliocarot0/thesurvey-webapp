import {Col, Container, Button, Row} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import { Link} from 'react-router-dom'
import {getSurveyList} from './surveymock'

/*this components list all the available surveys*/
export default function SurveysList(props) {

    const [surveys, setSurveys] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        let list = getSurveyList();
        if(list.length > 0)
            setSurveys(list); 
        console.log(list)
        setRefresh(false);
        setLoading(false);
    },[refresh, loading])

    return (<>
        {loading ? "Please wait while the content loads!" :<>
            <Container className="home">
             {surveys ? <div className="homeHeader"><h2>Choose a survey to start!</h2></div>: "" }

                <Col className="theviewer list" md={{ span: 9, offset: 0 }}>
                    {surveys ? <>
                        {surveys.map((s, i) =>
                        <div key={s.id}>  
                            <Row>
                                <Col md={6}>
                                    <h4>{s.title}</h4> 
                                </Col> 
                                <Col md={6}>
                                <div align="right" className="thesurveybtns">
                                    <Link to={"/compile/"+s.id}><Button style={{backgroundColor:"#8860d0"}}>Compile</Button></Link>
                                </div>
                                </Col>
                            </Row>
                            {i===surveys.length -1 ? <span></span> : <hr></hr>}
                        </div>)} </>
                    :   <div align="center">
                            <h3> I'm sorry but there is nothing to show here!</h3>
                            <p> Login and create a new survey!</p>
                        </div>
                    }
                </Col>
            </Container>
         
        </> }
    </>)
}