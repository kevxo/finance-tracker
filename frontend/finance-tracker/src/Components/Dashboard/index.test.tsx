import { fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import '@testing-library/jest-dom';

import { Dashboard } from './index'
import { getUserExpenses, createUserExpense } from '../../Services/APIs/Expenses'

jest.mock('../../Services/APIs/Expenses')
jest.mock('../../env', () => ({
    URI: 'http://mock-api.test',
}));

describe('Dashboard', () => {
    beforeEach(() => {
        jest.spyOn(Storage.prototype, 'setItem');

        const localStorageMock = (() => {
            let store: { [key: string]: string } = {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiVXNlck1vY2tVVUlEIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjg2MDAyNzAwfQ._V9T0XpD0QOV_pFymENcHZDtkDriE6jxmrW8fJaxCPE',
            };

            return {
                getItem: (key: string) => store[key] || null,
                setItem: (key: string, value: string) => {
                    store[key] = value.toString();
                },
                removeItem: (key: string) => {
                    delete store[key];
                },
                clear: () => {
                    store = {};
                },
            };
        })();

        Object.defineProperty(window, 'localStorage', {
            value: localStorageMock,
        });
    })


    it('should render', async () => {
        render(<Dashboard />)

        await waitFor(() => {
            expect(screen.getByRole('heading', {
                name: /expenses/i
            })).toBeDefined()
        })
    })

    it('should list all expenses', async () => {
        (getUserExpenses as jest.Mock).mockResolvedValueOnce([{
            amount: 200,
            category: 'Groceries',
            date: '2024-10-10',
            uuid: 'TESTUUID'
        }])
        render(<Dashboard />)

        await waitFor(() => {
            expect(screen.getByText('Amount')).toBeDefined()
            expect(screen.getByText('Category')).toBeDefined()
            expect(screen.getByText('Date')).toBeDefined()

            expect(screen.getByText('Groceries')).toBeInTheDocument();
            expect(screen.getByText('$200.00')).toBeInTheDocument();
            expect(screen.getByText('2024-10-10')).toBeInTheDocument();
        })
    })

    it('should click create expense', async () => {
        render(<Dashboard />)

        await waitFor(async () => {
            const createExpenseBttn = screen.getByRole('button', {
                name: /create expense/i
            })

            expect(createExpenseBttn).toBeVisible()

            await fireEvent.click(createExpenseBttn)

            expect(screen.getByRole('heading', {
                name: /create new expense/i
            })).toBeVisible()

            const dialog = screen.getByRole('dialog');

            expect(within(dialog).getByText(/category/i)).toBeVisible()
            expect(within(dialog).getByText(/amount/i)).toBeVisible()
            expect(within(dialog).getByText(/date/i)).toBeVisible()

            expect(screen.getByRole('button', {
                name: /submit/i
            })).toBeDisabled()
        })
    })

    it('should be able to close modal', async () => {
        render(<Dashboard />)

        await waitFor(async () => {
            const createExpenseBttn = screen.getByRole('button', {
                name: /create expense/i
            })

            expect(createExpenseBttn).toBeVisible()

            await fireEvent.click(createExpenseBttn)

            const header = screen.getByRole('heading', {
                name: /create new expense/i
            })

            await fireEvent.click(screen.getByRole('button', {
                name: /close/i
            }))

            expect(header).not.toBeVisible()
        })
    })

    it('should be able to create expense', async () => {
        (getUserExpenses as jest.Mock).mockResolvedValueOnce([]);

        (createUserExpense as jest.Mock).mockResolvedValueOnce({
            amount: 120,
            category: 'Internet',
            date: new Date(),
            uuid: 'TESTUUID'
        });

        render(<Dashboard />)

        await waitFor(async () => {
            const createExpenseBttn = screen.getByRole('button', {
                name: /create expense/i
            })

            expect(createExpenseBttn).toBeVisible()

            await fireEvent.click(createExpenseBttn)

            const category = screen.getByRole('textbox', {
                name: /category \*/i
            })
            const amount = screen.getByRole('spinbutton', {
                name: /amount \*/i
            })

            await fireEvent.change(category, {target: {value: 'Internet'}})
            await fireEvent.change(amount, {target: {value: '120'}})

            expect(category).toHaveValue('Internet')

            expect(amount).toHaveValue(120)

            const submitButton = screen.getByRole('button', {
                name: /submit/i
            })

            await fireEvent.click(submitButton)
        })


       expect(screen.getByText("Internet")).toBeVisible()
       expect(screen.getByText("$120.00")).toBeVisible()
    })
})
