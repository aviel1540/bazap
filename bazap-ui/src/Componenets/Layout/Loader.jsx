import { Box, LinearProgress } from "@mui/material";

export default function Loader() {
    return (
        <Box width={1 / 2} marginX={"auto"}>
            <Box textAlign="center" fontWeight="600" marginBottom={2}>
                אנא המתן...
            </Box>
            <LinearProgress color="primary" fourColor={false} variant="indeterminate" />
        </Box>
    );
}
