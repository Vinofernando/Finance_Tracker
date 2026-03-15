import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import checkExpiredToken from "../utils/checkExpiredToken";
import "../style/AdminDashboard.css";

export default function AdminDashboard() {
  const token = localStorage.getItem("token") || null;
  const name = localStorage.getItem("name") || "Guest";
  const role = localStorage.getItem("role") || "Guest";

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token || checkExpiredToken(token) < new Date()) {
      localStorage.clear();
      navigate("/login");
      return;
    }
    async function fetchUsers() {
      try {
        setLoading(true);
        const res = await fetch(
          `https://api.finance-tracker.store/api/transaction/users${userId ? `?userId=${userId}` : ""}  `,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        const data = await res.json();

        if (!res.ok) {
          setLoading(false);
          throw new Error(data.message);
        }
        setUserList(data.user);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, [userId, token, navigate]);

  useEffect(() => {
    setIsClient(true);
  }, []);
  async function deleteUser(userId) {
    try {
      if (confirm("Apa kamu ingin menghapus akun ini ?") == true) {
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
      } else {
        return;
      }
    } catch (err) {
      console.error("Fetch error(delete user):", err);
    }
  }

  function logoutHandler() {
    if (confirm("Apa kamu yakin ingin logout ?") == true) {
      localStorage.clear();
      navigate("/login");
    } else {
      return;
    }
  }
  return (
    <div className="admin-container">
      <div className="admin-card">
        <div className="admin-profile">
          <h1>{name}</h1>
          <p>{role}</p>
          <button onClick={logoutHandler} className="admin-logout-btn">
            Logout
          </button>
        </div>
        {loading && <h1>Loading....</h1>}
        {userList.length > 0 ? (
          userList.map((user) => (
            <div key={user.user_id} className="user-card">
              <div className="user-data">
                <p>
                  username: {user.username}({user.role})
                </p>
                <p>email: {user.user_email}</p>

                {isClient && user.total_income ? (
                  <p className="positive">
                    Income: Rp
                    {new Intl.NumberFormat("id-ID").format(user.total_income)}
                  </p>
                ) : !isClient ? (
                  "Loading..."
                ) : (
                  "no have transaction yet"
                )}
                {isClient && user.total_expense ? (
                  <p className="negative">
                    Income: Rp
                    {new Intl.NumberFormat("id-ID").format(user.total_expense)}
                  </p>
                ) : !isClient ? (
                  "Loading..."
                ) : (
                  "no have transaction yet"
                )}
                <p
                  className={
                    Number(user.total_amount) < 0 ? "negative" : "positive"
                  }
                >
                  Total:{" "}
                  {user.total_amount
                    ? "Rp " +
                      new Intl.NumberFormat("id-ID").format(user.total_amount)
                    : "no have transaction yet"}
                </p>
              </div>
              <button
                onClick={() => deleteUser(user.user_id)}
                className="admin-delete-btn"
              >
                Hapus
              </button>
            </div>
          ))
        ) : (
          <p>Belum ada user</p>
        )}
      </div>
    </div>
  );
}
