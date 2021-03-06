import {Col, Container, Button, Row} from 'react-bootstrap'
import {useState, useEffect} from 'react'
import { Link, Redirect} from 'react-router-dom'
import API from '../API'
import LoadingComponent from './LoadingComponent';

/*this components list all the available surveys*/
export default function SurveyHome(props){
    const {loggedIn} = props; 
    const [surveys, setSurveys] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false)
    
    useEffect(()=>{
        const getList = async ()=>{
            try{
                let l = await API.getSurveyList()
                setSurveys(l)
                setLoading(false)
                setError(false)
            }
            catch(e) {
                    setError(e)
                    setSurveys(false)
                    setLoading(false)
                }
            }
        if(loading)
            getList()
    },[loading])

   
    return (<>

    {loading ? <LoadingComponent></LoadingComponent>:<>
            {loggedIn && <Redirect to="/dashboard"/>}
            <Container className="home">
             {surveys ? 
                 <Col className="theviewer" align="center" md={{ span: 6, offset: 3 }}> 
                 <h4>TheSurvey Home</h4>
                 Select one of the following surveys to start! The compiler will guide you step by step.
                </Col>: "" }
                <Col className="theviewer list" md={{ span: 9, offset: 0 }}>
                    {error && <h3>{error.error}</h3> }

                    {surveys && surveys.length>0? <>
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
                           ??{i+1>=surveys.length ? <span></span> : <hr></hr>}
                        </div>)} </>
                    :   !error && <div align="center">
                            <h3> I'm sorry but there is nothing to show here!</h3>
                            <p> Login and create a new survey!</p>
                        </div>
                    }
                </Col>
            </Container>
         
        </> }
    </>)
}