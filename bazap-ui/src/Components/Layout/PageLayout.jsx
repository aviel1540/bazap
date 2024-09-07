import { Flex, Layout, Tag } from "antd";
import PropTypes from "prop-types";
import Breadcrumbs from "./Breadcrumbs";
import MainNavigation from "./Navbar/MainNavigation";
import { Footer } from "antd/es/layout/layout";
const version = import.meta.env.VITE_VERSION;
const { Content } = Layout;

const PageLayout = ({ children }) => {
    return (
        <>
            <Layout>
                <MainNavigation />
                <Content className="flex-grow-1 px-20 px-lg-10 px-md-5 my-3">
                    <Breadcrumbs />
                    {children}
                </Content>
                <Footer className="py-2">
                    <Flex justify="center" align="end" gap={5}>
                        <div>מוצר זה פותח ע&quot;י ניר קוסן ואביאל יעקב ©{new Date().getFullYear()}</div>
                        <Tag className="fs-8" color="processing">
                            {version}
                        </Tag>
                    </Flex>
                </Footer>
            </Layout>
        </>
    );
};

PageLayout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default PageLayout;
