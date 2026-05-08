import { useEffect, useState } from "react";
import { usersApi } from "../api/usersApi";

export default function RestorePanel({ userId, onRestored }) {
  const [restorePoints, setRestorePoints] = useState([]);
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userId) {
      loadRestorePoints();
    }
  }, [userId]);

  const loadRestorePoints = async () => {
    try {
      setLoading(true);
      setMessage("");

      const data = await usersApi.getRestorePoints(userId);
      setRestorePoints(data);
    } catch (error) {
      console.error(error);
      setMessage("Не удалось загрузить точки восстановления");
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!selectedTime) {
      setMessage("Выберите точку восстановления");
      return;
    }

    const confirmed = window.confirm(
      "Вы уверены, что хотите восстановить данные пользователя по выбранной точке?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      await usersApi.restoreUserProfile(userId, selectedTime);

      setMessage("Данные пользователя успешно восстановлены");

      await loadRestorePoints();

      if (onRestored) {
        onRestored();
      }
    } catch (error) {
      console.error(error);

      const backendMessage = error.response?.data?.message;

      setMessage(backendMessage || "Ошибка при восстановлении данных");
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (value) => {
    if (!value) return "—";
    return new Date(value).toLocaleString("ru-RU");
  };

  return (
    <div className="restore-panel">
      <div className="restore-header">
        <div>
          <h3>Восстановление данных</h3>
          <p>
            Выберите событие изменения, чтобы восстановить значения полей
          </p>
        </div>

        <button className="secondary-button" onClick={loadRestorePoints}>
          Обновить точки
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      {loading && <p>Загрузка...</p>}

      {!loading && restorePoints.length === 0 && (
        <div className="empty-state">
          Для выбранного пользователя нет доступных точек восстановления
        </div>
      )}

      {restorePoints.length > 0 && (
        <>
          <label className="restore-select">
            Точка восстановления
            <select
              value={selectedTime}
              onChange={(event) => setSelectedTime(event.target.value)}
            >
              <option value="">Выберите событие</option>

              {restorePoints.map((point) => (
                <option key={point.eventId} value={point.timestamp}>
                  {formatDateTime(point.timestamp)} —{" "}
                  {point.changedFields
                    ?.map((field) => field.fieldName)
                    .join(", ")}
                </option>
              ))}
            </select>
          </label>

        <button
            className="primary-button restore-button"
            onClick={handleRestore}
            disabled={loading}
            >
            Восстановить выбранные данные
        </button>

          <div className="restore-points-list">
            {restorePoints.map((point) => (
              <div
                key={point.eventId}
                className={
                  selectedTime === point.timestamp
                    ? "restore-point-card active"
                    : "restore-point-card"
                }
                onClick={() => setSelectedTime(point.timestamp)}
              >
                <div className="restore-point-header">
                  <strong>{formatDateTime(point.timestamp)}</strong>
                  <span>{point.changedFields?.length || 0} полей</span>
                </div>

                <table>
                  <thead>
                    <tr>
                      <th>Поле</th>
                      <th>Будет восстановлено значение</th>
                      <th>Текущее после изменения</th>
                    </tr>
                  </thead>

                  <tbody>
                    {point.changedFields?.map((field) => (
                      <tr key={field.id}>
                        <td>{field.fieldName}</td>
                        <td>{field.oldValue || "—"}</td>
                        <td>{field.newValue || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}