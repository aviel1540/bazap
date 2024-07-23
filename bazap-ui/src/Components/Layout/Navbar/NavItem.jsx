import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

const NavItem = ({ page }) => {
    const { label, path } = page;
    return (
        <NavLink to={path} className="text-hover-white bg-nav-item text-active-white text-muted fw-600 px-2">
            <div className="">{label}</div>
        </NavLink>
    );
};

NavItem.propTypes = {
    page: PropTypes.object.isRequired,
    isActive: PropTypes.bool,
};
export default NavItem;
