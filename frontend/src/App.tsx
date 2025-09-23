import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "./components/ui/form";
import { Label } from "./components/ui/label";
import { Input } from "./components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "./api";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const registerSchema = loginSchema
  .extend({
    confirmPassword: z.string().min(8, "Confirm password is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match",
    path: ["confirmPassword"],
  });

type LoginInput = z.infer<typeof loginSchema>;
type RegisterInput = z.infer<typeof registerSchema>;

export default function LoginRegister() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("expiresAt");
  const [isRegister, setIsRegister] = useState(false);
  const defaultValuesLogin = { email: "", password: "" };
  const defaultValuesRegister = {
    email: "",
    password: "",
    confirmPassword: "",
  };

  const form = useForm<LoginInput | RegisterInput>({
    resolver: zodResolver(isRegister ? registerSchema : loginSchema),
    defaultValues: isRegister ? defaultValuesRegister : defaultValuesLogin,
  });

  function toggleMode() {
    setIsRegister(!isRegister);
    form.reset(isRegister ? defaultValuesLogin : defaultValuesRegister);
  }

  async function onSubmit(data: LoginInput) {
    if (isRegister) {
      try {
        const response = await api.post("/users/register", data);
        toast(response.data.message);
        form.reset();
        setIsRegister(false);
      } catch (error: any) {
        console.log(error);
        const message =
          error.response?.data?.message ||
          error.message ||
          "Registration failed";
        toast(message);
      }
    } else {
      try {
        const response = await api.post("/users/login", data);
        toast(response.data.message);
        localStorage.setItem("token", response.data.token);
        const expiresAt = new Date().getTime() + 24 * 60 * 60 * 1000;
        localStorage.setItem("expiresAt", expiresAt.toString());
        form.reset();
        navigate("/home");
      } catch (error: any) {
        const message =
          error.response?.data?.message || error.message || "Login failed";
        toast(message);
      }
    }
  }

  useEffect(() => {
    if (token && expiresAt && new Date() < new Date(parseInt(expiresAt))) {
      navigate("/home");
    }
  }, [token, expiresAt, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold">
            {isRegister ? "Create a new account" : "Welcome back"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <Label>Email</Label>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <Label>Password</Label>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {isRegister && (
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <Label>Confirm Password</Label>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Confirm your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button type="submit" className="w-full">
                {isRegister ? "Register" : "Login"}
              </Button>
            </form>
          </Form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            {isRegister
              ? "Already have an account? "
              : "Don't have an account? "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-primary underline underline-offset-4 hover:text-primary/80 font-semibold"
            >
              {isRegister ? "Login" : "Register"}
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
