import { useQuery } from "@tanstack/react-query";
import { Dropdown, DropdownButton, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";

const data = [
    {
        id: 1,
        deviceName: "RPT",
    },
    {
        id: 2,
        deviceName: "דור ה'",
    },
];

const DeviceTypeTable = () => {
    const {
        isLoading,
        data: deviceTypes,
    } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: () => {
            return data;
        },
    });
    const columns = [
        {
            name: "שם מכשיר",
            selector: (row) => row.deviceName,
        },
        {
            name: "פעולות",
            cell: () => (
                <DropdownButton size="sm" className="btn-light-primary" id="dropdown-item-button" title="פעולות">
                    <Dropdown.Item as="button">ערוך</Dropdown.Item>
                    <Dropdown.Item as="button" className="btn-light-danger">
                        מחק
                    </Dropdown.Item>
                </DropdownButton>
            ),
        },
    ];
    if (isLoading) {
        return <div>ss</div>;
    }
    return <DataTable className="table" columns={columns} data={deviceTypes} />;
};

export default DeviceTypeTable;
