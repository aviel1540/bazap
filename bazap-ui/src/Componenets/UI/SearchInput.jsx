import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { PropTypes } from "prop-types";

const SearchInput = ({ id, label, color, onChange }) => {
    return (
        <Box sx={{ display: "flex", alignItems: "flex-end" }}>
            <SearchIcon sx={{ color: "action.active", mr: 1, my: 0.5 }} />
            <TextField id={id} color={color} label={label} onChange={onChange} />
        </Box>
    );
};

SearchInput.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    color: PropTypes.node.isRequired,
    onChange: PropTypes.func.isRequired,
};
export default SearchInput;
