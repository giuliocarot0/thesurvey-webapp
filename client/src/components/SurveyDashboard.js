
import {useState, useEffect} from 'react'
import {Col, Container, Button, Row} from 'react-bootstrap'
import {Link, Redirect} from 'react-router-dom'
import API from '../API'
import LoadingComponent from './LoadingComponent'

export default function SurveyDashboard(props){
    const {loggedIn} = props;
    const [mySurveys, setMySurveys] = useState(false)
    const [refresh, setRefresh] = useState(true)
    const [loading, setLoading] = useState(true)

  
    

    useEffect(()=>{
        API.getSurveyList()
            .then((list) => {               
                setMySurveys(list)
                setRefresh(false)
                setLoading(false)
            })
            .catch((err) => {
                //TODO: error handling here
                setRefresh(false);
                setLoading(false);
            })
    },[refresh])

    return (<>
        {!loggedIn && <Redirect to="/login"/>}
        {loading ? <LoadingComponent></LoadingComponent> :
        <>
        <Container>
             <Col className="theviewer" align="center" md={{ span: 6, offset: 3 }}> 
                 <h4>{loggedIn.name}'s Dashboard</h4>
                 {loggedIn.name}, starting from here you can create new surveys and check submissions.
             </Col>
             <Col className="theviewer" align="left" md={{ span: 6, offset: 3 }}> 
                
            { mySurveys && mySurveys.length > 0 ? 
            <>
                {mySurveys.map((s, i) =>
                <div key={s.id}>  
                    <Row>
                        <Col md={6}>
                            <h5>{s.title}</h5> 
                        </Col> 
                        <Col md={6}>
                        <div align="right" className="thesurveybtns">
                            Total submissions: {s.submission}
                            &nbsp;
                            &nbsp;
                            <Link to={"/reader/"+s.id}><Button disabled={s.submission === 0} style={{backgroundColor:"#8860d0"}}>Check</Button></Link>
                        </div>
                        </Col>
                    </Row>
                 {i+1>=mySurveys.length ? <span></span> : <hr></hr>}
                </div>)} 
            </>
            :
                <h4> It looks like you have no surveys to check. Create a new one!</h4>    
            }
            <hr/>
            <div align="right">
                <Link to="/create/">
                <Button>
                    Create a new survey
                </Button>
                </Link>
            </div>
            </Col>
        </Container>
        </>}
    </>)
}