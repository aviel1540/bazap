import { Card } from "react-bootstrap";
import MainNavigation from "../Navbar/MainNavigation";

const ErrorPage = () => {
    return (
        <>
            <MainNavigation />
            <div className="align-items-center justify-content-center mx-auto my-20 shadow-sm w-50">
                <Card className="text-center bg-white shadow-lg">
                    <Card.Body>
                        <Card.Title>אופס!</Card.Title>
                        <Card.Text>נראה שהגעת לאתר שלא קיים או שאין לך גישה אליו.</Card.Text>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default ErrorPage;
