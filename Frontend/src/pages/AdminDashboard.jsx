import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export default function AdminDashboard() {
  const token = localStorage.getItem("token") || null;
  const name = localStorage.getItem("name") || "Guest";
  const role = localStorage.getItem("role") || "Guest";

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch(
          `http://localhost:5000/api/transaction/users${userId ? `?userId=${userId}` : ""}  `,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const data = await res.json();

        if (!res.ok) {
          setLoading(false);
          throw new Error(data.message);
        }
        setUserList(data);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [userList, loading, userId, token]);

  async function deleteUser(userId) {
    try {
      const fetchDeleteUser = await fetch(
        `http://localhost:5000/api/auth/delete/${userId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await fetchDeleteUser.json();

      if (!fetchDeleteUser.ok) {
        throw new Error(data.message);
      }
    } catch (err) {
      console.error("Fetch error(delete user):", err);
    }
  }
  return (
    <>
      <div className="admin-profile">
        <h1>{name}</h1>
        <p>{role}</p>
      </div>
      {loading && <h1>Loading....</h1>}
      {userList.length > 0 ? (
        userList.map((user) => (
          <div key={user.user_id}>
            <h1>{user.username}</h1>
            <p>{user.user_email}</p>
            <p>{user.role}</p>
            <button onClick={() => deleteUser(user.user_id)}>❌</button>
          </div>
        ))
      ) : (
        <p>Belum ada user</p>
      )}
    </>
  );
}
