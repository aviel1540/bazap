import { Outlet } from "react-router-dom";
import MainNavigation from "./Navbar/MainNavigation";
import { Container } from "react-bootstrap";

function RootLayout() {
    return (
        <>
            <MainNavigation />
            <main>
                <Container className="my-10">
                    <Outlet />
                </Container>
            </main>
        </>
    );
}

export default RootLayout;
