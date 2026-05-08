import { useEffect, useState } from "react";
import { usersApi } from "../api/usersApi";

const adminMockUser = {
  id: "a2av8kk6-b201-4002-af01-cc111f0012db",
  externalId: "admin-01",
  role: "ADMIN",
  status: "ACTIVE",
  createdAt: "2026-05-06T23:20:01.727891",
  updatedAt: "2026-05-06T23:20:01.727891",
  profile: {
    firstName: "System",
    lastName: "Administrator",
    email: "admin01@gmail.com",
    phoneNumber: "+70000000000",
    address: "Панель управления системы",
    birthDate: null,
    preferredContactMethod: "email",
    verified: true,
    lastModifiedAt: "2026-05-06T23:20:01.727891",
  },
};

const emptyForm = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  birthDate: "",
  preferredContactMethod: "EMAIL",
  verified: false,
  reason: "",
};

export default function ProfilePanel() {
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const currentUserId = localStorage.getItem("currentUserId");

  const [user, setUser] = useState(role === "ADMIN" ? adminMockUser : null);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (role === "ADMIN") {
      setUser(adminMockUser);
      fillForm(adminMockUser);
      return;
    }

    if (currentUserId) {
      loadUser(currentUserId);
    }
  }, [role, currentUserId]);

  const fillForm = (data) => {
    const profile = data.profile;

    setForm({
      firstName: profile?.firstName || "",
      lastName: profile?.lastName || "",
      email: profile?.email || "",
      phoneNumber: profile?.phoneNumber || "",
      address: profile?.address || "",
      birthDate: profile?.birthDate || "",
      preferredContactMethod: profile?.preferredContactMethod || "EMAIL",
      verified: Boolean(profile?.verified),
      reason: "",
    });
  };

  const loadUser = async (userId) => {
    try {
      setLoading(true);
      setMessage("");

      const data = await usersApi.getUserById(userId);
      setUser(data);
      fillForm(data);
    } catch (error) {
      console.error(error);
      setMessage("Не удалось загрузить профиль пользователя");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (role === "ADMIN") {
      setMessage("Профиль администратора является демонстрационной заглушкой");
      return;
    }

    if (!currentUserId) {
      setMessage("ID пользователя не указан");
      return;
    }

    try {
      setMessage("");

      const payload = {
        ...form,
        birthDate: form.birthDate || null,
        context: {
          initiatorId: currentUserId,
          initiatorType: "USER",
          initiatorName: username,
          initiatorRole: "USER",
          source: "WEB",
          requestChannel: "WEB INTERFACE",
          ipAddress: "127.0.0.1",
          userAgent: "React Web Client",
          requestId: `req-${Date.now()}`,
          additionalMetadata: "Обновление профиля из веб-интерфейса",
          reason: form.reason || "Причина изменения не указана",
          comment: "Изменение данных профиля через веб-интерфейс",
        },
      };

      const updatedUser = await usersApi.updateUserProfile(currentUserId, payload);

      setUser(updatedUser);
      fillForm(updatedUser);
      setEditing(false);
      setMessage("Профиль успешно обновлён");
    } catch (error) {
      console.error(error);
      setMessage("Ошибка при сохранении профиля");
    }
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2>Профиль</h2>
          <p>
            Здесь отображаются актуальные данные текущего пользователя
          </p>
        </div>

        {user && role !== "ADMIN" && (
          <button
            className="primary-small-button"
            onClick={() => setEditing((prev) => !prev)}
          >
            {editing ? "Отменить" : "Редактировать"}
          </button>
        )}
      </div>

      {message && <div className="message">{message}</div>}

      {loading && <p>Загрузка профиля...</p>}

      {!loading && !user && (
        <div className="empty-state">
          Профиль не найден. Проверьте ID пользователя при входе.
        </div>
      )}

      {user && !editing && <ProfileView user={user} />}

      {user && editing && role !== "ADMIN" && (
        <form className="form-grid" onSubmit={handleSave}>
          <label>
            Имя
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Фамилия
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Телефон
            <input
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Адрес
            <input
              name="address"
              value={form.address}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Дата рождения
            <input
              name="birthDate"
              type="date"
              value={form.birthDate}
              onChange={handleInputChange}
            />
          </label>

          <label>
            Предпочтительный способ связи
            <select
              name="preferredContactMethod"
              value={form.preferredContactMethod}
              onChange={handleInputChange}
            >
              <option value="EMAIL">EMAIL</option>
              <option value="PHONE">PHONE</option>
            </select>
          </label>

          <label className="checkbox-label">
            <input
              name="verified"
              type="checkbox"
              checked={form.verified}
              onChange={handleInputChange}
            />
            Профиль подтверждён
          </label>

          <label className="form-full-width">
            Опишите причину изменения данных
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleInputChange}
              placeholder="Например: обновление контактной информации"
              rows="3"
            />
          </label>

          <button className="primary-button form-submit" type="submit">
            Сохранить изменения
          </button>
        </form>
      )}
    </div>
  );
}

function ProfileView({ user }) {
  const profile = user.profile;

  return (
    <div className="profile-card">
      <div className="profile-main">
        <h3>
          {profile?.firstName} {profile?.lastName}
        </h3>
        <p>{profile?.email}</p>
      </div>

      <div className="details-grid">
        <InfoItem label="ID пользователя" value={user.id} mono />
        <InfoItem label="Внешний ID" value={user.externalId} />
        <InfoItem label="Роль" value={user.role} />
        <InfoItem label="Статус" value={user.status} />
        <InfoItem label="Телефон" value={profile?.phoneNumber} />
        <InfoItem label="Адрес" value={profile?.address} />
        <InfoItem label="Дата рождения" value={profile?.birthDate} />
        <InfoItem label="Способ связи" value={profile?.preferredContactMethod} />
        <InfoItem
          label="Профиль подтверждён"
          value={profile?.verified ? "Да" : "Нет"}
        />
        <InfoItem label="Последнее изменение" value={profile?.lastModifiedAt} />
      </div>
    </div>
  );
}

function InfoItem({ label, value, mono = false }) {
  return (
    <div className="info-item">
      <span>{label}</span>
      <strong className={mono ? "mono-value" : ""}>{value || "—"}</strong>
    </div>
  );
}