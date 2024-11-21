import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow, Button } from "flowbite-react";
import { useEffect, useState } from 'react';


import { getUserExpenses } from "../../Services/APIs/Expenses";
import { Expense } from '../../Types'
import { ExpenseModal } from "../ExpenseModal";

export function Dashboard() {
    const [expenses, setExpenses] = useState<(Expense)[]>([])
    const [openModal, setOpenModal] = useState<boolean>(false)
    const token = localStorage.getItem('token')
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

    return (
        <div className="overflow-x-auto">
            <div className="flex items-center justify-between mt-6">
                <h1 className="text-xl">
                    Expenses
                </h1>
                <Button className="mr-4" onClick={() => setOpenModal(true)} size="xs">Create Expense</Button>
            </div>
            <ExpenseModal isOpen={openModal} handleOnClose={() => setOpenModal(false)} onAddExpense={handleAddExpense}/>
            <Table className="">
                <TableHead>
                <TableHeadCell>Category</TableHeadCell>
                <TableHeadCell>Amount</TableHeadCell>
                <TableHeadCell>Date</TableHeadCell>
                </TableHead>
                <TableBody className="divide-y">
                    {expenses?.map((expense) => (
                        <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800" key={expense.uuid}>
                            <TableCell>{expense.category}</TableCell>
                            <TableCell>{expense.amount.toLocaleString('en-US', {
                                style: 'currency',
                                currency: 'USD'
                            })}</TableCell>
                            <TableCell>{expense.date.toString()}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
