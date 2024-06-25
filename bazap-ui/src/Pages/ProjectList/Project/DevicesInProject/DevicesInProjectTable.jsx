import { Input, InputNumber, Space, Table, Tag, Typography } from "antd";
import PropTypes from "prop-types";
import { DeviceStatuses, FIXED_OR_DEFECTIVE, RETURNED, ReturnedStatuses, tagColors } from "../../../../Utils/utils";
import Loader from "../../../../Components/Layout/Loader";
import EmptyData from "../../../../Components/UI/EmptyData";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAllUnits } from "../../../../Utils/unitAPI";
import { updateNotes as deviceUpdateNotes } from "../../../../Utils/deviceApi";
import { updateNotes as accessoryUpdateNotes } from "../../../../Utils/accessoryAPI";
import { useProject } from "../../../../Components/store/ProjectContext";
const { Text } = Typography;

const DevicesInProjectTable = ({ rowSelection, filteredDevices, defaultPageSize, isLoading, handleStatusChange }) => {
    const queryClient = useQueryClient();
    const { projectId } = useProject();
    const { data: units, isLoading: isUnitsLoading } = useQuery({
        queryKey: ["units"],
        queryFn: getAllUnits,
    });
    const paginationOptions = {
        showSizeChanger: true,
        pageSizeOptions: ["5", "10", "25", "50"],
        defaultPageSize: defaultPageSize ? defaultPageSize : 10,
        locale: {
            items_per_page: "/ עמוד",
        },
        showTotal: (total, range) => `${range[0]}-${range[1]} מתוך ${total} מכשירים`,
    };
    const handleTagClick = (status) => {
        if ([DeviceStatuses.DEFECTIVE_RETURN, DeviceStatuses.FIXED_RETURN].includes(status)) {
            handleStatusChange(RETURNED);
            return;
        }
        if ([DeviceStatuses.FIXED, DeviceStatuses.DEFECTIVE, DeviceStatuses.FINISHED].includes(status)) {
            handleStatusChange(FIXED_OR_DEFECTIVE);
            return;
        }
        handleStatusChange(status);
        return;
    };
    let timeoutId = null;
    const updateDeviceNotesMutation = useMutation(deviceUpdateNotes, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
        },
    });
    const updateAccessoryNotesMutation = useMutation(accessoryUpdateNotes, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["devicesInProject", projectId] });
        },
    });
    const handleNotesChange = (event, id, isClassified) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            if (isClassified) {
                updateDeviceNotesMutation.mutate({ id, notes: event.target.value });
            } else {
                updateAccessoryNotesMutation.mutate({ id, notes: event.target.value });
            }
        }, 300);
    };
    const columns = () => [
        {
            title: "צ' מכשיר",
            dataIndex: "serialNumber",
            key: "serialNumber",
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: 'מק"ט',
            key: "deviceTypeId",
            render: ({ deviceTypeId }) => deviceTypeId.catalogNumber,
            sorter: (a, b) => a.deviceTypeId.catalogNumber?.length - b.deviceTypeId?.catalogNumber.length,
        },
        {
            title: "סטטוס",
            dataIndex: "status",
            key: "status",
            render: (_, { status }) => (
                <>
                    {handleStatusChange == undefined && <Tag color={tagColors[status]}>{status}</Tag>}
                    {handleStatusChange != undefined && (
                        <Tag color={tagColors[status]} onClick={() => handleTagClick(status)} style={{ cursor: "pointer" }}>
                            {status}
                        </Tag>
                    )}
                </>
            ),
            sorter: (a, b) => a.status.length - b.status.length,
            sortDirections: ["descend"],
        },
        {
            title: "יחידה",
            dataIndex: "unit",
            key: "unit",
            filters: units.map((unit) => {
                return { text: unit.unitsName, value: unit._id };
            }),
            onFilter: (value, record) => record.unit._id == value,
            sorter: (a, b) => a?.unit?.unitsName.length - b?.unit?.unitsName.length,
            render: (unit) => unit?.unitsName,
        },
        {
            title: "סוג מכשיר",
            key: "deviceType",
            filters: [
                { text: "מסווג", value: true },
                { text: 'צל"מ', value: false },
            ],
            onFilter: (value, record) => record.deviceTypeId?.isClassified == value,
            render: ({ deviceTypeId }) => deviceTypeId?.deviceName,
            sorter: (a, b) => a.deviceTypeId.deviceName?.length - b.deviceTypeId?.deviceName.length,
            sortDirections: ["descend"],
        },
        {
            title: "כמות",
            key: "quantity",
            sorter: (a, b) => a.deviceTypeId.deviceName?.length - b.deviceTypeId?.deviceName.length,
            sortDirections: ["descend"],
            render: (record) => (record.deviceTypeId.isClassified ? 1 : record.quantity),
        },
        {
            title: "הערות",
            dataIndex: "notes",
            key: "notes",
            // width: "30%",
            width: "40%",
            render: (notes, record) => {
                const notesInput = (
                    <Input
                        defaultValue={notes}
                        disabled={ReturnedStatuses.includes(record.status)}
                        onChange={(event) => handleNotesChange(event, record._id, record.isClassified)}
                        placeholder="הערות"
                    />
                );
                let status = "";
                if (!record.deviceTypeId.isClassified) {
                    status = "";
                }
                return (
                    <>
                        {!record.deviceTypeId.isClassified && (
                            <Space.Compact>
                                <InputNumber addonBefore="תקין" min={0} max={10} status="error" defaultValue={record.fix} />
                                <InputNumber addonBefore="מושבת" min={0} max={10} status="error" defaultValue={record.defective} />
                                {notesInput}
                            </Space.Compact>
                        )}
                        {record.deviceTypeId.isClassified && notesInput}
                    </>
                );
            },
        },
    ];

    if (isLoading || isUnitsLoading) {
        return <Loader />;
    }
    return (
        <Table
            locale={{ emptyText: <EmptyData label="אין מכשירים להצגה" /> }}
            rowSelection={rowSelection}
            dataSource={filteredDevices}
            pagination={paginationOptions}
            rowKey={(record) => record._id}
            columns={columns()}
        />
    );
};

DevicesInProjectTable.propTypes = {
    rowSelection: PropTypes.object,
    filteredDevices: PropTypes.array,
    defaultPageSize: PropTypes.number,
    isLoading: PropTypes.bool,
    handleStatusChange: PropTypes.func,
};
export default DevicesInProjectTable;
