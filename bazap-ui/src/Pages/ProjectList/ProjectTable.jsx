import { Table, Tag, Typography } from "antd";
import EmptyData from "../../Components/UI/EmptyData";
import { Link } from "react-router-dom";
const { Text } = Typography;
import PropTypes from "prop-types";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import CustomDropDown from "../../Components/UI/CustomDropDown";

const ProjectTable = ({ projects, onEdit }) => {
    const onEditUnitHandler = (id) => {
        const project = projects.find((item) => item._id == id);
        if (project) {
            onEdit(null, { projectName: project.projectName, id: project._id });
        }
    };
    const menuActions = [
        {
            key: "1",
            label: "ערוך",
            icon: <BorderColorIcon />,
            handler: (data) => {
                onEditUnitHandler(data._id);
            },
        },
    ];

    const columns = [
        {
            title: "שם פרוייקט",
            dataIndex: "projectName",
            key: "projectName",
            sorter: (a, b) => a.projectName.localeCompare(b.projectName),
            render: (text, record) => (
                <Link to={`/Project/${record._id}`}>
                    <Text strong className="text-hover-primary">
                        {text}
                    </Text>
                </Link>
            ),
        },
        {
            title: "תאריך התחלה",
            dataIndex: "startDate",
            key: "startDate",
            sorter: (a, b) => new Date(a.startDate) - new Date(b.startDate),
            render: (date) => <Text>{new Date(date).toLocaleDateString()}</Text>,
        },
        {
            title: "תאריך סיום",
            dataIndex: "endDate",
            key: "endDate",
            sorter: (a, b) => new Date(a.endDate) - new Date(b.endDate),
            render: (date) => (date ? <Text>{new Date(date).toLocaleDateString()}</Text> : <Text>טרם הסתיים</Text>),
        },
        {
            title: "סטטוס",
            dataIndex: "finished",
            key: "finished",
            sorter: (a, b) => a.finished - b.finished,
            render: (finished) => (
                <Tag className="fw-500" color={finished ? "red" : "green"}>
                    {finished ? "פרוייקט סגור" : "פרוייקט פתוח"}
                </Tag>
            ),
        },
        {
            title: "פעולות",
            key: "menu",
            dataIndex: "actions",
            align: "center",
            render: (_, row) => <CustomDropDown key={row._id} actions={menuActions} data={row} />,
        },
    ];

    return (
        <>
            <Table
                locale={{ emptyText: <EmptyData label="אין פרוייקטים להצגה" /> }}
                dataSource={projects}
                size="small"
                columns={columns}
                rowKey={(record) => record._id}
            />
        </>
    );
};

ProjectTable.propTypes = {
    projects: PropTypes.array,
    onEdit: PropTypes.func,
};

export default ProjectTable;
