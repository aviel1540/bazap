import SearchIcon from "@mui/icons-material/Search";
import { Input } from "antd";
import Search from "antd/es/input/Search";
let timeoutId = null;
const SearchInput = (props) => {
    const handleSearch = (event) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            props.onSearch(event);
        }, 300);
    };
    return (
        <Search
            placeholder="חפש..."
            allowClear
            onChange={handleSearch}
            {...props}
            style={{
                width: 200,
            }}
        />
    );
};

export default SearchInput;
