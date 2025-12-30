import { useEffect, useState } from "react";
import { fetchRegistrations } from "../api/adminApi";

const Dashboard = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchRegistrations();
        setData(result);
      } catch (error) {
        console.error("Error fetching registrations:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <p>Loading registrations...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Total Registrations: {data.length}</h2>

      <table border={1} cellPadding={10} cellSpacing={0}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Company</th>
            <th>Phone</th>
            <th>Registration Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>{item.registration_type}</td>
              <td>{item.company || "-"}</td>
              <td>{item.phone || "-"}</td>
              <td>
                {item.created_at
                  ? new Date(item.created_at).toLocaleString()
                  : "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
