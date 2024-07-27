import { Table, Tag, Typography } from "antd";
import EmptyData from "../../Components/UI/EmptyData";
import { Link } from "react-router-dom";
const { Text } = Typography;
import PropTypes from "prop-types";

const ProjectTable = ({ projects }) => {
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
    ];

    return (
        <>
            <Table
                locale={{ emptyText: <EmptyData label="אין פרוייקטים להצגה" /> }}
                dataSource={projects}
                columns={columns}
                rowKey={(record) => record._id}
            />
        </>
    );
};

ProjectTable.propTypes = {
    projects: PropTypes.array,
};

export default ProjectTable;
