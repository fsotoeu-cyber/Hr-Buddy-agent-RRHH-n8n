import { useState, useEffect, useCallback } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

export function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.example.com/users")
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const removeUser = useCallback((id: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  }, []);

  const addUser = useCallback((name: string, email: string) => {
    const newUser: User = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
    };
    setUsers((prev) => [...prev, newUser]);
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>
          <span>{user.name}</span>
          <span>{user.email}</span>
          <button onClick={() => removeUser(user.id)}>Eliminar</button>
        </div>
      ))}
      <button onClick={() => addUser("Nuevo", "nuevo@mail.com")}>
        Agregar usuario
      </button>
    </div>
  );
}
