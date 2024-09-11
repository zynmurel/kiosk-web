import axios from "axios";

export const logoutAdmin = async () => {
    await axios.post('/api/auth/logout', { cookie_variable: 'learn-it-session-admin-token' })
    window.location.href = '/login-admin';
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