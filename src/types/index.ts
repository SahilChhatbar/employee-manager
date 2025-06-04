export interface Employee {
  uid: string;
  name: string;
  email: string;
  empID: string;
  createdAt: Date;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  empID: string;
}

export interface LoginData {
  email: string;
  password: string;
}
