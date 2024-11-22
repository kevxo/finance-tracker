import { URI } from '../../env'
const URL: string = `${URI}/api/v1/login`

interface UserLogin {
    username: string,
    password: string
}

export const loginUser = async (credentials: UserLogin) => {
    try {
        const response = await fetch(URL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({ username: credentials.username, password: credentials.password})
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        localStorage.setItem('token', data.access_token);

    } catch (err) {
        console.error(err)
    }
}
