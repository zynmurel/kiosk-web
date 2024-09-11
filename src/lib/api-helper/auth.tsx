import axios from "axios";
import { cookieVariables } from "./cookie-variables";

const logout = async ({cookie_variable, login_route}:{cookie_variable:string; login_route:string}) => {
    await axios.post('/api/auth/logout', { cookie_variable })
    window.location.href = login_route;
}

export const loginAdmin = async ({
    username,
    password,
    role
}: {
    username: string;
    password: string;
    role: string;
}) => {
    const data =  await axios.post('/api/auth/login-admin', {
        username,
        password,
        role
    });
    localStorage.setItem("user-admin", JSON.stringify(data.data.user || null))
    return data
}

export const logoutAdmin = async () => {
    await logout({
        cookie_variable :cookieVariables.admin,
        login_route:'/login-admin'
    })
}