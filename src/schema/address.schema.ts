import { ISession } from "@/interfaces/order.interface";
import * as z from "zod";

export const addressFormSchema = z.object({
  cartId: z
    .string()
    .nonempty({ message: "CartId is required" })
    .min(3, "CartId must be at least 3 characters long"),
  details: z
    .string()
    .nonempty({ message: "Name is required" })
    .min(3, "Name must be at least 3 characters long"),
  city: z
    .string()
    .nonempty({ message: "Name is required" })
    .min(3, "Name must be at least 3 characters long"),

  phone: z
    .string()
    .nonempty({ message: "Phone is required" })
    .regex(/^(002|\+2)?01[0-25][0-9]{8}$/, {
      message: "Invalid egyptian phone number",
    }),
  paymentMethod: z.enum(["cash", "card"], {
    message: "Payment method is required",
  }),
});

export type AddressFormSchemaType = z.infer<typeof addressFormSchema>;

export const addressFormState = {
  success: false,
  error: {},
  message: null,
  data: "/cart",
};

export type addressFormStateType = {
  success: boolean;
  error: {
    details?: string[] | null;
    city?: string[] | null;
    phone?: string[] | null;
    paymentMethod?: string[] | null;
    cartId?: string[] | null;
  };
  message: string | null;
  data: string;
};
