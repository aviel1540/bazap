import PropTypes from "prop-types";
import { useState } from "react";
import Search from "antd/es/input/Search";

let timeoutId = null;

const SearchInput = ({ onSearch, onTabHandle }) => {
    const [inputValue, setInputValue] = useState("");

    const handleTab = (event) => {
        if (onTabHandle && event.key === "Tab") {
            const result = onTabHandle();
            if (result) {
                event.preventDefault();
                setInputValue("");
                onSearch("");
            }
        }
    };

    const handleSearch = (event) => {
        const value = event.target.value;
        setInputValue(value);

        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            onSearch(value);
        }, 300);
    };

    return (
        <Search
            placeholder="חפש..."
            allowClear
            value={inputValue}
            onChange={handleSearch}
            // onKeyDown={handleTab}
            style={{
                width: 200,
            }}
        />
    );
};

SearchInput.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onTabHandle: PropTypes.func,
};

export default SearchInput;
