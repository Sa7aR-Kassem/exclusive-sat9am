"use server";

import { getUserId, getUserToken } from "@/lib/server-utils";
import {
  addressFormSchema,
  addressFormStateType,
} from "@/schema/address.schema";

export async function handlePayment(
  formState: addressFormStateType,
  formData: FormData
): Promise<addressFormStateType> {
  const formValues = {
    details: formData.get("details"),
    city: formData.get("city"),
    phone: formData.get("phone"),
  };

  const cartId = formData.get("cartId") as string;
  const paymentMethod = formData.get("paymentMethod") as string;

  const parsedData = addressFormSchema.safeParse({
    ...formValues,
    cartId,
    paymentMethod,
  });

  if (!parsedData.success) {
    return {
      success: false,
      error: parsedData.error?.flatten().fieldErrors,
      message: null,
      data: "/checkout",
    };
  }

  const endpoint =
    paymentMethod === "cash"
      ? `api/v1/orders/${cartId}`
      : `api/v1/orders/checkout-session/${cartId}?url=${process.env.NEXTAUTH_URL}`;

  try {
    const token = await getUserToken();
    if (!token)
      return {
        error: {},
        success: false,
        message: "User not logged in. Please login to add to cart",
        data: "/checkout",
      };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${endpoint}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          token: token as string,
        },
        body: JSON.stringify({ shippingAddress: formValues }),
      }
    );

    const data = await res.json();

    console.log(data);

    if (!res.ok) {
      return {
        success: false,
        error: {},
        message: data.message || "Error in Placing order",
        data: "/checkout",
      };
    }

    return {
      success: true,
      error: {},
      message: data.message || "Order placed successfully",
      data: data.session.url,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      error: {},
      message: (error as Error).message || "Error in Placing order",
      data: "/checkout",
    };
  }
}

export async function getMyOrders() {
  try {
    const userId = await getUserId();
    if (!userId)
      return {
        error: {},
        success: false,
        message: "User not logged in.",
        data: "/checkout",
      };
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/v1/orders/user/${userId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await res.json();

    // console.log(data);

    if (!res.ok) {
      return {
        success: false,
        error: {},
        message: data.message || "Error in Fetching orders",
        data: "/checkout",
      };
    }

    return {
      success: true,
      error: {},
      message: data.message || "Fetched orders successfully",
      data: data.session.url,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      error: {},
      message: (error as Error).message || "Error in Fetching orders",
      data: "/checkout",
    };
  }
}
