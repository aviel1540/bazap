import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";

import { UserAlertProvider } from "./Components/store/UserAlertContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <UserAlertProvider>
            <App />
        </UserAlertProvider>
    </React.StrictMode>,
);
