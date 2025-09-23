import { api } from "@/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
  updatedAt: string;
};

export default function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const expiresAt = localStorage.getItem("expiresAt");
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getMe() {
      try {
        const response = await api.get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(response.data.user);
      } catch (error) {
        console.error(error);
      }
    }

    if (token) getMe();
  }, [token]);

  useEffect(() => {
    if (!token || !expiresAt || new Date() > new Date(parseInt(expiresAt))) {
      navigate("/");
    }
  }, [token, expiresAt, navigate]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading user info...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-semibold">
            Welcome, {user.name || "User"}!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-4">
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="font-medium">Email</dt>
              <dd className="break-all">{user.email}</dd>
            </div>
            <div className="flex justify-between border-b border-border pb-2">
              <dt className="font-medium">Account Created</dt>
              <dd>{new Date(user.createdAt).toLocaleDateString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="font-medium">Last Updated</dt>
              <dd>{new Date(user.updatedAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
