require("dotenv").config();
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
const passwordController = require("./controllers/PasswordController");

// const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const customCss = fs.readFileSync(process.cwd() + "/documentation/swagger.css", "utf8");

const swaggerDocument = require("./documentation/openapi.json");

// mongoose.set("strictQuery", true);
const app = express();

mongoose
    .connect("mongodb://mongo-db/BazapProduction")
    .then(() => {
        console.log("Connected to DataBase");
        passwordController.checkPasswordsExistence();
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
app.use("/api/project/", projectRouter);
app.use("/api/deviceType/", deviceTypeRouter);
app.use("/api/technician/", technicianRouter);
app.use("/api/units/", unitsRouter);
app.use("/api/voucher/", voucherRouter);
app.use("/api/password/", passwordRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log("Connection Successful!");
});
