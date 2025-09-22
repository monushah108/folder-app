import { useEffect, useState } from "react";
import { FaUser, FaEnvelope, FaUserShield, FaSave } from "react-icons/fa";

export default function StaffManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectUser, setSelectUser] = useState("user");
  const [userRole, setUserrole] = useState("user");
  const BASE_URL = "http://localhost:4000"; // change to your backend

  useEffect(() => {
    fetchUser();
    fetchUsers();
  }, [userRole, selectUser]);

  const fetchUser = async () => {
    try {
      const res = await fetch(`${BASE_URL}/user/profile`, {
        method: "GET",
        credentials: "include",
      });
      const data = await res.json();
      setUserrole(data.role);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${BASE_URL}/users?role=${userRole}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        console.error("Error fetching users");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateRole = async (user) => {
    const { id: userId } = user;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/users/${userId}/role`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newRole: selectUser }),
      });
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) =>
          prev.map((u) => (u.id === userId ? { ...u, role: selectUser } : u))
        );
      } else if (res.status === 403) {
        setMessage(data.message);
      } else {
        console.error("Failed to update role");
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaUserShield className="text-blue-600" /> Staff Management
      </h2>
      <p className="text-red-500 text-md font-medium">{message}</p>

      <div className="space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex items-center justify-between bg-white shadow-md rounded-xl p-4"
          >
            {/* User Info */}
            <div className="flex items-center gap-4">
              <FaUser className="text-gray-600 text-xl" />
              <div>
                <p className="font-semibold">
                  {user.name}{" "}
                  <span
                    className={`text-xs ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-green-100 text-green-700"
                    } px-2 py-0.5 rounded-full`}
                  >
                    {user?.role}
                  </span>
                </p>
                <p className="text-sm text-gray-500 flex items-center gap-1">
                  <FaEnvelope className="text-gray-400" /> {user.email}
                </p>
              </div>
            </div>

            {/* Role Update */}
            <div className="flex items-center gap-3">
              <select
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                onChange={(e) => setSelectUser(e.target.value)}
              >
                <option value="user">user</option>
                <option value="owner">owner</option>
                <option value="admin">Admin</option>
              </select>

              <button
                onClick={() => updateRole(user)}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
              >
                <FaSave /> {loading ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
