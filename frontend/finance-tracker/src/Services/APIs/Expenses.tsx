import { jwtDecode } from "jwt-decode";

export const getUserExpenses = async (token: string) => {
    const decode = jwtDecode(token);
    const userUuid = decode?.uuid;

    const url: string = `http://127.0.0.1:8000/api/v1/users/${userUuid}/expenses`

    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
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