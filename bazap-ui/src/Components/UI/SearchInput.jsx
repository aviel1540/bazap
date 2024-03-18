import Search from "antd/es/input/Search";
import PropTypes from "prop-types";
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

SearchInput.propTypes = {
    onSearch: PropTypes.func.isRequired,
};
export default SearchInput;
