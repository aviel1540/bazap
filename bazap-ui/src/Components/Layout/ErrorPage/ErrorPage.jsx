import { Box, CardContent, CardHeader, Container, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import PageLayout from "../PageLayout";

const ErrorPage = () => {
    return (
        <>
            <PageLayout>
                <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) => (theme.palette.mode === "light" ? theme.palette.grey[100] : theme.palette.grey[900]),
                        flexGrow: 1,
                        height: "100vh",
                        overflow: "auto",
                    }}
                >
                    <Container maxWidth="lg" sx={{ mt: 15, mb: 4 }}>
                        <Box width={1 / 2} marginX={"auto"}>
                            <Box textAlign="center" fontWeight="600">
                                <Card>
                                    <CardHeader title="אופס!" />
                                    <CardContent>
                                        <Typography>נראה שהגעת לאתר שלא קיים או שאין לך גישה אליו.</Typography>
                                    </CardContent>
                                </Card>
                            </Box>
                        </Box>
                    </Container>
                </Box>
            </PageLayout>
        </>
    );
};

export default ErrorPage;
