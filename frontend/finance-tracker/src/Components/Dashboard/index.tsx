import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button, Checkbox } from "flowbite-react";
import { useEffect, useState } from 'react';


import { deleteUserExpense, getUserExpenses } from "../../Services/APIs/Expenses";
import { Expense } from '../../Types'
import { EditExpenseModal } from "../EditExpenseModal";
import { ExpenseModal } from "../ExpenseModal";

export function Dashboard() {
    const [expenses, setExpenses] = useState<(Expense)[]>([]);
    const [openModal, setOpenModal] = useState<boolean>(false);
    const [openEditModal, setOpenEditModal] = useState<boolean>(false);

    const [checkedAllRecords, setAllCheckBoxes] = useState<boolean>(false);
    const [selectedExpenses, setSelectedExpenses] = useState<(Expense["uuid"])[]>([]);
    const token = localStorage.getItem('token');

    useEffect(() => {
        const userExpenses = async () => {
            if (token) {
                const expensesData = await getUserExpenses(token)
                setExpenses(expensesData)
            }
        }

        userExpenses()
    }, [token])

    const handleAddExpense = (newExpense: Expense) => {
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    }

    const handleUpdateExpense = (updatedExpense: Expense) => {
        setExpenses((prevExpenses) => {
            const updatedExpenses = prevExpenses.map((oldExpense) =>
                oldExpense.uuid === updatedExpense.uuid ? updatedExpense : oldExpense
            )


            return updatedExpenses
        })
    }

    const handleAllExpenses = () => {
        if (checkedAllRecords) {
            setSelectedExpenses([])
        } else {
            setSelectedExpenses(expenses.map((expense) => expense.uuid));
        }

        setAllCheckBoxes(!checkedAllRecords);
    }

    const handleExpenseToggle = (currentUuid: Expense["uuid"]) => {
        if (selectedExpenses.includes(currentUuid)) {
            setSelectedExpenses((prev) => prev.filter((uuid) => uuid != currentUuid))
        } else {
            setSelectedExpenses((prev) => [...prev, currentUuid])
        }
    }

    const handleDeleteExpense = async () => {
        if (selectedExpenses.length > 0 && token) {
            await deleteUserExpense(token, selectedExpenses)

            setExpenses((prevExpenses) => prevExpenses.filter((expense) => !selectedExpenses.includes(expense.uuid)))
            setSelectedExpenses([])

            if (checkedAllRecords) {
                setAllCheckBoxes(!checkedAllRecords)
            }
        }
    }

    return (
        <div className="overflow-x-auto">
            <div className="flex items-center justify-between mt-6">
                <h1 className="text-xl">
                    Expenses
                </h1>
                <div className="flex space-x-2 mr-12">
                    <Button onClick={() => setOpenModal(true)} size="xs">Create Expense</Button>
                    <Button onClick={() => handleDeleteExpense()} size="xs">Delete Expense(s)</Button>
                </div>
            </div>
            <ExpenseModal isOpen={openModal} handleOnClose={() => setOpenModal(false)} onAddExpense={handleAddExpense}/>
            <Table hoverable>
                <TableHead>
                <Table.HeadCell className="p-4">
                    <Checkbox checked={checkedAllRecords} onChange={() => handleAllExpenses()}/>
                </Table.HeadCell>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Amount</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
                <Table.HeadCell></Table.HeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {expenses?.map((expense) => (
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800" key={expense.uuid}>
                            <Table.Cell className="p-4">
                                <Checkbox checked={selectedExpenses.includes(expense.uuid)} onChange={() => handleExpenseToggle(expense.uuid)} />
                            </Table.Cell>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell>{expense.amount.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            })}</TableCell>
                            <TableCell>{expense.date.toString()}</TableCell>
                            <Table.Cell>
                                <a onClick={() => setOpenEditModal(true)} className="font-medium text-cyan-600 hover:underline dark:text-cyan-500">
                                    Edit
                                </a>
                            </Table.Cell>
                            <EditExpenseModal isOpen={openEditModal} handleOnClose={() => setOpenEditModal(false)} onUpdateExpense={handleUpdateExpense} expense={expense}/>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
