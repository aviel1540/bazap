import { Card, Form } from "react-bootstrap";
import CustomCardHeader from "../../UI/CustomCardHeader";
import { useState } from "react";

function Home() {
    const [yearFilter, setYearFilter] = useState("2023");
    const handleYearChange = (event) => {
        setYearFilter(event.target.value);
    };
    return (
        <Card>
            <CustomCardHeader title="פרוייקטים סגורים">
                <Form.Select value={yearFilter} onChange={handleYearChange}>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="all">הכל</option>
                </Form.Select>
            </CustomCardHeader>
            <Card.Body></Card.Body>
        </Card>
    );
}

export default Home;
