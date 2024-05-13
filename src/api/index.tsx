export type GroceryItem = {
  id: number;
  name: string;
  amount: number;
  bought: boolean;
};

const BASE_URL = "http://localhost:3001";

export const getGroceryList = async (): Promise<GroceryItem[]> => {
  const response = await fetch(`${BASE_URL}/groceryList`);
  if (!response.ok) {
    throw new Error("Failed to get grocery list");
  }
  return response.json();
};

export const addGroceryItem = async (
  newItem: Omit<GroceryItem, "id">,
): Promise<GroceryItem[]> => {
  const response = await fetch(`${BASE_URL}/groceryList`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newItem),
  });
  if (!response.ok) {
    throw new Error("Failed to add grocery item");
  }
  return response.json();
};

export const updateGroceryItem = async (
  id: number,
  data: Partial<GroceryItem>,
): Promise<GroceryItem[]> => {
  const response = await fetch(`${BASE_URL}/groceryList/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update grocery item");
  }
  return response.json();
};

export const deleteGroceryItem = async (id: number): Promise<GroceryItem[]> => {
  const response = await fetch(`${BASE_URL}/groceryList/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete grocery item");
  }
  return response.json();
};
