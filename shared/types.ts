import { Roles } from "../enums/roles.enum";

export interface SessionObj {
  data: {
    role: Roles;
    id: string;
  };
}
