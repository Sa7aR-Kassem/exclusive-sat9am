import { getMyOrders } from "@/services/orders.service";
import React from "react";

export default async function OrdersPage() {
  const res = await getMyOrders();
  console.log(res);
  return <div>OrdersPage</div>;
}
