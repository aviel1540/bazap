import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import propTypes from "prop-types";
import { Table, Typography } from "antd";
import Loader from "../../Components/Layout/Loader";
import CustomDropDown from "../../Components/UI/CustomDropDown";
import { useUserAlert } from "../../Components/store/UserAlertContext";
import { deleteTechnician, getAllTechnicians } from "../../Utils/technicianAPI";
import { useCustomModal } from "../../Components/store/CustomModalContext";
import TechnicianForm from "./TechnicianForm";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import DeleteIcon from "@mui/icons-material/Delete";
import EmptyData from "../../Components/UI/EmptyData";
const { Text } = Typography;

const TechnicianTable = () => {
    const { onShow, onHide } = useCustomModal();
    const queryClient = useQueryClient();
    const { onConfirm } = useUserAlert();
    const { isLoading, data: technicians } = useQuery({
        queryKey: ["technicians"],
        queryFn: getAllTechnicians,
    });

    const showModal = (data) => {
        onShow({
            title: "עריכת טכנאי",
            name: "technician",
            body: <TechnicianForm onCancel={() => onHide("technician")} formValues={data} isEdit={true} />,
        });
    };

    const onEditTechnicianHandler = (id) => {
        const technician = technicians.find((item) => item._id == id);
        if (technician) {
            showModal({ techName: technician.techName, id: technician._id });
        }
    };

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
        {
            key: "edit",
            label: "ערוך",
            icon: <BorderColorIcon />,
            handler: (data) => {
                onEditTechnicianHandler(data._id);
            },
        },
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
        return <Loader />;
    }

    return (
        <Table
            locale={{ emptyText: <EmptyData label="אין טכנאים להצגה" /> }}
            dataSource={technicians}
            columns={columns}
            rowKey={(record) => record._id}
        />
    );
};

TechnicianTable.propTypes = {
    onEdit: propTypes.func.isRequired,
};

export default TechnicianTable;
