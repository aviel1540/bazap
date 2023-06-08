require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");
const deviceRouter = require("./routers/deviceRouter");
const projectRouter = require("./routers/projectRouter");

// const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const customCss = fs.readFileSync(
    process.cwd() + "/documentation/swagger.css",
    "utf8"
);

const swaggerDocument = require("./documentation/openapi.json");


// mongoose.set("strictQuery", true);
const app = express();


mongoose.connect(process.env.URI)
    .then(() => console.log("Connected to DataBase"))
    .catch((err) => console.log(err.message));


app.use(express.json());
// app.use(cors({ credentials: true, origin: URL }));


app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        customCss,
        customSiteTitle: "Bazap",
    })
);

app.use("/api/device/", deviceRouter);
app.use("/api/project/", projectRouter);



const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Connection Successful!");
});