"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import CustomButton from "@/components/shared/CustomButton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import { useActionState, useEffect } from "react";
import {
  addressFormSchema,
  AddressFormSchemaType,
  addressFormState,
} from "@/schema/address.schema";
import { handlePayment } from "@/services/orders.service";
import { useCart } from "@/context/CartContext";

export default function CheckoutPage() {
  const { cartDetails, setCartDetails } = useCart();
  const [action, formAction] = useActionState(handlePayment, addressFormState);
  const router = useRouter();
  const form = useForm<AddressFormSchemaType>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      cartId: cartDetails?.cartId || "",
      details: "",
      city: "",
      phone: "",
      paymentMethod: "cash",
    },
  });

  console.log("action", action);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (action) {
      if (!action.success && action.message) {
        toast.error(action.message, {
          position: "top-center",
        });
      }
      if (form.getValues("paymentMethod") === "cash") {
        if (action.success && action.message) {
          toast.success(action.message, {
            position: "top-center",
          });
          setCartDetails(null);
          timeout = setTimeout(() => {
            router.push("/allorders");
          }, 2000);
        }
      } else {
        if (action.success && action.message) {
          window.location.href = action.data as string;
        }
      }
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [action, form, router, setCartDetails]);

  useEffect(() => {
    if (cartDetails) {
      form.setValue("cartId", cartDetails.cartId);
    }
  }, [cartDetails, form]);

  return (
    <section className="py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <Form {...form}>
          <form action={formAction} className="space-y-8">
            {/********** Cart ID Field  *******/}
            <FormField
              control={form.control}
              name="cartId"
              render={({ field }) => (
                <FormItem hidden>
                  <FormLabel>Cart ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Address in details"
                      {...field}
                      value={cartDetails?.cartId}
                    />
                  </FormControl>
                  <FormMessage>{action.error?.cartId?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            {/********** Address Field  *******/}
            <FormField
              control={form.control}
              name="details"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address in details</FormLabel>
                  <FormControl>
                    <Input placeholder="Address in details" {...field} />
                  </FormControl>
                  <FormMessage>{action.error?.details?.[0]}</FormMessage>
                </FormItem>
              )}
            />
            {/********** City Field  *******/}
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City </FormLabel>
                  <FormControl>
                    <Input placeholder="City " {...field} />
                  </FormControl>
                  <FormMessage>{action.error?.city?.[0]}</FormMessage>
                </FormItem>
              )}
            />

            {/********** Phone Field  *******/}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Phone" {...field} type="tel" />
                  </FormControl>
                  <FormMessage>{action.error?.phone?.[0]}</FormMessage>{" "}
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethod"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Payment Method</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      name={field.name}
                      className="flex flex-col">
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="cash" />
                        </FormControl>
                        <FormLabel className="font-normal">Cash</FormLabel>
                      </FormItem>
                      <FormItem className="flex items-center gap-3">
                        <FormControl>
                          <RadioGroupItem value="card" />
                        </FormControl>
                        <FormLabel className="font-normal">Card</FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <CustomButton type="submit">Submit</CustomButton>
          </form>
        </Form>
      </div>
    </section>
  );
}
