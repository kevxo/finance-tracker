
import { Button, Label, TextInput } from "flowbite-react"
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom'

import { loginUser } from "../../Services/APIs/Login";
import { LoginToast } from "../Toast/index";

export function Login() {
  const [isUnsuccessful, setIsUnsuccessful] = useState<boolean>(false)
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    await loginUser({username: username, password: password})
    const token = localStorage.getItem('token')

    if (token) {
      setIsUnsuccessful(false)
      navigate('/dashboard')
    } else {
      setIsUnsuccessful(true)
      navigate('/')
    }
  }

  const handleSignUp = () => {
    navigate('/signUp')
  }

  return (
    <div>
      <div className="flex justify-center" >
          {isUnsuccessful &&
            <LoginToast />
          }
      </div>
        <form className="h-screen flex flex-col space-y-8 items-center
              justify-center border  rounded">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="username" value="Username" />
            </div>
            <TextInput id="username" type="username" placeholder="username123" required onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Password" />
            </div>
            <TextInput id="password" type="password" required placeholder="*******" onChange={(e) => setPassword(e.target.value)}/>
          </div>
          <div className="flex justify-center space-x-4">
            <Button type="submit" onClick={(e: { preventDefault: () => void; }) => handleLogin(e)}>Login</Button>
            <Button type="submit" onClick={() => handleSignUp()}>Sign Up</Button>
          </div>
        </form>
    </div>
  );
}
