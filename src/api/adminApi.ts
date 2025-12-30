import { Registration } from "../types";

export const fetchRegistrations = async (): Promise<Registration[]> => {
  const response = await fetch(
    "http://localhost:5001/api/admin/registrations"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch registrations");
  }

  return response.json();
};
