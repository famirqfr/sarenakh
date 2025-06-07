import axiosInstance from "@/lib/axiosInstance";
import { UserFormData } from "../schemas/user.schema";
import { User } from "../types/user";

export const getUsers = async (): Promise<User[]> => {
  const response = await axiosInstance.get("/api/users");
  return response.data.users;
};

export const createUser = async (data: UserFormData) => {
  return axiosInstance.post("/api/users", data);
};

export const deleteUser = (id: string) => {
  return axiosInstance.delete(`/api/users/${id}`);
};

export const updateUser = (data: UserFormData) => {
  return axiosInstance.put(`/api/users/${data.id}`, data);
};
