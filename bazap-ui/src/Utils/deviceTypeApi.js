import axios from "axios";

const subscriberApi = axios.create({ baseURL: "http://localhost:3000/api/" });

export const getAllSubscribers = async () => {
    const response = await subscriberApi.get("subscriber");
    return response.data;
};

export const addSubscriber = async (subscriber) => {
    try {
        return await subscriberApi.post("subscriber/add-new-subscriber", subscriber);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const editSubscriber = async (subscriber) => {
    try {
        return await subscriberApi.patch("subscriber/edit-subscriber", subscriber);
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const getSubscriberById = async (request) => {
    try {
        const [_, subscriberId] = request.queryKey;
        return await subscriberApi.get("subscriber/get-subscriber-by-id", { params: { subscriberId } });
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};

export const deleteSubscriber = async (id) => {
    try {
        return await subscriberApi.delete("subscriber/delete-subscriber", { data: { subscriberId: id } });
    } catch (error) {
        throw new Error(error.response.data.message);
    }
};
