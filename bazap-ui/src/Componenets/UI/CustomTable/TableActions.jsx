import { Button, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import propTypes from "prop-types";

const TableActions = ({ rowId, actions }) => {
    const [menuHandler, setMenuHandler] = useState(null);
    const handleClick = (event, rowId) => {
        setMenuHandler((prevMenuHandler) => {
            const updatedMenuHandler = { ...prevMenuHandler };
            updatedMenuHandler[rowId] = event.currentTarget;
            return updatedMenuHandler;
        });
    };
    const handleClose = (rowId) => {
        setMenuHandler((prevMenuHandler) => {
            const updatedMenuHandler = { ...prevMenuHandler };
            updatedMenuHandler[rowId] = undefined;
            return updatedMenuHandler;
        });
    };
    return (
        <>
            <Button
                variant="contained"
                id="basic-button"
                aria-controls={Boolean(menuHandler?.[rowId]) ?? false ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={Boolean(menuHandler?.[rowId]) ?? false ? "true" : undefined}
                onClick={(event) => {
                    handleClick(event, rowId);
                }}
                size="small"
                endIcon={<KeyboardArrowDownIcon />}
            >
                פעולות
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={menuHandler?.[rowId] ?? null}
                open={Boolean(menuHandler?.[rowId]) ?? false}
                onClose={() => handleClose(rowId)}
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                }}
                MenuListProps={{
                    "aria-labelledby": "basic-button",
                }}
            >
                {actions.map((action, index) => {
                    return (
                        <MenuItem key={`${rowId}_${index}`} onClick={() => action.handler(rowId, handleClose)}>
                            {action.title}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
};
TableActions.propTypes = {
    rowId: propTypes.string.isRequired,
    actions: propTypes.array.isRequired,
};

export default TableActions;
