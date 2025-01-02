import { jwtDecode } from "jwt-decode";

import { URI } from '../../env'

interface BudgetCreate {
    budget_amount: number;
    month: string;
}

export const getCurrentBudget = async (token: string, budgetUuid: string) => {
    const decode = jwtDecode(token);
    const userUuid = decode?.uuid;

    const url: string = `${URI}/api/v1/users/${userUuid}/budgets/${budgetUuid}`

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

export const createNewBudget = async (token: string, budgetPayload: BudgetCreate) => {
    const decode = jwtDecode(token);
    const userUuid = decode?.uuid;

    const url: string = `${URI}/api/v1/users/${userUuid}/budgets`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(budgetPayload),
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
