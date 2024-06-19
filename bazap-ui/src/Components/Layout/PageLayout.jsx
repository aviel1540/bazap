import { Layout } from "antd";
import PropTypes from "prop-types";
import Breadcrumbs from "./Breadcrumbs";
import MainNavigation from "./Navbar/MainNavigation";
import { Footer } from "antd/es/layout/layout";
const { Content } = Layout;
const PageLayout = ({ children }) => {
    return (
        <>
            <Layout>
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
            </Layout>
            <Footer style={{ textAlign: "center", position: "sticky", bottom: "0" }}>
                מוצר זה פותח ע&quot;י ניר קוסן ואביאל יעקב ©{new Date().getFullYear()}
            </Footer>
        </>
    );
};

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
export default PageLayout;
