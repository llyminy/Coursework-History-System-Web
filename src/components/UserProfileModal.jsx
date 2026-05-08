export default function UserProfileModal({ user, onClose }) {
  if (!user) {
    return null;
  }

  const profile = user.profile;

  const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("ru-RU");
  };

  const formatDate = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleDateString("ru-RU");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card large-modal">
        <div className="modal-header">
          <div>
            <h2>Подробная информация о пользователе</h2>
          </div>

          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="details-section">
          <h3>Системная информация</h3>

          <div className="details-grid">
            <InfoItem label="ID пользователя" value={user.id} mono />
            <InfoItem label="Внешний ID" value={user.externalId} />
            <InfoItem label="Роль" value={user.role} />
            <InfoItem label="Статус" value={user.status} />
            <InfoItem label="Дата создания" value={formatDateTime(user.createdAt)} />
            <InfoItem label="Дата обновления" value={formatDateTime(user.updatedAt)} />
          </div>
        </div>

        <div className="details-section">
          <h3>Данные профиля</h3>

          <div className="details-grid">
            <InfoItem label="Имя" value={profile?.firstName} />
            <InfoItem label="Фамилия" value={profile?.lastName} />
            <InfoItem label="Email" value={profile?.email} />
            <InfoItem label="Телефон" value={profile?.phoneNumber} />
            <InfoItem label="Адрес" value={profile?.address} />
            <InfoItem label="Дата рождения" value={formatDate(profile?.birthDate)} />
            <InfoItem label="Способ связи" value={profile?.preferredContactMethod} />
            <InfoItem label="Профиль подтверждён" value={profile?.verified ? "Да" : "Нет"} />
            <InfoItem
              label="Дата изменения профиля"
              value={formatDateTime(profile?.lastModifiedAt)}
            />
          </div>
        </div>
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