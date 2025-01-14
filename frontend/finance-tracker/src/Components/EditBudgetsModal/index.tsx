import { Modal, Label, Button, TextInput } from "flowbite-react"
import { useState } from "react";

import { BudgetUpdateBody, updateUserBudget } from "../../Services/APIs/Budgets"
import { Budget } from "../../Types";

interface EditBudgetProps {
    isOpen: boolean;
    handleOnClose: () => void;
    onUpdateBudget: (budget: Budget) => void;
    budget: Budget | null;
}

export function EditBudgetsModal ({isOpen, handleOnClose, onUpdateBudget, budget}: EditBudgetProps) {
    const [budgetAmount, setBudgetAmount] = useState<number>();

    const token = localStorage.getItem('token');

    const handleUpdateBudget = async (e: any) => {
        e.preventDefault();

        let updateBudgetPayload: BudgetUpdateBody = {}

        if (token && budget) {
            if (budgetAmount && budgetAmount != budget.budget_amount) {
                updateBudgetPayload.budget_amount = budgetAmount
            }

            const updatedBudget = await updateUserBudget(token, updateBudgetPayload, budget.uuid);

            onUpdateBudget(updatedBudget);
            handleOnClose();
        }
    }


    return (
        <>
            <Modal show={isOpen} size="md" popup onClose={handleOnClose}>
                <Modal.Header />
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium text-gray-900 dark:text-white">Update Budget</h3>
                        <div>
                            <div className="mb-2 block">
                            <Label htmlFor="amount" value="Budget Amount" />
                            </div>
                            <TextInput id="amount" type="number" placeholder={budget?.budget_amount.toString()} min="1" onChange={(e) => setBudgetAmount(Number(e.target.value))} required />
                        </div>
                        <div className="w-full">
                            <Button disabled={!budgetAmount} onClick={(e: any) => handleUpdateBudget(e)}>Update Budget</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}
