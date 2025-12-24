let token = "";

export const setToken = (newToken: string) => {
    token = newToken;
}

export const getToken = () => token;