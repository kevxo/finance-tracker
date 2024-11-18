const URI: string = import.meta.env.VITE_API_URL
const URL: string = `${URI}/api/v1/register`

interface UserCreate {
    username: string;
    password: string;
}

export const createAccount = async (payload: UserCreate) => {
    try {
        const response = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        }

        const data = await response.json()

        return data
    } catch (err) {
        console.error(err)
    }
}
