import { useEffect, useState } from "react";
import InventoryList from "./components/InventoryList";
import InventoryForm from "./components/InventoryForm";
import { InventoryItem } from "./types/inventory";
import api from "./api/axios";

function App() {
  const [items, setItems] = useState<InventoryItem[]>([]);

  const fetchItems = async () => {
    const { data } = await api.get<InventoryItem[]>("/inventory");
    setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div>
      <h1>Inventory System</h1>
      <InventoryForm onAdd={fetchItems} />
      <InventoryList items={items} />
    </div>
  );
}

export default App;
