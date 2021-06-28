import {Form, Container, Button, Col} from 'react-bootstrap'
import {Redirect} from 'react-router-dom'
import {useState} from 'react'
import API from '../API'
import validator from 'validator'

export default function Login(props){
    const {onLogin, loggedIn} = props
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e)=>{
        e.preventDefault();
        setLoading(true);            
        let mounted = true;

        if(validateFields(username, password)){
            let credentials = {username, password}
            API.login(credentials)
                .then((a) =>{
                    if(mounted){
                        setLoading(false)
                        onLogin(a)
                        setError(false)
                    }
                })
                .catch(e =>{
                    if(mounted){
                        setLoading(false)
                        setError({type: "login"})
                    }
                })
        }
        else   {
            setLoading(false)
            setError({type: "validation"})
        } 
        return () => mounted = false
    }
    const validateFields = (e,p)=>{
        return validator.isEmail(e) && p.length >= 8
    }

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
                        <Form.Control value = {username} onChange={(e)=>{setUsername(e.target.value)}}type="email" placeholder="Enter email" />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control value = {password} onChange={(e)=>{setPassword(e.target.value)}} type="password" placeholder="Password" />
                    </Form.Group>
                    <div align="right"> 
                    {error && <font color="red" style={{margin: "30px"}}> {error.type === "login" ? " Cannot login, please check username and password!" : "Invalid email or password"}</font>}
                   
                    <Button variant="primary" disabled={loading} onClick={handleSubmit}>
                        {loading ? 
                            "Loading..."
                            : "Login" }
                    </Button>
                   
                    </div>
                </Form>
            </Col>    
        </Container>
    </>)
}