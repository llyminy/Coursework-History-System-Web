import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("ADMIN");
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [currentUserId, setCurrentUserId] = useState("");

  const handleRoleChange = (newRole) => {
    setRole(newRole);

    if (newRole === "ADMIN") {
      setUsername("admin");
      setPassword("admin123");
      setCurrentUserId("");
    } else {
      setUsername("user");
      setPassword("user123");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      alert("Введите логин и пароль");
      return;
    }

    if (role === "USER" && !currentUserId.trim()) {
      alert("Для роли USER необходимо указать ID пользователя");
      return;
    }

    localStorage.setItem("username", username.trim());
    localStorage.setItem("password", password.trim());
    localStorage.setItem("role", role);

    if (role === "USER") {
      localStorage.setItem("currentUserId", currentUserId.trim());
    } else {
      localStorage.removeItem("currentUserId");
    }

    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit}>
        <h1>Вход в систему</h1>

        <div className="role-switch">
          <button
            type="button"
            className={role === "ADMIN" ? "active" : ""}
            onClick={() => handleRoleChange("ADMIN")}
          >
            Администратор
          </button>

          <button
            type="button"
            className={role === "USER" ? "active" : ""}
            onClick={() => handleRoleChange("USER")}
          >
            Пользователь
          </button>
        </div>

        <label>
          Логин
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="admin или user"
          />
        </label>

        <label>
          Пароль
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="admin123 или user123"
          />
        </label>

        {role === "USER" && (
          <label>
            ID пользователя
            <p>hint: c7cb8b66-c190-4022-af65-ec001f0642db</p>
            <input
              value={currentUserId}
              onChange={(event) => setCurrentUserId(event.target.value)}
              placeholder="UUID пользователя"
            />
          </label>
        )}

        <button className="primary-button" type="submit">
          Войти
        </button>
      </form>
    </div>
  );
}