import { useQuery } from "@tanstack/react-query";
import { getAllArrivedDevicesInProject } from "../../../../../Utils/deviceApi";
import Loader from "../../../../Layout/Loader";
import CustomTable from "../../../../UI/CustomTable/CustomTable";
import { ALL, DeviceStatuses, FIXED_OF_DEFFECTIVE, RETURNED, chipColors, replaceApostrophe } from "../../../../../Utils/utils";
import { useCallback, useState } from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import LightButton from "../../../../UI/LightButton";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import StatusChip from "../StatusChip";
import TableActions from "../../../../UI/CustomTable/TableActions";
import StatusForm from "../StatusForm";
import { useCustomModal } from "../../../../store/CustomModalContext";
import SearchInput from "../../../../UI/SearchInput";
import { useProject } from "../../../../store/ProjectContext";
import { useRenderCount } from "@uidotdev/usehooks";
import StatusFilter from "./StatusFilter";
import VoucherStepper from "../NewVoucher/VoucherStepper";

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
        cell: (row) => <StatusChip status={row.status} color={chipColors[row.status]} />,
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
const ReturnedStatuses = [DeviceStatuses.DEFECTIVE_RETURN, DeviceStatuses.FIXED_RETURN];

const ArrivedDevices = () => {
    const renderCount = useRenderCount();
    const { projectId } = useProject();
    const { onShow, onHide } = useCustomModal();
    const [selectedRows, setSelectedRows] = useState([]);
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [searchParam, setSearchParam] = useState("");
    const [selectedStatus, setSelectedStatus] = useState(ALL);
    const [toggledClearRows, setToggleClearRows] = useState(false);

    const clearSelectedRows = () => {
        console.log(toggledClearRows);
        setToggleClearRows(!toggledClearRows);
    };

    const { isLoading, data: devices } = useQuery({
        queryKey: ["arrivedDevices", projectId],
        queryFn: getAllArrivedDevicesInProject,
        onSuccess: (data) => {
            setFilteredDevices(data);
            if (devices) handleSearchAndFilter(searchParam, data, selectedStatus);
            clearSelectedRows();
        },
    });

    const handleRowSelected = useCallback((state) => {
        setSelectedRows(state.selectedRows);
    }, []);

    const handleSearchChange = (event) => {
        const search = event.target.value;
        setSearchParam(search);
        handleSearchAndFilter(search, null, selectedStatus);
    };
    const handleStatusChange = (status) => {
        setSelectedStatus(status);
        handleSearchAndFilter(searchParam, null, status);
        clearSelectedRows();
    };
    const handleSearchAndFilter = (search, overrideDevices, status) => {
        const devicesToFilter = overrideDevices || devices;
        let newFilteredDevices = devicesToFilter.filter((device) => {
            if (status == ALL) return true;
            if (status == RETURNED) {
                return ReturnedStatuses.includes(device.status);
            }
            if (status == FIXED_OF_DEFFECTIVE) {
                return device.status == DeviceStatuses.FIXED || device.status == DeviceStatuses.DEFECTIVE;
            }
            return device.status == status;
        });
        if (newFilteredDevices.length == 0) {
            setSelectedStatus(ALL);
            newFilteredDevices = devicesToFilter;
        }

        const keysToInclude = ["serialNumber", "status", "deviceType"];

        newFilteredDevices = newFilteredDevices.filter((device) => {
            const searchObject = {
                ...keysToInclude.reduce((obj, key) => {
                    obj[key] = replaceApostrophe(device[key]);
                    return obj;
                }, {}),
                unitsName: device.unit?.unitsName,
            };

            const searchableString = JSON.stringify(searchObject).toLocaleLowerCase();
            return searchableString.includes(search.toLocaleLowerCase());
        });

        setFilteredDevices(newFilteredDevices);
    };

    const checkIfStatusExists = (status) => {
        const devicesStatusesGroup = Object.groupBy(devices, ({ status }) => status);
        if (status == RETURNED) {
            return (
                Object.keys(devicesStatusesGroup).includes(DeviceStatuses.DEFECTIVE_RETURN) ||
                Object.keys(devicesStatusesGroup).includes(DeviceStatuses.FIXED_RETURN)
            );
        }
        if (status == FIXED_OF_DEFFECTIVE) {
            return (
                Object.keys(devicesStatusesGroup).includes(DeviceStatuses.DEFECTIVE) ||
                Object.keys(devicesStatusesGroup).includes(DeviceStatuses.FIXED)
            );
        }
        return Object.keys(devicesStatusesGroup).includes(status);
    };

    const showModalChangeStatus = () => {
        const modalPropertiesChangeStatus = {
            title: "שינוי סטטוס",
            maxWidth: "md",
            body: (
                <StatusForm
                    status={selectedRows.length == 0 ? null : selectedRows[0].status}
                    devices={selectedRows}
                    onCacnel={onHide}
                    clearSelectedRows={clearSelectedRows}
                />
            ),
        };
        onShow(modalPropertiesChangeStatus);
    };

    const showModalCreateVoucher = () => {
        const formDefaultValues = {
            type: "false",
            devices: selectedRows.map((device) => {
                return { serialNumber: device.serialNumber, deviceType: device.deviceType };
            }),
        };
        const modalPropertiesCreateVoucher = {
            title: "שובר חדש",
            maxWidth: "md",
            body: <VoucherStepper onCancel={onHide} projectId={projectId} formDefaultValues={formDefaultValues} />,
        };
        onShow(modalPropertiesCreateVoucher);
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Card>
            <div>{renderCount}</div>
            <CardHeader
                titleTypographyProps={{ variant: "h6" }}
                title='מכשירים בבצ"פ'
                action={
                    <>
                        {selectedStatus !== FIXED_OF_DEFFECTIVE && selectedRows.length > 0 && (
                            <LightButton
                                variant="contained"
                                btncolor="info"
                                onClick={showModalChangeStatus}
                                icon={<SwapHorizIcon />}
                                size="small"
                            >
                                שנה סטטוס
                            </LightButton>
                        )}

                        {selectedStatus === FIXED_OF_DEFFECTIVE && selectedRows.length > 0 && (
                            <LightButton
                                variant="contained"
                                btncolor="info"
                                onClick={showModalCreateVoucher}
                                icon={<SwapHorizIcon />}
                                size="small"
                            >
                                צור שובר ניפוק
                            </LightButton>
                        )}
                    </>
                }
            />
            <CardContent>
                <SearchInput size="small" sx={{ m: 1, width: "25ch" }} value={searchParam} onChange={handleSearchChange} />
                <StatusFilter
                    checkIfStatusExists={checkIfStatusExists}
                    selectedStatus={selectedStatus}
                    handleStatusChange={handleStatusChange}
                />
                <CustomTable
                    data={filteredDevices}
                    columns={columns}
                    selectableRows={selectedStatus != ALL && selectedStatus != RETURNED && selectedRows}
                    onSelectedRowsChange={handleRowSelected}
                    toggledClearRows={toggledClearRows}
                />
            </CardContent>
        </Card>
    );
};
export default ArrivedDevices;
