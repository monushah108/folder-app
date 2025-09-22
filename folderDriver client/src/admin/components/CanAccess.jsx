import { useEffect, useState } from "react";

export default function CanAccess({ role, children }) {
  const [UserRole, setUserRole] = useState("");
  const BASE_URL = "http://localhost:4000";
  useEffect(() => {
    fetchUser();
  }, []);
  const fetchUser = async () => {
    const res = await fetch(`${BASE_URL}/user/profile`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      setUserRole(data.role);
    }
  };

  if (Array.isArray(role) ? role.includes(UserRole) : role === UserRole) {
    return children;
  }
  return null;
}
