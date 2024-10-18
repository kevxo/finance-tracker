/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Label, TextInput } from "flowbite-react"
import { loginUser } from "../../Services/APIs/Login";
import { useNavigate } from 'react-router-dom'
import { LoginToast } from "../Toast/index";
import { useState } from "react";

export function Login() {
  const [isUnsuccessful, setIsUnsuccessful] = useState<boolean>(false)
  const navigate = useNavigate();

  const handleLogin = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement).value
    const password = (document.getElementById('password') as HTMLInputElement).value

    await loginUser({username: username, password: password})

    if (localStorage.token !== undefined) {
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
              <TextInput id="username" type="username" placeholder="username123" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value="Password" />
              </div>
              <TextInput id="password" type="password" required placeholder="*******" />
            </div>
            <div className="flex justify-center space-x-4">
              <Button type="submit" onClick={(e: { preventDefault: () => void; }) => handleLogin(e)}>Login</Button>
              <Button type="submit" onClick={() => handleSignUp()}>Sign Up</Button>
            </div>
          </form>
      </div>
      );
}
