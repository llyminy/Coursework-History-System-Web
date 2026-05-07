import { useParams } from "react-router-dom";

export default function UserDetailsPage() {
  const { userId } = useParams();

  return (
    <div>
      <h1>Профиль пользователя</h1>
      <p>ID пользователя: {userId}</p>
    </div>
  );
}