type ILoginRecords = Record<string, ILogin[]>;

interface ILogin {
  id: string;
  email: string;
  password: string;
}

export { ILoginRecords, ILogin };
