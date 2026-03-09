import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../style/AdminDashboard.css";

export default function AdminDashboard() {
  const token = localStorage.getItem("token") || null;
  const name = localStorage.getItem("name") || "Guest";
  const role = localStorage.getItem("role") || "Guest";

  const [searchParams] = useSearchParams();
  const userId = searchParams.get("userId");

  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
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
        setUserList(data.user);
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
                <p
                  className="positive"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      background: "green",
                      height: "10px",
                      width: "10px",
                    }}
                  ></div>
                  Income:{" "}
                  {user.total_income
                    ? "Rp" +
                      new Intl.NumberFormat("id-ID").format(user.total_income)
                    : "no have transaction yet"}
                </p>
                <p
                  className="negative"
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <div
                    style={{
                      background: "red",
                      height: "10px",
                      width: "10px",
                    }}
                  ></div>
                  Expense:{" "}
                  {user.total_expense
                    ? "Rp " +
                      new Intl.NumberFormat("id-ID").format(user.total_expense)
                    : "no have transaction yet"}
                </p>
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
