import { fireEvent, render, screen, waitFor, within} from '@testing-library/react'
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';

import { Dashboard } from './index'
import { getCurrentBudget, createNewBudget, updateUserBudget } from '../../Services/APIs/Budgets';
import { getUserExpenses, createUserExpense, deleteUserExpense, updateUserExpense } from '../../Services/APIs/Expenses'

jest.mock('../../Services/APIs/Expenses', () => ({
    getUserExpenses: jest.fn(),
    deleteUserExpense: jest.fn(),
    createUserExpense: jest.fn(),
    updateUserExpense: jest.fn(),
}))
jest.mock('../../Services/APIs/Budgets')
jest.mock('../../env', () => ({
    URI: 'http://mock-api.test',
}));

const mockStore = configureMockStore();
const store = mockStore({
  budget: { currentBudgetUuid: 'mock-uuid' }
});

describe('Dashboard', () => {
    beforeEach(() => {
        jest.spyOn(Storage.prototype, 'setItem');

        const localStorageMock = (() => {
            let store: { [key: string]: string } = {
                token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiVXNlck1vY2tVVUlEIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjg2MDAyNzAwfQ._V9T0XpD0QOV_pFymENcHZDtkDriE6jxmrW8fJaxCPE',
                currentBudgetUuid: 'mock-uuid'
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


        (getCurrentBudget as jest.Mock).mockResolvedValueOnce({
            uuid: "mock-uuid",
            budget_amount: 300,
            month: "2025-01-01",
            expenses_total: 200,
            remaining_budget: 100
        })
        jest.clearAllMocks();
    })


    it('should render', async () => {
        (getUserExpenses as jest.Mock).mockResolvedValueOnce([{
            amount: 200,
            category: 'Groceries',
            date: '2024-10-10',
            uuid: 'TESTUUID'
        }])
        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByRole('heading', {
                name: /expenses/i
            })).toBeDefined()
        })
    })

    it('should list all expenses', async () => {
        (getUserExpenses as jest.Mock).mockResolvedValueOnce({
            items: [{
                amount: 200,
                category: 'Groceries',
                date: '2024-10-10',
                uuid: 'TESTUUID'
            }],
            pages: 1
        })
        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

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
        (getUserExpenses as jest.Mock).mockResolvedValueOnce({
            items: [],
            pages: 1
        })
        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

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
        (getUserExpenses as jest.Mock).mockResolvedValueOnce({
            items: [],
            pages: 1
        })
        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

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
        (getUserExpenses as jest.Mock).mockResolvedValueOnce((getUserExpenses as jest.Mock).mockResolvedValueOnce({
            items: [],
            pages: 1
        }));

        (createUserExpense as jest.Mock).mockResolvedValueOnce({
            amount: 120,
            category: 'Internet',
            date: new Date(),
            uuid: 'TESTUUID'
        });

        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

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

    it('should be able to delete expense', async () => {
        (getUserExpenses as jest.Mock).mockResolvedValueOnce({
            items: [
              {
                amount: 200,
                category: 'Groceries',
                date: '2024-10-10',
                uuid: 'TESTUUID',
              },
            ],
            pages: 1,
          });

        (deleteUserExpense as jest.Mock).mockResolvedValueOnce({
            data: 'Deleted successfully',
        });

        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Groceries')).toBeVisible();
        });

        const checkbox = screen.getAllByRole('checkbox')[0];
        fireEvent.click(checkbox);

        const deleteButton = screen.getByRole('button', { name: /delete expense\(s\)/i });
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(deleteUserExpense).toHaveBeenCalledWith("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiVXNlck1vY2tVVUlEIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjg2MDAyNzAwfQ._V9T0XpD0QOV_pFymENcHZDtkDriE6jxmrW8fJaxCPE", ["TESTUUID"]);
            expect(screen.queryByText('Groceries')).not.toBeInTheDocument();
        });
    });

    it("should be able to Edit expense", async () => {
        (getUserExpenses as jest.Mock).mockResolvedValueOnce({
            items: [
              {
                amount: 200,
                category: 'Groceries',
                date: '2024-10-10',
                uuid: 'TESTUUID',
              },
            ],
            pages: 1,
        });

        (updateUserExpense as jest.Mock).mockResolvedValueOnce({
            amount: 100,
            category: 'Groceries',
            date: '2024-10-10',
            uuid: 'TESTUUID',
        });


        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

        await waitFor(() => {
            expect(screen.getByText('Groceries')).toBeVisible();
        });


        const editLink = screen.getByText("Edit")
        fireEvent.click(editLink);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeVisible();
            expect(screen.getByText(/edit expense/i)).toBeVisible();
        });

        const amountInput = screen.getByRole('spinbutton', { name: /amount/i });
        const updateButton = screen.getByRole('button', { name: /update/i });


        fireEvent.change(amountInput, { target: { value: '100' } });

        expect(amountInput).toHaveValue(100);

        fireEvent.click(updateButton);

        await waitFor(() => {
            expect(screen.getByText('$100.00')).toBeInTheDocument();
            expect(screen.queryByText('$200.00')).not.toBeInTheDocument();
        });
    })

    it("should be able to display a budget", async () => {
        (getUserExpenses as jest.Mock).mockResolvedValueOnce({
            items: [
              {
                amount: 200,
                category: 'Groceries',
                date: '2024-10-10',
                uuid: 'TESTUUID',
              },
            ],
            pages: 1,
        });

        (getCurrentBudget as jest.Mock).mockResolvedValueOnce({
            uuid: "mock-uuid",
            budget_amount: 300,
            month: "2025-01-01",
            expenses_total: 200,
            remaining_budget: 100
        })


        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

        const budgetsTab = screen.getByRole('tab', {
            name: /budgets/i
        });

        fireEvent.click(budgetsTab);

        await waitFor(async () => {
            expect(screen.getByRole('heading', {
                name: /current budget/i
            })).toBeVisible();

            expect(screen.getByText(/budget amount: \$ 300/i)).toBeVisible();
            expect(screen.getByText(/budget month: 2025-01-01/i)).toBeVisible();
            expect(screen.getByText(/expenses total: \$ 200/i)).toBeVisible();
            expect(screen.getByText(/remaining budget: \$ 100/i)).toBeVisible();
        })
    })

    it('can create a new budget', async () => {
        (getUserExpenses as jest.Mock).mockResolvedValueOnce({
            items: [
              {
                amount: 200,
                category: 'Groceries',
                date: '2024-10-10',
                uuid: 'TESTUUID',
              },
            ],
            pages: 1,
        });

        (getCurrentBudget as jest.Mock).mockResolvedValueOnce({});

        (createNewBudget as jest.Mock).mockResolvedValueOnce({
            uuid: 'mock-uuid'
        });

        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

        const budgetsTab = screen.getByRole('tab', {
            name: /budgets/i
        });

        fireEvent.click(budgetsTab);


        await waitFor(async () => {
            expect(screen.getByRole('heading', {
                name: /current budget/i
            })).toBeVisible();

            const newBudgetBttn = screen.getByRole('button', {
                name: /new budget/i
            })

            fireEvent.click(newBudgetBttn);

            expect(screen.getByRole('heading', {
                name: /create new budget/i
            })).toBeVisible()

            expect(screen.getByRole('spinbutton', {
                name: /amount \*/i
            })).toBeVisible()

            const dialog = screen.getByRole('dialog');

            expect(within(dialog).getByText(/date/i)).toBeVisible();
            fireEvent.change(screen.getByRole('spinbutton', {
                name: /amount \*/i
            }), {target: {value: 300}})

            fireEvent.click(screen.getByRole('button', {
                name: /create/i
            }))

            expect(createNewBudget).toHaveBeenCalled()
        })
    })

    it("should be able to edit budget", async () => {
        (getUserExpenses as jest.Mock).mockResolvedValueOnce({
            items: [
              {
                amount: 200,
                category: 'Groceries',
                date: '2024-10-10',
                uuid: 'TESTUUID',
              },
            ],
            pages: 1,
        });

        (getCurrentBudget as jest.Mock).mockResolvedValueOnce({
            uuid: "mock-uuid",
            budget_amount: 300,
            month: "2025-01-01",
            expenses_total: 200,
            remaining_budget: 100
        });

        (updateUserBudget as jest.Mock).mockResolvedValueOnce({
            uuid: "mock-uuid",
            budget_amount: 290,
            month: "2025-01-01",
            expenses_total: 200,
            remaining_budget: 100
        });


        render(
            <Provider store={store}>
                <Dashboard />
            </Provider>
        );

        const budgetsTab = screen.getByRole('tab', {
            name: /budgets/i
        });

        fireEvent.click(budgetsTab);

        await waitFor(async () => {
            expect(screen.getByRole('button', {
                name: /edit budget/i
            })).toBeEnabled()

            const editBudget = screen.getByRole('button', {
                name: /edit budget/i
            })

            fireEvent.click(editBudget);

            const budgetAmount = screen.getByRole('spinbutton', {
                name: /budget amount/i
            })

            fireEvent.change(budgetAmount, {target: {value: 290}})

            fireEvent.click(screen.getByRole('button', {
                name: /update budget/i
            }))

            expect(updateUserBudget).toHaveBeenCalled()
            expect(screen.getByText(/budget amount: \$ 290/i)).toBeVisible();
        })
    })
})
