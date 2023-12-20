import { useState } from "react";
import Card from "@mui/material/Card";
import { Box, CardHeader, FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function Home() {
    const [yearFilter, setYearFilter] = useState("2023");
    const handleYearChange = (event) => {
        let selectedYear = event.target.value;
        setYearFilter(selectedYear);
        alert(selectedYear);
    };
    return (
        <Card>
            <CardHeader
                action={
                    <Box>
                        <FormControl fullWidth size="small">
                            <InputLabel id="year_filter_label">שנה</InputLabel>
                            <Select labelId="year_filter_label" id="year_filter" value={yearFilter} label="שנה" onChange={handleYearChange}>
                                <MenuItem value={2023}>2023</MenuItem>
                                <MenuItem value={2022}>2022</MenuItem>
                                <MenuItem value="all">הכל</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                }
                titleTypographyProps={{ variant: "h5" }}
                title="פרוייקטים סגורים"
            />
        </Card>
    );
}

export default Home;
