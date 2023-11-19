import { Spinner } from "react-bootstrap";

export default function Loader() {
    return (
        <div className="text-center">
            <Spinner animation="border" variant="primary" />
        </div>
    );
}
