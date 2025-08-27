import { InventoryItem } from "../types/inventory";

interface Props {
  items: InventoryItem[];
}

export default function InventoryList({ items }: Props) {
  return (
    <div>
      <h2>Inventory Items</h2>
      {items.length === 0 && <p>No items yet.</p>}
      <ul>
        {items.map(item => (
          <li key={item.id}>
            <strong>{item.name}</strong> - {item.category} - Qty: {item.quantity}
            {item.series && <span> (Series: {item.series.join(", ")})</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
