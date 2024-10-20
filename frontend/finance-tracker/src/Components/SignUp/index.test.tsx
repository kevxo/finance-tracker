import { render, screen, fireEvent, act } from '@testing-library/react'
import React from 'react';
import { MemoryRouter, Routes, Route} from 'react-router-dom';

import { SignUp } from './index';
import { createAccount } from '../../Services/APIs/CreateAccount';
import { Login } from '../Login/index';

jest.mock('../../Services/APIs/CreateAccount')

describe('Register User', () => {
    it('should render', async () => {
        const {container} = render(
            <MemoryRouter initialEntries={['/']}>
               <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signUp" element={<SignUp />} />
                </Routes>
            </MemoryRouter>
        );

        const registerButton = screen.getByRole('button', {
            name: /sign up/i
        })

        await act( async () => {
            fireEvent.click(registerButton)
        })

        const usernameTextbox = container.querySelector('#username')
        const passwordTextbox = container.querySelector('#password')
        const repeatedPasswordTextbox = screen.getByLabelText(/repeat password \*/i)

        expect(usernameTextbox).toBeDefined();
        expect(passwordTextbox).toBeDefined();
        expect(repeatedPasswordTextbox).toBeDefined();
    })

    it('should register a user', async () => {
        (createAccount as jest.Mock).mockResolvedValueOnce({uuid: '123'})

        render(
            <MemoryRouter initialEntries={['/signUp']}>
               <Routes>
                    <Route path="/" element={<Login />} />
                    <Route path="/signUp" element={<SignUp />} />
                </Routes>
            </MemoryRouter>
        );


        const usernameTextbox = screen.getByLabelText(/username/i) as HTMLInputElement;
        const passwordTextboxes = screen.getAllByLabelText(/password \*/i);
        const passwordTextbox = passwordTextboxes[0];
        const repeatedPasswordTextbox = passwordTextboxes[1];

        fireEvent.change(usernameTextbox, { target: { value: 'user1234' } });
        fireEvent.change(passwordTextbox, { target: { value: 'password1234' } });
        fireEvent.change(repeatedPasswordTextbox, { target: { value: 'password1234' } });
        const registerButton = screen.getByRole('button', {
            name: /register new account/i
        })

        await act(async () => {
            await fireEvent.click(registerButton);
        });

        expect(createAccount).toHaveBeenCalledWith({
            username: 'user1234',
            password: 'password1234'
        })
    })
})