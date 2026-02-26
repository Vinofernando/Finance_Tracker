import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
export default function Dashboard() {
  const token = localStorage.getItem("token") || null;
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/transaction", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        setData(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return (
      <div>
        <p>Only logged user can acces this page</p>
        <Link to={"/login"}>Login page</Link>
      </div>
    );
  }
  function logoutHandler() {
    navigate("/login");
    localStorage.clear();
  }
  // if (error) {
  //   return <div>Error: {error}</div>;
  // }

  console.log(data);
  return (
    <div>
      {data &&
        data.map((transaction) => (
          <div
            key={transaction.transaction_id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: "10px 0",
            }}
          >
            <h2 style={{ margin: 0 }}>Amount: </h2>
            <p style={{ margin: 0 }}>
              {(transaction.amount * 100) / 100} ({transaction.type})
            </p>
            <h2>Description: {transaction.description}</h2>
          </div>
        ))}
      <button onClick={logoutHandler}>Logout</button>
    </div>
  );
}
