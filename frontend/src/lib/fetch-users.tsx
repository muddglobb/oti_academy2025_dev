import { UsersType } from "@/types/users-type";

export async function getUsers(): Promise<UsersType> {
  return {
    status: "success",
    message: "Success",
    data: {
      id: 1,
      name: "user-name",
      email: "user@example.com",
      role: "UMUM",
      type: "UMUM",
      nim: null,
      createdAt: "2025-04-22T12:00:00.000Z",
    },
  };
}
