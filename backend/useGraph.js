import React, { useState } from "react";
import { createContainer } from "unstated-next";

function useGraph() {
  const [graph, setGraph] = useState(null);

  const decrement = () => setCount(count - 1);
  const increment = () => setCount(count + 1);

  return { count, decrement, increment };
}
