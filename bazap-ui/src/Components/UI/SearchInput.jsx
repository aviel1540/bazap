import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const SearchInput = (props) => {
    return (
        <TextField
            {...props}
            label="חפש..."
            InputProps={{
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon />
                    </InputAdornment>
                ),
            }}
        />
    );
};

export default SearchInput;
