import { JwtPayload } from 'jsonwebtoken'

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

export interface NewBudget {
    amount: number;
    date: Date;
}

export interface Budget {
    uuid: string;
    budget_amount: number;
    month: string;
    expenses_total: number;
    remaining_budget: number;
}

export interface CustomJwtPayload extends JwtPayload {
    uuid: string;
}
