interface ICreateUser {
  name?: string;
  email: string;
  password: string;
}

interface ILoginUser {
  message?: string | null;
  name?: string | null;
  refreshToken?: string | null;
  token?: string | null;
  userId?: string | null;
}

export { ICreateUser, ILoginUser };