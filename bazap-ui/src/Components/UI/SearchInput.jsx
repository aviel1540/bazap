import Search from "antd/es/input/Search";
import PropTypes from "prop-types";
let timeoutId = null;

const SearchInput = ({ onSearch }) => {
    const handleSearch = (event) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            onSearch(event);
        }, 300);
    };
    return (
        <Search
            placeholder="חפש..."
            allowClear
            onChange={handleSearch}
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
