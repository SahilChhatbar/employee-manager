import { useState } from "react";
import { Form, Link, useNavigate } from "react-router-dom";
import { authService } from "../services/authServices";
import type { RegisterData } from "../types/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    empID: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "confirmPassword") {
      setConfirmPassword(value);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (formData.password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      await authService.registerEmployee(formData);
      navigate("/dashboard");
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            Employee Registration
          </CardTitle>
          <CardDescription>
            Or
            <Link to="/" className="ml-1 font-medium text-primary hover:underline">
              sign in to your existing account
            </Link>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <Label className="flex flex-col items-start">Full Name
            <Input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              placeholder="Enter your full name"
              value={formData.name}
              onChange={handleChange}
            /></Label>
           <Label className="flex flex-col items-start">Full Name
            Employee ID  
            <Input
              id="empID"
              name="empID"
              type="text"
              required
              placeholder="Enter your employee ID"
              value={formData.empID}
              onChange={handleChange}
            /></Label>
           <Label className="flex flex-col items-start">Full Name
           Email Address
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="Enter your email address"
              value={formData.email}
              onChange={handleChange}
            /></Label>
            <Label className="flex flex-col items-start">Full Name
           Password
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Create a password (min. 6 characters)"
              value={formData.password}
              onChange={handleChange}
            /></Label>
            <Label className="flex flex-col items-start">Full Name
           Confirm Password
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={handleChange}
            /></Label>
            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? "Creating account..." : "Create Account"}
            </Button>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Register;
