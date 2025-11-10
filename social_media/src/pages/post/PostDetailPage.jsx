import { useState } from "react";

export default function PostDetailPage() {
  const [count, setCount] = useState(0); // ✅ Khai báo biến state

  return (
    <div>
      <h1>PostDetailPage</h1>
      <p>Giá trị hiện tại: {count}</p>
      <button onClick={() => setCount(count + 1)}>Tăng</button>
    </div>
  );
}
