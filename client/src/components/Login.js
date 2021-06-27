import {Form, Container, Button, Col} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'

export default function Login(props){
    const {onLogin, loggedIn} = props
    return(<>
        {loggedIn && <Redirect to="/dashboard"/>}
        <Container>
            <Col className="theviewer" align="center" md={{ span: 6, offset: 3 }}> 
                 <h4>TheSurvey Login</h4>
                 Login with your username and password to create surveys and manage them!
                </Col>
            <Col className="theviewer" md={{span:6, offset:3}}>
                <Form>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <div align="right"> 
                    <Button variant="primary" onClick={()=>onLogin()}>
                        Login
                    </Button>
                    </div>
                </Form>
            </Col>    
        </Container>>
    </>)
}