import { Dropdown, DropdownButton } from "react-bootstrap";
import DataTable from "react-data-table-component";

const DeviceTypeTable = () => {
    const {
        isLoading,
        isError,
        error,
        data: deviceTypes,
    } = useQuery({
        queryKey: ["deviceTypes"],
        queryFn: () => {alert('get all devices')},
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

    return (
        <>
            <DataTable className="table" columns={columns} data={data} />
        </>
    );
};

export default DeviceTypeTable;
