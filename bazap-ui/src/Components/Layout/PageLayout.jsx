import { Layout } from "antd";
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
                    padding: "0px 76px",
                    margin: "15px 0px",
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
