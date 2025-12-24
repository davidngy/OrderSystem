import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"

export function SignupForm({ ...props }: React.ComponentProps<typeof Card>) {
  const[name, setName] = useState("");
  const[password, setPassword] = useState("");
  const[confirmedPassword, setConfirmedPassword] = useState("");
  const[error, setError] = useState<string | null>(null);
   const navigate = useNavigate();

  function handleRegister(e: React.FormEvent<HTMLFormElement>) {
   e.preventDefault();
   if(password  !== confirmedPassword) {
    setError("Passwords do not match");
    setName("");
    setPassword("");
    setConfirmedPassword("")
    return
   }

   setError(null)
   registerUser();
  }

  async function registerUser() {
     try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: name,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      
      const result = await response.json();
     
      navigate("/login")
      console.log(result);
    } catch (error) {
        if (error instanceof Error) {
          console.error(error.message);
        } else {
          console.error("Unknown error", error);
        }
    }
  }

  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input id="password" type="password" value={password} onChange={(e => setPassword(e.target.value))} required />
              <FieldDescription>
                Must be at least 8 characters long.
              </FieldDescription>
              {error && (
                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>
              )}
            </Field>
            <Field>
              <FieldLabel htmlFor="confirm-password">
                Confirm Password
              </FieldLabel>
              <Input id="confirm-password" type="password" value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)} required />
              <FieldDescription>Please confirm your password.</FieldDescription>
              {error && (
                <p className="text-red-500 text-sm text-center">
                  {error}
                </p>
              )}
            </Field>
            <FieldGroup>
              <Field>
                <Button  type="submit">Create Account</Button>
                <FieldDescription className="px-6 text-center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
