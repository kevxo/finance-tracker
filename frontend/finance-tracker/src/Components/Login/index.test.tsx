import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { Provider } from 'react-redux';
import { MemoryRouter, Routes, Route} from 'react-router-dom';
import configureMockStore from 'redux-mock-store';

import { Login } from './index';
import { getCurrentBudget } from '../../Services/APIs/Budgets';
import { getUserExpenses } from '../../Services/APIs/Expenses';
import { loginUser } from '../../Services/APIs/Login';
import { Dashboard } from '../Dashboard/index';

jest.mock( '../../Services/APIs/Login')
jest.mock('../../Services/APIs/Expenses')
jest.mock('../../Services/APIs/Budgets')
jest.mock('../../env', () => ({
    URI: 'http://mock-api.test',
}));

const mockStore = configureMockStore();
const store = mockStore({
  budget: { currentBudgetUuid: 'mock-uuid' }
});

describe('Login', () => {
    beforeEach(() => {
        jest.spyOn(Storage.prototype, 'setItem');

        const localStorageMock = (() => {
            let store: { [key: string]: string } = {
                token:  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiVXNlck1vY2tVVUlEIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNjg2MDAyNzAwfQ._V9T0XpD0QOV_pFymENcHZDtkDriE6jxmrW8fJaxCPE',
                currentBudgetUuid: 'TEST-UUID'
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
    })

    it('should render', () => {
        (loginUser as jest.Mock).mockResolvedValueOnce(undefined);
        (getUserExpenses as jest.Mock).mockResolvedValueOnce({
            items: [],
            pages: 1
        })
        render(
            <Provider store={store}>
                <MemoryRouter initialEntries={['/']}>
                <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        expect(screen.getByText("Username")).toBeDefined()
        expect(screen.getByText("Password")).toBeDefined()
        expect(screen.getByRole('button', {
            name: /login/i
          })).toBeDefined()
        expect(screen.getByRole('button', {
            name: /sign up/i
        })).toBeDefined()
    })

    it("should login", async () => {
        (loginUser as jest.Mock).mockResolvedValueOnce({ access_token: 'mockAccessToken' });
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
                <MemoryRouter initialEntries={['/']}>
                <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                    </Routes>
                </MemoryRouter>
            </Provider>
        );

        const usernameTextbox = screen.getByRole('textbox', {
            name: /username/i
        })

        const passwordTextbox = screen.getByLabelText(/password/i)

        const loginButton = screen.getByRole('button', {
            name: /login/i
        })


        fireEvent.change(usernameTextbox, {target: {value: 'user1244'}})
        fireEvent.change(passwordTextbox, {target: {value: 'Password123'}})

        fireEvent.click(loginButton)

        await waitFor(() => {
            expect(screen.getAllByText('Expenses')).toBeDefined();
        })

        expect(loginUser).toHaveBeenCalledWith({
            username: 'user1244',
            password: 'Password123'
        })
    })
})
