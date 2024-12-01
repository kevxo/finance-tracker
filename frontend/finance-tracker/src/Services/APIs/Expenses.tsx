import { jwtDecode } from "jwt-decode";

import { URI } from '../../env'
import { Expense } from "../../Types";

interface ExpenseCreateBody {
    amount: number;
    category: string;
    date: string;
}

interface DeleteExpensesBody {
    uuids: string[];
}

export interface ExpenseUpdateBody {
    amount?: number;
    category?: string;
    date?: string;
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

export const updateUserExpense = async (token: string, payload: ExpenseUpdateBody, expenseUuid: string) => {
    const decode = jwtDecode(token);
    const userUuid = decode?.uuid;

    const url: string = `${URI}/api/v1/users/${userUuid}/expenses/${expenseUuid}`

    try {
        const response = await fetch(url, {
            method: 'PATCH',
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

export const deleteUserExpense = async (token: string, uuids: (Expense["uuid"])[]) => {
    const decode = jwtDecode(token);
    const userUuid = decode?.uuid;

    const url: string = `${URI}/api/v1/users/${userUuid}/expenses`

    const payload: DeleteExpensesBody = {
        uuids: uuids
    }

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

    } catch (err) {
        console.error(err);
    }
}
