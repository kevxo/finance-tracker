import { render, screen, waitFor} from '@testing-library/react'
import '@testing-library/jest-dom';
import React from 'react'

import { Dashboard } from './index'
import { getUserExpenses } from '../../Services/APIs/Expenses'

jest.mock('../../Services/APIs/Expenses')

describe('Dashboard', () => {
    beforeEach(() => {
        jest.spyOn(Storage.prototype, 'setItem');

        const localStorageMock = (() => {
            let store: { [key: string]: string } = {
                token: 'mockAccessToken',
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
})
