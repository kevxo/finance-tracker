import { Card, List, Button } from "flowbite-react";
import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from "react-redux";

import { getCurrentBudget } from "../../Services/APIs/Budgets";
import { RootState } from "../../store";
import { setCurrentBudgetUuid, clearCurrentBudgetUuid } from "../../store/slices/budgetSlice";
import { Budget } from '../../Types'
import { BudgetsModal } from "../BudgetsModal";
import { EditBudgetsModal } from "../EditBudgetsModal";
export function Budgets() {
    const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
    const budgetUuid = useSelector((state: RootState) => state.budget.currentBudgetUuid);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openBudgetEditModal, setOpenEditBudgetModal] = useState<boolean>(false);
    const token = localStorage.getItem('token');
    const dispatch = useDispatch();

    useEffect(() => {
        const initializeBudgetUuid = async () => {
            if (!budgetUuid && token) {
                const savedBudgetUuid = localStorage.getItem("currentBudgetUuid");

                if (savedBudgetUuid) {
                    dispatch(setCurrentBudgetUuid(savedBudgetUuid));
                }
            }
        };

        initializeBudgetUuid();
    }, [budgetUuid, token, dispatch]);

    useEffect(() => {
        const retrieveCurrentBudget = async () => {
            if (token && budgetUuid) {
                try {
                    const budget = await getCurrentBudget(token, budgetUuid);
                    setCurrentBudget(budget);

                } catch (error) {
                    console.error("Failed to fetch current budget:", error);
                    setCurrentBudget(null);
                }
            }
        }

        retrieveCurrentBudget();
    }, [budgetUuid, token])

    const clearCurrentBudget = () => {
        dispatch(clearCurrentBudgetUuid())
        localStorage.removeItem("currentBudgetUuid")
        setCurrentBudget(null);
    }

    const handleUpdateBudget = (updatedBudget: Budget) => {
        setCurrentBudget(updatedBudget);
    }

    return (
        <Card href="#" className="max-w-sm">
            <BudgetsModal isOpen={openModal} handleOnClose={() => setOpenModal(false)}/>
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                Current Budget
            </h5>
            <List>
                <List.Item>
                    Budget Amount: $ { currentBudget?.budget_amount || '-' }
                </List.Item>
                <List.Item>
                    Budget Month: { currentBudget?.month || '-' }
                </List.Item>
                <List.Item>
                    Expenses Total: $ { currentBudget?.expenses_total || '-' }
                </List.Item>
                <List.Item>
                    Remaining Budget: $ { currentBudget?.remaining_budget || '-' }
                </List.Item>
            </List>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <Button onClick={() => setOpenModal(true)} className="w-full py-1 px-2 text-xs font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    New Budget
                </Button>
                <Button disabled={currentBudget ? false : true} onClick={() => setOpenEditBudgetModal(true)} className="w-full py-1 px-2 text-xs font-medium text-white bg-yellow-500 rounded-md hover:bg-yellow-600">
                    Edit Budget
                </Button>
                <EditBudgetsModal isOpen={openBudgetEditModal} handleOnClose={() => setOpenEditBudgetModal(false)} budget={currentBudget} onUpdateBudget={handleUpdateBudget}/>
                <Button disabled={currentBudget ? false : true} onClick={clearCurrentBudget} className="w-full py-1 px-2 text-xs font-medium text-white bg-red-600 rounded-md hover:bg-red-700">
                    Remove Budget
                </Button>
            </div>
        </Card>
    );
}
