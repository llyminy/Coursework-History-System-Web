import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const currentUserId = localStorage.getItem("currentUserId");

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("password");
    localStorage.removeItem("role");
    localStorage.removeItem("currentUserId");

    navigate("/login");
  };

  return (
    <div className="page">
      <div className="card">
        <div className="page-header">
          <div>
            <h1>Панель системы</h1>
            <p>Текущая роль: {role}</p>
            <p>Пользователь авторизации: {username}</p>
            {currentUserId && <p>ID профиля: {currentUserId}</p>}
          </div>

          <button onClick={handleLogout}>Выйти</button>
        </div>

        <p>
          Здесь позже появятся вкладки: профиль, список пользователей, история
          изменений и восстановление.
        </p>
      </div>
    </div>
  );
}