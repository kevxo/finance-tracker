import { Button, Label, TextInput } from "flowbite-react";
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'

import { createAccount } from "../../Services/APIs/CreateAccount";
import { LoginToast } from "../Toast";

export function SignUp() {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [repeatedPassword, setRepeatedPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate()

    const handleAccountCreate = async (e: any) => {
        e.preventDefault();

        if (password !== repeatedPassword) {
            setError('Passwords do not match')
            return;
        }

        const response = await createAccount({username: username, password: password})
        if (response && response.uuid) {
            setError(null)
            navigate('/')
        } else {
            setError('Try again. User already exists or Input is incorrect.')
            return;
        }
    }

    return (
        <div>
            <div className="flex justify-center">
                {error && (
                    <LoginToast errorMessage={error}/>
                )}
            </div>

            <form className="h-screen flex flex-col space-y-8 items-center
              justify-center border  rounded">
                <div>
                    <div className="mb-2 block">
                        <LabelWithAsterisk htmlFor="username" label="Username" />
                    </div>
                    <TextInput id="username" type="username" placeholder="user1234" required shadow onChange={(e) => setUsername(e.target.value)}/>
                </div>
                <div>
                    <div className="mb-2 block">
                        <LabelWithAsterisk htmlFor="password" label="Password" />
                    </div>
                    <TextInput id="password" type="password" required shadow onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div>
                    <div className="mb-2 block">
                        <LabelWithAsterisk htmlFor="repeat-password" label="Repeat password" />
                    </div>
                    <TextInput id="repeat-password" type="repeat-password" required shadow onChange={(e) => setRepeatedPassword(e.target.value)}/>
                </div>
                <Button type="submit" onClick={(e: any) => handleAccountCreate(e)} >Register new account</Button>
            </form>
        </div>

    )
}

// Custom label with red asterisk for required fields
interface LabelWithAsteriskProps {
    htmlFor: string;
    label: string;
}

  const LabelWithAsterisk: React.FC<LabelWithAsteriskProps> = ({ htmlFor, label }) => (
    <Label htmlFor={htmlFor}>
      {label}
      <span className="text-red-500"> *</span>
    </Label>
);
