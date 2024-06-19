import { Layout } from "antd";
import PropTypes from "prop-types";
import Breadcrumbs from "./Breadcrumbs";
import MainNavigation from "./Navbar/MainNavigation";
import { Footer } from "antd/es/layout/layout";
const { Content } = Layout;
const PageLayout = ({ children }) => {
    return (
        <Layout style={{minHeight:"100vh"}}>
            <MainNavigation />
            <Content
                style={{
                    padding: "0px 76px",
                    margin: "15px 15px",
                }}
            >
                <Breadcrumbs />
                {children}
            </Content>
            <Footer style={{ textAlign: "center", position: "sticky", bottom: "0" }}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
export default PageLayout;
