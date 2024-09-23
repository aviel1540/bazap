import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Table, Typography } from "antd";
import CustomDropDown from "../../Components/UI/CustomDropDown";
import { useUserAlert } from "../../Components/store/UserAlertContext";
import { deleteTechnician, getAllTechnicians } from "../../Utils/technicianAPI";
import DeleteIcon from "@mui/icons-material/Delete";
import EmptyData from "../../Components/UI/EmptyData";
import TableLoader from "../../Components/Loaders/TableLoader";
import propTypes from "prop-types";

const { Text } = Typography;

const TechnicianTable = ({ onEdit, searchQuery }) => {
    const queryClient = useQueryClient();
    const { onConfirm } = useUserAlert();
    const { isLoading, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });

    const filteredUnits = technicians?.filter((technician) => technician.techName.toLowerCase().includes(searchQuery.toLowerCase()));

    // const onEditTechnicianHandler = (id) => {
    //     const technician = technicians.find((item) => item._id == id);
    //     if (technician) {
    //         onEdit({ techName: technician.techName, id: technician._id });
    //     }
    // };

    const onDeleteTechnicianHandler = (id) => {
        const config = {
            title: "האם אתה בטוח מעוניין למחוק את הטכנאי?",
            okHandler: () => {
                deleteTechnicianMutation.mutate(id);
            },
        };
        onConfirm(config);
    };

    const menuActions = [
        // {
        //     key: "edit",
        //     label: "ערוך",
        //     in: <BorderColorIcon />,
        //     handler: (data) => {
        //         onEditTechnicianHandler(data._id);
        //     },
        // },
        {
            key: "delete",
            label: "מחק",
            danger: true,
            icon: <DeleteIcon />,
            handler: (data) => {
                onDeleteTechnicianHandler(data._id);
            },
        },
    ];

    const columns = [
        {
            title: "שם טכנאי",
            dataIndex: "techName",
            key: "techName",
            render: (text) => <Text strong>{text}</Text>,
        },
        {
            title: "פעולות",
            key: "menu",
            dataIndex: "actions",
            align: "center",
            render: (_, row) => <CustomDropDown key={row._id} actions={menuActions} data={row} />,
        },
    ];

    const deleteTechnicianMutation = useMutation(deleteTechnician, {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["technicians"] });
        },
    });

    if (isLoading) {
        return <TableLoader columns={columns} />;
    }
    return (
        <>
            <Table
                locale={{ emptyText: <EmptyData label="אין טכנאים להצגה" /> }}
                dataSource={filteredUnits}
                columns={columns}
                size="small"
                rowKey={(record) => record._id}
            />
        </>
    );
};
TechnicianTable.propTypes = {
    onEdit: propTypes.func.isRequired,
    searchQuery: propTypes.string,
};

export default TechnicianTable;
