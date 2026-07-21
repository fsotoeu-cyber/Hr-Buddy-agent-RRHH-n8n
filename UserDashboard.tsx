import { useState, useEffect, useCallback } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

export function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("https://api.example.com/users")
      .then((res) => {
        if (!res.ok) throw new Error("Error al cargar usuarios");
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const removeUser = useCallback((id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
  }, []);

  const addUser = useCallback((name: string, email: string) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      name: name.trim(),
      email: email.trim(),
    };
    setUsers((prev) => [...prev, newUser]);
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
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
} 12385858 ´´ç´´cfkgkgkgkg¡gg
