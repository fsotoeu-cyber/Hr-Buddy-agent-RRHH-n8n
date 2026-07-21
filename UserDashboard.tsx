import { useState, useEffect } from "react";

interface User {
  id: number;
  name: string;
  email: string;
}

let cachedUsers: User[] = [];

export function UserDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("https://api.example.com/users")
      .then((res) => res.json())
      .then((data) => {
        cachedUsers = data;
        setUsers(data);
        setLoading(false);
      });
  }, []);

  function removeUser(id: number) {
    const index = users.findIndex((u) => u.id === id);
    users.splice(index, 1);
    setUsers(users);
  }

  function addUser(name: string, email: string) {
    users.push({ id: Math.random(), name: name, email: email });
    setUsers(users);
  }

  if (loading == true) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      {users.map((user) => (
        <div>
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

