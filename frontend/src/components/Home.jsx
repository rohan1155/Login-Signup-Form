import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      nav("/login");
      return;
    }
    const fetchUser = async () => {
      try {
        const response = await axios.post("http://localhost:5000/user", {
          userId,
        });
        setUser(response.data.user);
        // console.log(response.data.user);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [nav]);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    nav("/login");
  };

  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account?"
    );
    if (!confirmation) return;
    try {
      const userId = sessionStorage.getItem("userId");
      const response = await axios.delete("http://localhost:5000/user", {
        data: { userId },
      });
      // console.log(response.data);
      nav("/register");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="home-container">
      <div className="info-container">
        <h1>Your Profile:</h1>
        {user ? (
          <>
            <h2>Name: {user.name}</h2>
            <h2>Email: {user.email}</h2>
          </>
        ) : (
          <p>No user data available</p>
        )}
        <div className="home-buttons-container">
          <button className="home-buttons" onClick={handleLogout}>
            Log Out
          </button>
          <button className="home-buttons" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
