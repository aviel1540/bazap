import { processObjectOrArray, replaceSpecialCharacters } from "./utils";

export const responseHandle = (response) => {
    // Check if response data is a string
    if (typeof response.data === "string") {
        response.data = replaceSpecialCharacters(response.data);
    } else if (typeof response.data === "object") {
        // Recursively process the object or array
        response.data = processObjectOrArray(response.data);
    }
    return response.data;
};

export const errorHandle = (error) => {
    // Handle the error
    if (error.response) {
        console.error("Server responded with an error:", error.response.data);
        throw new Error(error.response.data.message.message || "Server Error");
    } else if (error.request) {
        console.error("No response received:", error.request);
        throw new Error("No response received from the server");
    } else {
        console.error("Error in setting up the request:", error.message);
        throw new Error(error.message);
    }
};
