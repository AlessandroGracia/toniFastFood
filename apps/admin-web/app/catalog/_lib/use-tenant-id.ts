"use client";

import { useEffect, useState } from "react";
import { tenantStorageKey } from "./catalog-api";

export function useTenantId() {
  const [tenantId, setTenantIdState] = useState("");

  useEffect(() => {
    setTenantIdState(window.localStorage.getItem(tenantStorageKey) ?? "");
  }, []);

  const setTenantId = (value: string) => {
    setTenantIdState(value);
    window.localStorage.setItem(tenantStorageKey, value);
  };

  return { tenantId, setTenantId };
}
