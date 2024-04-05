import { Card, CardContent, CardHeader } from "@mui/material";

const CustomCard = ({ title, action, children }) => {
    return (
        <Card>
            <CardHeader action={action} titleTypographyProps={{ variant: "h5" }} title={title} />
            <CardContent>{children}</CardContent>
        </Card>
    );
};

export default CustomCard;
