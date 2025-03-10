import axios from "axios";

const API_URL = "http://localhost:8080/";

const getAuthToken = () => localStorage.getItem("token");

export const signIn = async(username, password) => {
    const response = await axios.post(`${API_URL}api/auth/public/signin`, {
        username,
        password
    });

    if (response.data.jwtToken) {
        localStorage.setItem("token", response.data.jwtToken);
    }
    return response.data;
}

export const signUp = async({ username, email, password }) => {
    const response = await axios.post(`${API_URL}api/auth/public/signup`, {
        username,
        email,
        password,
        role: ["user"],
    });

    return response.data;
}

export const getUserDetails = async() => {
    try {
        const response = await axios.get(`${API_URL}api/auth/user`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            },
        });
        return response.data;
    } catch (error) {
        console.log("Error while fetching user details", error);
        throw error;
    }
}

export const getCurrentUsername = async() => {
    try {
        const response = await axios.get(`${API_URL}api/auth/username`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`
            },
        });

        return response.data;
    } catch (error) {
        console.log("Error while fetching username", error);
        throw error;
    }
}

export const forgotPassword = async(email) => {
    try {
        const response = await axios.post(`${API_URL}api/auth/public/forgot-password`,
            new URLSearchParams({ email }), {
                headers: {
                    Authorization: `Bearer ${getAuthToken()}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        );

        return response.data;
    } catch (error) {
        console.log("Error sending forgot password email", error);
        throw error;
    }
}

export const resetPassword = async(token, newPassword) => {
    try {
        const params = new URLSearchParams();
        params.append("token", token);
        params.append("newPassword", newPassword);

        const response = await axios.post(`${API_URL}api/auth/public/reset-password`, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });
    } catch (error) {
        console.log("Error resetting password", error);
        throw error;
    }
}

// Api to get CSRF token
const getCsrfToken = async() => {
    try {
        const response = await axios.get(`${API_URL}api/csrf-token`, {
            withCredentials: true,
        });

        return response.data;
    } catch (error) {
        console.log("Error while fetching csrf token".error);
        throw error;
    }
}

export const enable2FA = async() => {
    try {
        const response = await axios.post(`${API_URL}api/auth/enable-2fa`, {}, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            }
        });

        console.log("QR Code", response.data);
        return response.data;
    } catch (error) {
        console.log("Error while enabling 2FA", error);
        throw error;
    }
}

export const disable2FA = async() => {
    try {
        const response = await axios.post(`${API_URL}api/auth/disable-2fa`, {}, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        console.log("Disable 2FA");
        return response.data;
    } catch (error) {
        console.log("Error while disabling 2FA", error);
        throw error;
    }
}

export const verify2FA = async(code) => {
    try {

        const formData = new URLSearchParams();
        formData.append("code", code);
        const response = await axios.post(`${API_URL}api/auth/verify-2fa`, formData, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
                "Content-Type": "application/x-www-form-urlencoded",
            },

        });
        return response.data;
    } catch (error) {
        console.log("Error while verifying 2FA", error);
        throw error;
    }
}

export const get2FAStatus = async() => {
    try {
        const response = await axios.get(`${API_URL}api/auth/user/2fa-status`, {
            headers: {
                Authorization: `Bearer ${getAuthToken()}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log("Error while fetching 2FA status", error);
        throw error;
    }
}

export const verify2FALogin = async(code) => {
    try {
        const jwtToken = localStorage.getItem("token");

        if (!jwtToken) {
            throw new Error("JWT token not found. Please log in.");
        }

        const formData = new URLSearchParams();
        formData.append("code", code);
        formData.append("jwtToken", jwtToken);

        const response = await axios.post(`${API_URL}api/auth/public/verify-2fa-login`, formData, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
        });

        return response.data;
    } catch (error) {
        console.log("Error while verifying 2FA login", error);
        throw error;
    }
}

export const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
};

// dummy api
export const updateUserDetails = async(formData) => {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts/1", {
            method: "PUT", // Simulating an update
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if (!response.ok) {
            throw new Error("Failed to update user details");
        }

        return await response.json();
    } catch (error) {
        console.error("Update failed:", error);
        throw error;
    }
};