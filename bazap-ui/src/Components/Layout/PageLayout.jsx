import { Layout, Space } from "antd";
import PropTypes from "prop-types";
import Breadcrumbs from "./Breadcrumbs";
import MainNavigation from "./Navbar/MainNavigation";
const { Content } = Layout;
const PageLayout = ({ children }) => {
    return (
        <Layout>
            <MainNavigation />
            <Content
                style={{
                    marginTop: "20px",
                    padding: "24px 76px",
                }}
            >
                <Breadcrumbs />
                {children}
            </Content>
        </Layout>
    );
};

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
export default PageLayout;
