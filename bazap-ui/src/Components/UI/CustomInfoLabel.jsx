import { Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import propTypes from "prop-types";

const CustomInfoLabel = ({ label, value }) => {
    const theme = useTheme();
    return (
        <>
            <Grid container rowSpacing={1}>
                <Grid xs={6}>
                    <Typography variant="body1" color={theme.palette.infoText} fontSize={14} fontWeight={500}>
                        {label}
                    </Typography>
                </Grid>
                <Grid xs={6}>
                    <Typography variant="body1" fontSize={14} fontWeight={500}>
                        {value}
                    </Typography>
                </Grid>
            </Grid>
        </>
    );
};
CustomInfoLabel.propTypes = {
    label: propTypes.string.isRequired,
    value: propTypes.any.isRequired,
};

export default CustomInfoLabel;
