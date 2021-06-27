import {Col, Container, Button, Row} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import { Link, Redirect} from 'react-router-dom'
import API from '../API'
import LoadingComponent from './LoadingComponent';

/*this components list all the available surveys*/
export default function SurveyHome(props) {
    const {loggedIn} = props;
    const [surveys, setSurveys] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const getList = async()=>{
           let list = await  API.getSurveyList()
           if(list) 
                setSurveys(list)
           else 
               setSurveys(false)
           setLoading(false);
           setRefresh(false);
        }
        if(refresh){
                getList()
            }
    },[refresh])

   
    return (<>
        {loggedIn && <Redirect to="/dashboard"/>}

        {loading ? <LoadingComponent></LoadingComponent>:<>
            <Container className="home">
             {surveys ? 
                 <Col className="theviewer" align="center" md={{ span: 6, offset: 3 }}> 
                 <h4>TheSurvey Home</h4>
                 Select one of the following surveys to start! The compiler will guide you step by step.
                </Col>: "" }
                <Col className="theviewer list" md={{ span: 9, offset: 0 }}>
                    {surveys ? <>
                        {surveys.map((s, i) =>
                        <div key={s.id}>  
                            <Row>
                                <Col md={6}>
                                    <h5>{s.title}</h5> 
                                </Col> 
                                <Col md={6}>
                                <div align="right" className="thesurveybtns">
                                    <Link to={"/compiler/"+s.id}><Button style={{backgroundColor:"#8860d0"}}>Compile</Button></Link>
                                </div>
                                </Col>
                            </Row>
                            {i+1>=surveys.length ? <span></span> : <hr></hr>}
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