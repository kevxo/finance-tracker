import { Modal, Label, Button, TextInput, Datepicker } from "flowbite-react"
import { useState } from "react";
import { useDispatch } from "react-redux";

import { createNewBudget } from "../../Services/APIs/Budgets";
import { setCurrentBudgetUuid } from "../../store/slices/budgetSlice";

interface BudgetModalProps {
    isOpen: boolean;
    handleOnClose: () => void;
}


export function BudgetsModal({isOpen, handleOnClose}: BudgetModalProps) {
    const [budgetAmount, setBudgetAmount] = useState<number>();
    const [month, setMonth] = useState<Date>(new Date());
    const dispatch = useDispatch();
    const token = localStorage.getItem('token');

    const handleOnCreate = async (e: any) => {
        e.preventDefault();
        if (token && budgetAmount && month) {
            const newBudgetPayload = {
                budget_amount: budgetAmount,
                month: month.toISOString().split('T')[0]
            }

            const newBudget = await createNewBudget(token, newBudgetPayload);

            dispatch(setCurrentBudgetUuid(newBudget.uuid));
            localStorage.setItem("currentBudgetUuid", newBudget.uuid);
            handleOnClose();
        }
    }

    return (
        <>
            <Modal show={isOpen} size="md" popup onClose={handleOnClose}>
                <Modal.Header />
                    <Modal.Body>
                        <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create new Budget</h3>
                            <div>
                                <div className="mb-2 block">
                                <LabelWithAsterisk htmlFor="amount" label="Amount" />
                                </div>
                                <TextInput id="amount" type="number" placeholder="2000.00" min="1" onChange={(e) => setBudgetAmount(Number(e.target.value))} required />
                            </div>
                            <div>
                                <div className="mb-2 block">
                                <LabelWithAsterisk htmlFor="date" label="Date" />
                                </div>
                                <Datepicker required onChange={(e) => setMonth(e || new Date())}/>
                            </div>
                            <div className="w-full">
                                <Button onClick={(e: any) => handleOnCreate(e)}>Create</Button>
                            </div>
                        </div>
                    </Modal.Body>
            </Modal>
        </>
    )
}


interface LabelWithAsteriskProps {
    htmlFor: string;
    label: string;
  }

  const LabelWithAsterisk: React.FC<LabelWithAsteriskProps> = ({ htmlFor, label }) => (
    <Label htmlFor={htmlFor}>
      {label}
      <span className="text-red-500"> *</span>
    </Label>
  );
