import { Empty } from "antd";
import { Box } from "@mui/material";
import PropTypes from "prop-types";

const EmptyData = ({ label = "No Data" }) => {
    return (
        <Box width={1 / 2} marginX={"auto"}>
            <Box textAlign="center" fontWeight="600" marginBottom={2}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>{label}</span>} />
            </Box>
        </Box>
    );
};

EmptyData.propTypes = {
    label: PropTypes.string,
};
export default EmptyData;
