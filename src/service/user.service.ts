import { COGNITO_DOMAIN } from "../constants/session";
import { User } from "../types/user";
import { axiosInstance } from "./axiosInstance";

export const getUserInfo = (): Promise<User> =>
  axiosInstance
    .get(`${COGNITO_DOMAIN}/oauth2/userInfo`)
    .then((res) => res.data);

type Attribute = { Name: string; Value: string };

type GetUsersData = {
  Users: [
    {
      Username: string;
      Attributes: Attribute[];
    }
  ];
};

const findAttribute = (attrs: Attribute[], name: string) =>
  attrs.find((attr) => attr.Name === name)?.Value;

export const getUsers = (): Promise<User[]> =>
  axiosInstance.get<GetUsersData>("/users").then((res) =>
    res.data.Users.map((user) => ({
      email: findAttribute(user.Attributes, "email"),
      website: findAttribute(user.Attributes, "website"),
      username: user.Username,
    }))
  );
