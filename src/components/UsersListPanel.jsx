import { useEffect, useState } from "react";
import { usersApi } from "../api/usersApi";
import UserProfileModal from "./UserProfileModal";

const initialForm = {
  externalId: "",
  role: "USER",
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  birthDate: "",
  preferredContactMethod: "EMAIL",
};

export default function UsersListPanel() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await usersApi.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error);
      setMessage("Не удалось загрузить пользователей");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleOpenProfile = (user) => {
    setSelectedUser(user);
    };

  const handleCreateUser = async (event) => {
    event.preventDefault();

    try {
      setMessage("");

      const payload = {
        ...form,
        birthDate: form.birthDate || null,
      };

      await usersApi.createUser(payload);

      setForm(initialForm);
      setShowForm(false);
      setMessage("Пользователь успешно создан");

      await loadUsers();
    } catch (error) {
      console.error(error);
      setMessage("Ошибка при создании пользователя");
    }
  };

  const handleSelectUser = (userId) => {
    localStorage.setItem("selectedUserId", userId);
    setMessage("Пользователь выбран. Перейдите во вкладку «Профиль».");
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2>Список пользователей</h2>
          <p>Здесь отображается список пользователей с возможностью просмотра детальной информации</p>
        </div>

        <button className="primary-small-button" onClick={() => setShowForm((prev) => !prev)}>
          {showForm ? "Скрыть форму" : "Создать пользователя"}
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      {showForm && (
        <form className="form-grid" onSubmit={handleCreateUser}>
          <label>
            Внешний ID
            <input name="externalId" value={form.externalId} onChange={handleChange} />
          </label>

          <label>
            Роль
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
          </label>

          <label>
            Имя
            <input name="firstName" value={form.firstName} onChange={handleChange} required />
          </label>

          <label>
            Фамилия
            <input name="lastName" value={form.lastName} onChange={handleChange} required />
          </label>

          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>

          <label>
            Телефон
            <input name="phoneNumber" value={form.phoneNumber} onChange={handleChange} />
          </label>

          <label>
            Адрес
            <input name="address" value={form.address} onChange={handleChange} />
          </label>

          <label>
            Дата рождения
            <input name="birthDate" type="date" value={form.birthDate} onChange={handleChange} />
          </label>

          <label>
            Предпочтительный способ связи
            <select
              name="preferredContactMethod"
              value={form.preferredContactMethod}
              onChange={handleChange}
            >
              <option value="EMAIL">EMAIL</option>
              <option value="PHONE">PHONE</option>
            </select>
          </label>

          <button className="primary-button form-submit" type="submit">
            Сохранить пользователя
          </button>
        </form>
      )}

      {loading ? (
        <p>Загрузка пользователей...</p>
      ) : (
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>ФИО</th>
                <th>Email</th>
                <th>Роль</th>
                <th>Статус</th>
                <th>Действие</th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="mono">{user.id}</td>
                  <td>
                    {user.profile?.firstName} {user.profile?.lastName}
                  </td>
                  <td>{user.profile?.email}</td>
                  <td>{user.role}</td>
                  <td>{user.status}</td>
                  <td>
                    <button className="secondary-button" onClick={() => handleOpenProfile(user)}>
                    Открыть профиль
                    </button>
                  </td>
                </tr>
              ))}

              {users.length === 0 && (
                <tr>
                  <td colSpan="6">Пользователи пока не созданы</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
      <UserProfileModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        />
    </div>
  );
}