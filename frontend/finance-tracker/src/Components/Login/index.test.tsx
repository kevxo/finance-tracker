import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter, Routes, Route} from 'react-router-dom';

import { Login } from './index';
import { loginUser } from '../../Services/APIs/Login';
import { Dashboard } from '../Dashboard/index';

jest.mock( '../../Services/APIs/Login')

describe('Login', () => {
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

    it('should render', () => {
        (loginUser as jest.Mock).mockResolvedValueOnce(undefined);
        render(
            <MemoryRouter initialEntries={['/']}>
               <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </MemoryRouter>
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

        render(
            <MemoryRouter initialEntries={['/']}>
               <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                </Routes>
            </MemoryRouter>
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
            expect(screen.getByText('Dashboard')).toBeDefined();
        })

        expect(loginUser).toHaveBeenCalledWith({
            username: 'user1244',
            password: 'Password123'
        })
    })
})
