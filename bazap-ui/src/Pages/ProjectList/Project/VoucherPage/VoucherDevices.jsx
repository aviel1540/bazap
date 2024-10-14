import { useEffect, useState } from "react";
import DevicesInProjectTable from "../DevicesInProject/DevicesInProjectTable";
import { useQuery } from "@tanstack/react-query";
import { DeviceStatuses, FIXED_OR_DEFECTIVE } from "../../../../Utils/utils";
import { getAllProductsInProject } from "../../../../Utils/projectAPI";
import { useProject } from "../../../../Components/store/ProjectContext";
import { getDevices } from "../../../../Utils/deviceApi";
import { useUserAlert } from "../../../../Components/store/UserAlertContext";
const sortAndUpdateState = (devices, setState) => {
    let newFilteredDevices = devices.filter((device) => {
        return (
            device.status == DeviceStatuses.FIXED || device.status == DeviceStatuses.DEFECTIVE || device.status == DeviceStatuses.FINISHED
        );
    });
    setState(newFilteredDevices);
    return newFilteredDevices;
};
const VoucherDevices = ({ setDefaultValues }) => {
    const [filteredDevices, setFilteredDevices] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const { onAlert, error } = useUserAlert();
    const location = useLocation();
    const devicesIds = location?.state?.devicesIds;
    const accessoriesIds = location?.state?.accessoriesIds;
    const { projectId } = useProject();
    const { isLoading: isLoadingArrivedDevices, data: allDevices } = useQuery({
        queryKey: ["allDevices"],
        queryFn: getDevices,
    });
    const { isLoading, data: devices } = useQuery({
        queryKey: ["fixedOrReturnedDevicesInProject", projectId],
        queryFn: getAllProductsInProject,
        onSuccess: (data) => {
            return sortAndUpdateState(data, setFilteredDevices);
        },
    });
    useEffect(() => {
        if (accessoriesIds && devicesIds) {
            const selectedIds = [...devicesIds, ...accessoriesIds];
            setDefaultValues((prev) => {
                return { ...prev, devicesIds, accessoriesIds };
            });
            setSelectedRows(selectedIds);
        }
    }, [devicesIds, accessoriesIds]);

    useEffect(() => {
        if (devices) {
            sortAndUpdateState(devices, setFilteredDevices);
        }
    }, [devices]);

    const onSelectChange = (newSelectedRowKeys) => {
        const selectedDevices = allDevices.filter((device) => newSelectedRowKeys.includes(device._id));
        const uniqueUnitIds = new Set(selectedDevices.map((device) => device.unit._id));
        const uniqueIsClassified = new Set(selectedDevices.map((device) => device.deviceTypeId.isClassified));

        const hasTwoDifferentUnits = uniqueUnitIds.size >= 2;
        const hasDifferentClassification = uniqueIsClassified.size >= 2;

        if (!hasTwoDifferentUnits && !hasDifferentClassification) {
            const classifiedDevicesIds = selectedDevices.filter((device) => device.deviceTypeId.isClassified).map((device) => device._id);

            const nonClassifiedAccessoriesIds = selectedDevices
                .filter((device) => !device.deviceTypeId.isClassified)
                .map((device) => device._id);

            setSelectedRows(newSelectedRowKeys);
            setDefaultValues((prev) => {
                return { ...prev, devicesIds: classifiedDevicesIds, accessoriesIds: nonClassifiedAccessoriesIds };
            });
        } else {
            onAlert("אין אפשרות לבחור מכשירים שלא מאותה יחידה או לבחור צל\"מ או צ' ביחד", error, true);
        }
    };
    const rowSelection = {
        selectedRowKeys: selectedRows,
        onChange: onSelectChange,
    };
    return (
        <DevicesInProjectTable
            isActionsHidden={true}
            isLoading={isLoading || isLoadingArrivedDevices}
            filteredDevices={filteredDevices}
            selectedStatus={FIXED_OR_DEFECTIVE}
            rowSelection={rowSelection}
            defaultPageSize={25}
        />
    );
};
import PropTypes from "prop-types";
import { useLocation } from "react-router";

VoucherDevices.propTypes = {
    setDefaultValues: PropTypes.func,
};
export default VoucherDevices;
