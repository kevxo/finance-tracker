"use client";

import { Button, Label, Modal, TextInput, Datepicker } from "flowbite-react";
import { useState } from "react";

import { createUserExpense } from "../../Services/APIs/Expenses";
import { NewExpense } from "../../Types";

interface ExpenseModalProps {
  isOpen: boolean;
  handleOnClose: () => void;
  onAddExpense: (expense: NewExpense) => void;
}

export function ExpenseModal({isOpen, handleOnClose, onAddExpense}: ExpenseModalProps) {
  const [category, setCategory] = useState<string>()
  const [amount, setAmount] = useState<number>()
  const [date, setDate] = useState<Date>(new Date())
  const token = localStorage.getItem('token')

  const handleOnSubmit = async (e: any) => {
    e.preventDefault()

    if (token && amount && date && category) {
      const newExpense =  { category: category, amount: amount, date: date.toISOString().split('T')[0]}
      await createUserExpense(token, newExpense)

      onAddExpense(newExpense)
      handleOnClose()
    }
  }

  return (
    <>
      <Modal show={isOpen} size="md" popup onClose={handleOnClose}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Create new Expense</h3>
            <div>
              <div className="mb-2 block">
                <LabelWithAsterisk htmlFor="category" label="Category" />
              </div>
              <TextInput id="category" placeholder="Mortgage" required onChange={(e) => setCategory(e.target.value)}/>
            </div>
            <div>
              <div className="mb-2 block">
                <LabelWithAsterisk htmlFor="amount" label="Amount" />
              </div>
              <TextInput id="amount" type="number" placeholder="2000.00" onChange={(e) => setAmount(Number(e.target.value))} required />
            </div>
            <div>
              <div className="mb-2 block">
                <LabelWithAsterisk htmlFor="date" label="Date" />
              </div>
                <Datepicker required onChange={(e) => setDate(e || new Date())}/>
            </div>
            <div className="w-full">
              <Button onClick={(e: any) => handleOnSubmit(e)} disabled={!category || !amount}>Submit</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}

// Custom label with red asterisk for required fields
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