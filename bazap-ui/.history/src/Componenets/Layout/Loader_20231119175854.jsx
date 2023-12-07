import { Spinner } from "react-bootstrap";

export default function Loader() {
  return (
    <div className="text-center">
        <Spinner size="lg" animation="border" variant="primary" />
    </div>
  )
}
