import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modle.jsx";
import CanAccess from "../components/CanAccess.jsx";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [userName, setUsername] = useState("");
  const [userEmail, setUseremail] = useState("");
  const [userRole, setUserrole] = useState("user");
  const [portal, setPortal] = useState(false);
  const [hardDeleteConfirm, setHardDeleteConfirm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const BASE_URL = "http://localhost:4000";
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllusers();
    fetchUser();
  }, []);

  const fetchAllusers = async () => {
    const res = await fetch(`${BASE_URL}/users?role=${userRole}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    } else if (res.status === 401) {
      navigate("/login");
    } else if (res.status == 403) {
      navigate("/");
    } else {
      console.error("Error fetching user data:", res.status);
    }
  };

  const fetchUser = async () => {
    const res = await fetch(`${BASE_URL}/user/profile`, {
      method: "GET",
      credentials: "include",
    });
    const data = await res.json();
    if (res.ok) {
      setUsername(data.name);
      setUseremail(data.email);
      setUserrole(data.role);
    } else if (res.status === 401) {
      navigate("/login");
    } else {
      console.error("Error fetching user info: ", res.status);
    }
  };

  const logoutUser = async (user) => {
    const { id: userId, email } = user;

    const logoutConfirmed = confirm(`Logging out user with ID: ${email}`);
    if (logoutConfirmed) {
      const res = await fetch(`${BASE_URL}/users/${userId}/logout`, {
        method: "POST",
        credentials: "include",
      });
      // const data = await res.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isLoggedIn: false } : user
        )
      );
    }
  };

  const softDelete = async (user) => {
    const { id: userId, email } = user;
    const res = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      console.log("user Deleted successfull");
      await fetchUser();
    }
  };

  const hardDelete = async (user) => {
    const { id: userId, email } = user;
    const res = await fetch(`${BASE_URL}/users/${userId}/hard`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.ok) {
      console.log("user Deleted successfull");
      await fetchUser();
    }
  };

  const handleUserDelete = (user) => {
    if (hardDeleteConfirm) {
      const userconfirm = confirm(
        "Are you sure you want to permanently delete this user?"
      );
      if (userconfirm) {
        hardDelete(user);
        setPortal(false);
      }
    } else {
      softDelete(user);
      setPortal(false);
    }
  };

  const handleSearch = async () => {
    if (searchTerm.trim() === "") {
      fetchAllusers();
      return;
    }

    const res = await fetch(`${BASE_URL}/users/search?query=${searchTerm}`, {
      credentials: "include",
    });
    if (res.ok) {
      const data = await res.json();
      setUsers(data);
    } else {
      console.error("Error searching users:", res.status);
    }
  };

  return (
    <>
      <div className="max-w-[900px] mx-auto mt-10 font-sans">
        <h1 className="text-2xl font-bold mb-5">All Users</h1>

        <div className="mb-4 flex gap-1 justify-end">
          <input
            type="email"
            className="border rounded px-3 py-1"
            placeholder="search user on email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            onClick={handleSearch}
            className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
          >
            Search
          </button>
        </div>

        {users.length === 0 ? (
          <p className="font-medium ml-4">No users found.</p>
        ) : (
          <table className="w-full border-collapse [&_th]:border [&_th]:border-gray-300 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_th]:bg-gray-100 [&_td]:border [&_td]:border-gray-300 [&_td]:px-3 [&_td]:py-2">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th></th>
                <CanAccess role={["owner", "admin"]}>
                  <th>File Access</th>
                  <th></th>
                </CanAccess>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.isLoggedIn ? "Logged In" : "Logged Out"}</td>
                  <td>
                    <button
                      className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors"
                      onClick={() => logoutUser(user)}
                      disabled={!user.isLoggedIn}
                    >
                      Logout
                    </button>
                  </td>
                  <CanAccess role={["owner", "admin"]}>
                    {
                      <>
                        <td>
                          <button
                            className="px-3 py-1.5 text-sm rounded bg-red-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-red-800 transition-colors"
                            onClick={() => setPortal(true)}
                          >
                            Delete
                          </button>
                          <Modal
                            isOpen={portal}
                            onClose={setPortal}
                            children={
                              <>
                                <div className="flex justify-between flex-col gap-4">
                                  <h2 className="text-xl font-medium shadow-sm p-2 ">
                                    delete user
                                  </h2>
                                  <label
                                    htmlFor="chk"
                                    className="flex  gap-2 items-center"
                                  >
                                    <input
                                      type="checkbox"
                                      name=""
                                      id="chk"
                                      onChange={(e) =>
                                        setHardDeleteConfirm(e.target.checked)
                                      }
                                    />
                                    <p className="font-medium">
                                      "permanently delete this user "
                                    </p>
                                  </label>
                                  <button
                                    onClick={() => handleUserDelete(user)}
                                    className="flex-1 px-4 py-2 bg-red-600 cursor-pointer  text-white rounded-lg hover:bg-red-700"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </>
                            }
                          />
                        </td>
                        <td>
                          <button
                            className="px-3 py-1.5 text-sm rounded bg-green-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-green-800 transition-colors"
                            onClick={() => navigate(`data/${user.id}`)}
                          >
                            Access Files
                          </button>
                        </td>
                      </>
                    }
                  </CanAccess>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
