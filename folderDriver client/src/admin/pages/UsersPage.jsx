import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CanAccess from "../components/CanAccess.jsx";
import Modal from "../components/Modle.jsx";

import {
  useGetUsersQuery,
  useGetProfileQuery,
  useLogoutUserMutation,
  useSoftDeleteUserMutation,
  useHardDeleteUserMutation,
} from "@/store/slices/AdminSlice";

export default function UsersPage() {
  const navigate = useNavigate();

  const [portal, setPortal] = useState(false);
  const [hardDeleteConfirm, setHardDeleteConfirm] = useState(false);

  const { data: profile } = useGetProfileQuery();
  const {
    data: users = [],
    isLoading,
    isError,
  } = useGetUsersQuery(profile?.role);

  //  Mutations
  const [logoutUser] = useLogoutUserMutation();
  const [softDeleteUser] = useSoftDeleteUserMutation();
  const [hardDeleteUser] = useHardDeleteUserMutation();

  const handleLogout = (user) => {
    if (confirm(`Logging out user: ${user.email}?`)) {
      logoutUser(user.id);
    }
  };

  const handleUserDelete = (user) => {
    if (hardDeleteConfirm) {
      const confirmed = confirm("Are you sure you want to permanently delete?");
      if (confirmed) {
        hardDeleteUser(user.id);
        setPortal(false);
      }
    } else {
      softDeleteUser(user.id);
      setPortal(false);
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p className="text-red-500">Error loading users.</p>;

  return (
    <div className="max-w-[900px] mx-auto mt-10 font-sans">
      <h1 className="text-2xl font-bold mb-5">All Users</h1>

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
                    onClick={() => handleLogout(user)}
                    disabled={!user.isLoggedIn}
                  >
                    Logout
                  </button>
                </td>
                <CanAccess role={["owner", "admin"]}>
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
                          <div className="flex flex-col gap-4">
                            <h2 className="text-xl font-medium">Delete user</h2>
                            <label className="flex gap-2 items-center">
                              <input
                                type="checkbox"
                                onChange={(e) =>
                                  setHardDeleteConfirm(e.target.checked)
                                }
                              />
                              <p>Permanently delete this user</p>
                            </label>
                            <button
                              onClick={() => handleUserDelete(user)}
                              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                              Delete
                            </button>
                          </div>
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
                </CanAccess>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
