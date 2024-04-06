import { Layout } from "antd";
import MainNavigation from "./Navbar/MainNavigation";
const { Content } = Layout;
import PropTypes from "prop-types";

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
                {children}
            </Content>
        </Layout>
    );
};

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
export default PageLayout;
