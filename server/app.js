const dotenv = require("dotenv");
const mongoose = require("mongoose");
const express = require("express");
const fs = require("fs");
const cors = require("cors");
const deviceRouter = require("./routers/deviceRouter");
const projectRouter = require("./routers/projectRouter");
const deviceTypeRouter = require("./routers/deviceTypeRouter");
const technicianRouter = require("./routers/technicianRouter");
const unitsRouter = require("./routers/unitsRouter");
const voucherRouter = require("./routers/voucherRouter");
const passwordRouter = require("./routers/passwordRouter");
const accessoryRouter = require("./routers/accessoriesRouter")
const divisionRouter = require("./routers/divisionRouter")
const brigadeRouter = require("./routers/brigadeRouter")

// const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const customCss = fs.readFileSync(process.cwd() + "/documentation/swagger.css", "utf8");

const swaggerDocument = require("./documentation/openapi.json");
const { dataFix } = require("./loadScripts");
dotenv.config();
const app = express();
console.log(process.env.URI);
mongoose
    .connect(process.env.URI)
    .then(async () => {
        console.log("Connected to DataBase");
        // passwordController.checkPasswordsExistence();
        // await load.run(); // Run the load scripts after successful database connection
        await dataFix();
    })
    .catch((err) => console.log(err.message));

app.use(express.json());
// app.use(cors({ credentials: true, origin: URL }));

app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
        customCss,
        customSiteTitle: "Bazap",
    }),
);
app.use(cors());
app.use("/api/device/", deviceRouter);
app.use("/api/accessory/", accessoryRouter);
app.use("/api/project/", projectRouter);
app.use("/api/deviceType/", deviceTypeRouter);
app.use("/api/technician/", technicianRouter);
app.use("/api/units/", unitsRouter);
app.use("/api/voucher/", voucherRouter);
app.use("/api/password/", passwordRouter);
app.use("/api/division/", divisionRouter);
app.use("/api/brigade/", brigadeRouter);


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Connection Successful!");
});
