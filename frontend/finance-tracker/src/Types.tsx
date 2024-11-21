export interface Expense {
    uuid: string;
    amount: number;
    category: string;
    date: Date
}

export interface NewExpense {
    amount: number;
    category: string;
    date: string;
}
