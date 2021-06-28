
import {useState, useEffect} from 'react'
import {Col, Container, Button, Row} from 'react-bootstrap'
import {Link, Redirect} from 'react-router-dom'
import API from '../API'
import LoadingComponent from './LoadingComponent'

export default function SurveyDashboard(props){
    const {loggedIn} = props;
    const [mySurveys, setMySurveys] = useState(false)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
  
    

    useEffect(()=>{
        const getList = async ()=>{
            try{
                let list =  await API.getSurveyList()
                setMySurveys(list)
                setLoading(false)
            }
            catch(e){
                setError(false)
                setLoading(false);
            }
        }
        if(loading)
            getList()
    },[loading])

    return (<>
        {loading ? <LoadingComponent></LoadingComponent> :
        <>
        {!loggedIn && <Redirect to="/login"/>}
        <Container>
             <Col className="theviewer" align="center" md={{ span: 6, offset: 3 }}> 
                 <h4>{loggedIn.name}'s Dashboard</h4>
                 {loggedIn.name}, starting from here you can create new surveys and check submissions.
             </Col>
             <Col className="theviewer" align="left" md={{ span: 6, offset: 3 }}> 
             {error && <h3>{error.error}</h3> }
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
              !error &&  <h4> It looks like you have no surveys to check. Create a new one!</h4>    
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