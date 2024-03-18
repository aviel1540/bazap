import { Layout, theme } from "antd";
import MainNavigation from "./Navbar/MainNavigation";
const { Content, Footer } = Layout;
import PropTypes from "prop-types";

const PageLayout = ({ children }) => {
    const {
        token: { borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <MainNavigation />
            <Content
                style={{
                    marginTop: "20px",
                    padding: "0 48px",
                }}
            >
                <div
                    style={{
                        padding: 24,
                        minHeight: 380,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {children}
                </div>
            </Content>
            <Footer
                style={{
                    textAlign: "center",
                }}
            >
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
};
export default PageLayout;
