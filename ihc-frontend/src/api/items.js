import apiClient from "./apiClient";

export const getItems = async () => {
  const { data } = await apiClient.get("/items");
  return data;
};

export const getFilterOptions = async () => {
  const { data } = await apiClient.get("/items/filters");
  return data;
};

export const createItem = async (formData) => {
  const { data } = await apiClient.post("/items", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};