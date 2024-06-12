import { Card, CardContent, CardHeader } from "@mui/material";

const CustomCard = ({ title, action, children }) => {
    return (
        <Card>
            <CardHeader action={action} titleTypographyProps={{ variant: "h5" }} title={title} />
            <CardContent>{children}</CardContent>
        </Card>
    );
};

import PropTypes from "prop-types";

CustomCard.propTypes = {
    title: PropTypes.any,
    action: PropTypes.node,
    children: PropTypes.node,
};
export default CustomCard;
