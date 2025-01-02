import { Card, List, Button } from "flowbite-react";
import { useEffect, useState } from 'react'

import { getCurrentBudget } from "../../Services/APIs/Budgets";
import { Budget } from '../../Types'
import { BudgetsModal } from "../BudgetsModal";
export function Budgets() {
    const [currentBudget, setCurrentBudget] = useState<Budget>()
    const [budgetUuid, setBudgetUuid] = useState<Budget["uuid"]>(currentBudget?.uuid || "");
    const [openModal, setOpenModal] = useState<boolean>(false);
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

    const handleNewBudget = (newBudget: Budget) => {
        setBudgetUuid(newBudget.uuid);
    }

    return (
        <Card href="#" className="max-w-sm">
            <BudgetsModal isOpen={openModal} handleOnClose={() => setOpenModal(false)} onNewBudget={handleNewBudget}/>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button onClick={() => setOpenModal(true)} className="w-full py-1 px-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    New Budget
                </Button>
                <Button disabled className="w-full py-1 px-2 text-xs font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600">
                    Edit Budget
                </Button>
                <Button disabled className="w-full py-1 px-2 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                    Remove Budget
                </Button>
            </div>
        </Card>
    );
}
