import React from "react";
import { Empty, Flex } from "antd";
import { Box, LinearProgress } from "@mui/material";
const EmptyData = ({ label = "No Data" }) => {
    return (
        <Box width={1 / 2} marginX={"auto"}>
            <Box textAlign="center" fontWeight="600" marginBottom={2}>
                <Empty description={<span>{label}</span>} />
            </Box>
        </Box>
    );
};

export default EmptyData;
