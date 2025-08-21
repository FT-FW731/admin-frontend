import React, { useEffect, useState } from "react";
import { API } from "../api/axiosInstance";

type UseGetDataParams = Record<string, any> | null | undefined;

interface UseGetDataResult<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function useGetData<T = any>(
  url: string,
  params?: UseGetDataParams
): UseGetDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchData() {
    if (params?.ignore === true) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await API.get(
        url,
        params && typeof params === "object" ? params : {}
      );
      if (res?.status === 200) {
        setData(res.data);
      } else {
        setData(null);
        setError(res?.data?.response?.error?.message || "Something went wrong");
      }
    } catch (err: any) {
      setData(null);
      setError(err?.message || "Something went wrong");
    }
    setIsLoading(false);
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, JSON.stringify(params)]);

  return { data, isLoading, error, refetch: fetchData };
}

export default useGetData;
