import { toast } from "@/hooks/use-toast";

export async function asyncHandler<T>(
  promise: Promise<T>,
  errorMessage = "Something went wrong"
): Promise<T | null> {
  try {
    return await promise;
  } catch (error: any) {
    console.error(error?.message);
    toast({
      title: "Error",
      description: error?.response?.data?.message || errorMessage,
      variant: "destructive",
    });
    return null;
  }
}
