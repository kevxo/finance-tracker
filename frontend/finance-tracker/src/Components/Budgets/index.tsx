import { Card, List } from "flowbite-react";
import { useEffect, useState } from 'react'

import { getCurrentBudget } from "../../Services/APIs/Budgets";

interface Budget {
    uuid: string;
    budget_amount: number;
    month: string;
    expenses_total: number;
    remaining_budget: number;
}

export function Budgets() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [budgetUuid, setBudgetUuid] = useState<Budget["uuid"]>()
    const [currentBudget, setCurrentBudget] = useState<Budget>()
    const token = localStorage.getItem('token');

    useEffect(() => {
        const retrieveCurrentBudget = async () => {
            if (!currentBudget && token && budgetUuid) {
                const budget = await getCurrentBudget(token, budgetUuid);
                setCurrentBudget(budget);
            }
        }

        retrieveCurrentBudget();
    }, [budgetUuid, currentBudget, token])

    return (
        <Card href="#" className="max-w-sm">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Current Budget
            </h5>
            <List>
                <List.Item>
                    Budget Amount: { currentBudget?.budget_amount || '-' }
                </List.Item>
                <List.Item>
                    Budget Month: { currentBudget?.month || '-' }
                </List.Item>
                <List.Item>
                    Expenses Total: { currentBudget?.expenses_total || '-' }
                </List.Item>
                <List.Item>
                    Remaining Budget: { currentBudget?.remaining_budget || '-' }
                </List.Item>
            </List>
        </Card>
    );
}
