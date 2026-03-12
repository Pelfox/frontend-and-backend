export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoggedUser extends User {
  access_token: string;
  refresh_token: string;
}

export interface Product {
  id: string;
  title: string;
  category: string;
  description: string;
  price: number;
}
