import { Spinner} from 'react-bootstrap'

export default function LoadingComponent(props) {
    return (
        <div align="center">
            <Spinner variant="primary">

            </Spinner>
            <h2> <font color="white">Loading...</font></h2>
        </div>
    )
}