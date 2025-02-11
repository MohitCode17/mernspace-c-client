import React, { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LoaderCircle, Plus } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { addAddress } from "@/lib/http/api";

const formSchema = z.object({
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
});

const AddAddress = ({ customerId }: { customerId: string | undefined }) => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const addressForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ["address", customerId],
    mutationFn: async (address: string) => {
      // TODO: ADD PROPER CHECK FOR CUSTOMER ID, IN REAL IT CAN BE UNDEFINED TOO...
      return await addAddress(customerId!, address);
    },

    onSuccess: () => {
      addressForm.reset();
      setIsModalOpen(false);
      return queryClient.invalidateQueries({ queryKey: ["customer"] });
    },
  });

  const handleAddressAdd = (data: z.infer<typeof formSchema>) => {
    console.log("Data", data);
    mutate(data.address);
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <DialogTrigger asChild>
        <Button size={"sm"} variant={"link"}>
          <Plus size={"16"} />
          <span className="ml-2">Add New Address</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Form {...addressForm}>
          <form onSubmit={addressForm.handleSubmit(handleAddressAdd)}>
            <DialogHeader>
              <DialogTitle>Add Address</DialogTitle>
              <DialogDescription>
                We can save your address for next time order.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <FormField
                  name="address"
                  control={addressForm.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea className="mt-2" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <span className="flex items-center gap-2">
                    <LoaderCircle className="animate-spin" />
                    <span>Please wait...</span>
                  </span>
                ) : (
                  "Save changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddAddress;
