import { useEffect, useState } from "react";
import { usersApi } from "../api/usersApi";
import RestorePanel from "./RestorePanel";

export default function HistoryPanel() {
  const role = localStorage.getItem("role");
  const currentUserId = localStorage.getItem("currentUserId");

  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(
    role === "ADMIN" ? "" : currentUserId || ""
  );

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showRestore, setShowRestore] = useState(false);

  useEffect(() => {
    if (role === "ADMIN") {
      loadUsers();
    }
  }, [role]);

  useEffect(() => {
    loadHistory(selectedUserId);
  }, [selectedUserId]);

  const loadUsers = async () => {
    try {
      const data = await usersApi.getAllUsers();
      setUsers(data);

    } catch (error) {
      console.error(error);
      setMessage("Не удалось загрузить пользователей");
    }
  };

  const loadHistory = async (userId) => {
    try {
      setLoading(true);
      setMessage("");

      const data = userId ? await usersApi.getUserHistory(userId) : await usersApi.getAllHistory();
      setHistory(data);
    } catch (error) {
      console.error(error);
      setMessage("Не удалось загрузить историю изменений");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("ru-RU");
  };

  return (
    <div>
      <div className="panel-header">
        <div>
          <h2>
            {role === "ADMIN"
              ? "История изменений"
              : "История моих изменений"}
          </h2>
          <p>
            Здесь отображаются события изменения данных, изменённые поля и
            контекст выполнения операции
          </p>
        </div>

        {selectedUserId && (
          <div className="panel-actions">
            <button
              className="secondary-button"
              onClick={() => loadHistory(selectedUserId)}
            >
              Обновить историю
            </button>

            {role === "ADMIN" && (
              <button
                className="primary-small-button"
                onClick={() => setShowRestore((prev) => !prev)}
              >
                {showRestore ? "Скрыть восстановление" : "Восстановить данные"}
              </button>
            )}
          </div>
        )}
      </div>

      {role === "ADMIN" && (
        <div className="selector-card">
          <label>
            Выберите пользователя
            <select
              value={selectedUserId}
              onChange={(event) => setSelectedUserId(event.target.value)}
            >
              <option value="">Не выбран</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.profile?.firstName} {user.profile?.lastName} —{" "}
                  {user.profile?.email}
                </option>
              ))}
            </select>
          </label>
        </div>
      )}

      {message && <div className="message">{message}</div>}

      {!selectedUserId && (
        <div className="empty-state">
          Выберите пользователя, чтобы посмотреть его историю изменений
        </div>
      )}

      {loading && <p>Загрузка истории...</p>}

      {!loading && selectedUserId && history.length === 0 && (
        <div className="empty-state">
          История изменений пока отсутствует
        </div>
      )}

      {role === "ADMIN" && showRestore && selectedUserId && (
        <RestorePanel
          userId={selectedUserId}
          onRestored={() => {
            loadHistory(selectedUserId);
          }}
        />
      )}

      {!loading && history.length > 0 && (
        <div className="history-list">
          {history.map((event) => (
            <div className="history-card" key={event.id}>
              <div className="history-card-header">
                <div>
                  <h3>{event.eventType}</h3>
                  <p>{formatDateTime(event.timestamp)}</p>
                </div>

                <span className="badge">
                  Изменений: {event.changesCount || event.fieldChanges?.length || 0}
                </span>
              </div>

              <div className="history-meta">
                <span>
                  <strong>Event ID:</strong> {event.id}
                </span>
                <span>
                  <strong>Причина:</strong> {event.reason || "—"}
                </span>
                <span>
                  <strong>Комментарий:</strong> {event.comment || "—"}
                </span>
              </div>

              <div className="field-changes">
                <h4>Изменённые поля</h4>

                {event.fieldChanges?.length > 0 ? (
                  <table>
                    <thead>
                      <tr>
                        <th>Поле</th>
                        <th>Старое значение</th>
                        <th>Новое значение</th>
                        <th>Тип</th>
                      </tr>
                    </thead>

                    <tbody>
                      {event.fieldChanges.map((field) => (
                        <tr key={field.id}>
                          <td>{field.fieldName}</td>
                          <td>{field.oldValue || "—"}</td>
                          <td>{field.newValue || "—"}</td>
                          <td>{field.changeType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="muted">Нет информации об изменённых полях</p>
                )}
              </div>

              {event.context && (
                <div className="context-block">
                  <h4>Контекст изменения</h4>

                  <div className="details-grid">
                    <InfoItem
                      label="Инициатор"
                      value={event.context.initiatorName}
                    />
                    <InfoItem
                      label="Тип инициатора"
                      value={event.context.initiatorType}
                    />
                    <InfoItem
                      label="Роль инициатора"
                      value={event.context.initiatorRole}
                    />
                    <InfoItem
                      label="Источник"
                      value={event.context.source}
                    />
                    <InfoItem
                      label="Канал запроса"
                      value={event.context.requestChannel}
                    />
                    <InfoItem
                      label="IP-адрес"
                      value={event.context.ipAddress}
                    />
                    <InfoItem
                      label="Request ID"
                      value={event.context.requestId}
                      mono
                    />
                    <InfoItem
                      label="Метаданные"
                      value={event.context.additionalMetadata}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
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