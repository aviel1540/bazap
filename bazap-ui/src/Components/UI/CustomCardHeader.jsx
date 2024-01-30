import propTypes from "prop-types";
import React from "react";

function CustomCardHeader({ title, children }) {
    return (
        <div className="card-header">
            <div className="card-title">{title}</div>
            <div className="card-toolbar">{children}</div>
        </div>
    );
}
// CustomCardHeader.propTypes = {
//     children: propTypes.children,
//     title: React.ReactNode,
// };
export default CustomCardHeader;
