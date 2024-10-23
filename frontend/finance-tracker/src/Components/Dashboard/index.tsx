import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import React, { useEffect, useState } from 'react';


import { getUserExpenses } from "../../Services/APIs/Expenses";
import { Expense } from '../../Types'

export function Dashboard() {
    const [expenses, setExpenses] = useState<[Expense] | []>([])
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

    return (
        <div className="overflow-x-auto">
            <h1 className="text-xl">Expenses</h1>
            <Table>
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
