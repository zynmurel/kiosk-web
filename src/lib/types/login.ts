
export type UserRoles = "super-admin" | "admin" | "instructor"  | "student"   | "business"

export type CredentialsType = { username:string;  role:UserRoles ; id:number; department?:string}