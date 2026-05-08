import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import Tabs from "../components/Tabs";

import ProfilePanel from "../components/ProfilePanel";
import UsersListPanel from "../components/UsersListPanel";
import HistoryPanel from "../components/HistoryPanel";

export default function DashboardPage() {
  const navigate = useNavigate();

  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const currentUserId = localStorage.getItem("currentUserId");

  const [activeTab, setActiveTab] = useState("profile");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const adminTabs = useMemo(
    () => [
      {
        key: "profile",
        label: "Профиль",
        content: <ProfilePanel />,
      },
      {
        key: "users",
        label: "Список пользователей",
        content: <UsersListPanel />,
      },
      {
        key: "history",
        label: "История изменений",
        content: <HistoryPanel />,
      },
    ],
    []
  );

  const userTabs = useMemo(
    () => [
      {
        key: "profile",
        label: "Профиль",
        content: <ProfilePanel />,
      },
      {
        key: "history",
        label: "История моих изменений",
        content: <HistoryPanel />,
      },
    ],
    []
  );

  const tabs = role === "ADMIN" ? adminTabs : userTabs;

  return (
    <div className="page">
      <div className="card">
        <div className="dashboard-header">
          <div>
            <h1>
              Система хранения истории изменений пользовательских данных
            </h1>
          </div>

          <button className="logout-button" onClick={handleLogout}>
            Выйти
          </button>
        </div>

        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
      </div>
    </div>
  );
}