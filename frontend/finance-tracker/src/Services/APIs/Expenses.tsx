import { jwtDecode } from "jwt-decode";

const URI: string = import.meta.env.VITE_API_URL

interface ExpenseCreateBody {
    amount: number;
    category: string;
    date: string;
}

export const getUserExpenses = async (token: string) => {
    const decode = jwtDecode(token);
    const userUuid = decode?.uuid;

    const url: string = `${URI}/api/v1/users/${userUuid}/expenses`

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

export const createUserExpense = async (token: string, payload: ExpenseCreateBody) => {
    const decode = jwtDecode(token);
    const userUuid = decode?.uuid;

    const url: string = `${URI}/api/v1/users/${userUuid}/expenses`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        const data = await response.json();

        return data;
    } catch (err) {
        console.error(err);
    }
}
