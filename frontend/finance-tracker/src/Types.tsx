export interface Expense {
    uuid: string;
    amount: number;
    category: string;
    date: Date
}

export interface NewExpensePayload {
    amount: number;
    category: string;
    date: string;
}
