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
import { useRouter, useSearchParams } from "next/navigation";

const TenantSelect = ({ tenants }: { tenants: { data: Tenant[] } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleValueChange = (value: string) => {
    router.push(`/?restaurantId=${value}`);
  };

  return (
    <Select
      onValueChange={handleValueChange}
      defaultValue={searchParams.get("restaurantId") || ""}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Restaurant" />
      </SelectTrigger>
      <SelectContent>
        {tenants?.data.map((tenant) => (
          <SelectItem value={String(tenant.id)} key={tenant.id}>
            {tenant.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TenantSelect;
