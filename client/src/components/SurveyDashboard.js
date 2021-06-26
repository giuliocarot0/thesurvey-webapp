
import {useState, useEffect} from 'react'
import {Col, Container, Button, Row} from 'react-bootstrap'
import {Link} from 'react-router-dom'
import API from '../API'

export default function SurveyDashboard(props){
    const user = "Giulio"
    const [mySurveys, setMySurveys] = useState(false)
    const [refresh, setRefresh] = useState(true)
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        API.getSurveyList()
            .then( list => {
                if(list.length > 0)
                    setMySurveys(list)
                setRefresh(false)
                setLoading(false)
            })
            .catch((err) => {
                //TODO: error handling here
                setRefresh(false);
                setLoading(false);
            })
       
    },[refresh, loading])

    return (
        <Container>
             <Col className="theviewer" align="center" md={{ span: 6, offset: 3 }}> 
                 <h4>{user}'s Dashboard</h4>
                 {user}, starting from here you can create new surveys and check submissions.
             </Col>
             <Col className="theviewer" align="left" md={{ span: 6, offset: 3 }}> 
                
            { mySurveys ? 
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
                            <Link to={"/reader/"+s.id}><Button style={{backgroundColor:"#8860d0"}}>Check</Button></Link>
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
    )
}