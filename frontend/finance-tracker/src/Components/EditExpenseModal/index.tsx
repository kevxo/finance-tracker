"use client";

import { Button, Label, Modal, TextInput, Datepicker } from "flowbite-react";
import { useState } from "react";

import { ExpenseUpdateBody, updateUserExpense } from "../../Services/APIs/Expenses";
import { Expense } from "../../Types";

interface EditExpenseModalProps {
  isOpen: boolean;
  handleOnClose: () => void;
  onUpdateExpense: (expense: Expense) => void;
  expense: Expense;
}

export function EditExpenseModal({isOpen, handleOnClose, onUpdateExpense, expense}: EditExpenseModalProps) {
  const [category, setCategory] = useState<string>()
  const [amount, setAmount] = useState<number>()
  const [date, setDate] = useState<Date>(new Date())
  const token = localStorage.getItem('token')

  const handleOnUpdate = async (e: any) => {
    e.preventDefault()

    let updateExpensePayload: ExpenseUpdateBody = {}

    if (token) {
        if ( category && category != expense.category) {
            updateExpensePayload.category = category
        } else if (amount && amount != expense.amount) {
            updateExpensePayload.amount = amount
        } else if (date != expense.date) {
            updateExpensePayload.date = date.toISOString().split('T')[0]
        }


      const updatedExpense = await updateUserExpense(token, updateExpensePayload, expense.uuid)

      onUpdateExpense(updatedExpense)
      handleOnClose()
    }
  }

  return (
    <>
      <Modal show={isOpen} size="md" popup onClose={handleOnClose}>
        <Modal.Header />
        <Modal.Body>
          <div className="space-y-6">
            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Edit Expense</h3>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="category" value="Category" />
              </div>
              <TextInput id="category" placeholder={expense.category} onChange={(e) => setCategory(e.target.value)}/>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="amount" value="Amount" />
              </div>
              <TextInput id="amount" type="number" placeholder={expense.amount.toString()} min="1" onChange={(e) => setAmount(Number(e.target.value))}/>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="date" value="Date" />
              </div>
                <Datepicker placeholder={new Date(`${expense.date}T00:00:00`).toString()} onChange={(e) => setDate(e || new Date())}/>
            </div>
            <div className="w-full">
              <Button onClick={(e: any) => handleOnUpdate(e)} disabled={!category && !amount}>Update</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
