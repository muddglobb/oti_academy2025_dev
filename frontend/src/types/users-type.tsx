  export type UsersDataType = {
    id: number,
    name: string,
    email: string,
    role: string,
    type: string,
    nim: string | null,
    createdAt: string,
  }
  export type UsersType = {
    status: string,
    message: string,
    data: UsersDataType,
  }