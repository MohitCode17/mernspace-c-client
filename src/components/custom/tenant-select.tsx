"use client";
import { Tenant } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React from "react";
import { useRouter } from "next/navigation";

const TenantSelect = ({ tenants }: { tenants: { data: Tenant[] } }) => {
  const router = useRouter();

  const handleValueChange = (value: string) => {
    router.push(`/?restaurantId=${value}`);
  };

  return (
    <Select onValueChange={handleValueChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Restaurant" />
      </SelectTrigger>
      <SelectContent>
        {tenants?.data.map((tenant) => (
          <SelectItem value={tenant.id} key={tenant.id}>
            {tenant.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TenantSelect;
