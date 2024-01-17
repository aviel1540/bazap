import { useQuery } from "@tanstack/react-query";
import propTypes from "prop-types";
import { getAllArrivedDevicesInProject } from "../../../../Utils/deviceApi";
import Loader from "../../../Layout/Loader";
import CustomTable from "../../../UI/CustomTable/CustomTable";
import { replaceApostrophe } from "../../../../Utils/utils";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../../UI/LightButton";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import StatusChip from "./StatusChip";
import TableActions from "../../../UI/CustomTable/TableActions";
import StatusForm from "./StatusForm";
import { useCustomModal } from "../../../store/CustomModalContext";

const ArrivedDevices = ({ projectId }) => {
    const { onShow, onHide } = useCustomModal();
    const [selectedRows, setSelectedRows] = useState(false);
    const { isLoading, data: devices } = useQuery({
        queryKey: ["arrivedDevices", projectId],
        queryFn: getAllArrivedDevicesInProject,
    });
    const selectedStatus = selectedRows.length > 0 ? selectedRows[0].status : null;
    const modalProperties = {
        title: "שינוי סטטוס",
        maxWidth: "md",
        body: <StatusForm status={selectedStatus} onCacnel={onHide} />,
    };
    const showModal = () => {
        onShow(modalProperties);
    };
    const handleChange = ({ selectedRows }) => {
        setSelectedRows(selectedRows);
    };
    if (isLoading) {
        return <Loader />;
    }
    const actions = [
        {
            title: "מחק",
            handler: (rowId, handleClose) => {
                alert(rowId, handleClose);
            },
        },
    ];
    const columns = [
        {
            name: "צ' מכשיר",
            sortable: true,
            selector: (row) => row.serialNumber,
        },
        {
            name: "סטטוס",
            sortable: true,
            selector: (row) => row.status,
            cell: (row) => <StatusChip status={row.status} />,
        },
        {
            name: "סוג מכשיר",
            sortable: true,
            selector: (row) => replaceApostrophe(row.deviceType),
        },
        {
            name: "יחידה",
            sortable: true,
            selector: (row) => row.unit?.unitsName,
        },
        {
            name: "פעולות",
            center: true,
            cell: (row) => <TableActions rowId={row._id} actions={actions} />,
        },
    ];
    const options = {
        selectableRows: true,
        onSelectedRowsChange: handleChange,
    };

    return (
        <>
            <Card>
                <CardHeader
                    titleTypographyProps={{ variant: "h6" }}
                    title='מכשירים בבצ"פ'
                    action={
                        selectedRows.length > 0 && (
                            <LightButton variant="contained" btncolor="info" onClick={showModal} icon={<SwapHorizIcon />} size="small">
                                שנה סטטוס
                            </LightButton>
                        )
                    }
                />
                <CardContent>
                    <CustomTable data={devices} columns={columns} options={options} />
                </CardContent>
            </Card>
        </>
    );
};
ArrivedDevices.propTypes = {
    projectId: propTypes.string.isRequired,
};
export default ArrivedDevices;
