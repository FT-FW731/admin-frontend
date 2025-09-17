import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API } from "@/api/axiosInstance";
import TableSkeleton from "@/components/TableSkeleton";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import useGetData from "@/hooks/use-get-data";
import { Label } from "@/components/ui/label";

const AddPromoDialog = ({
  open,
  onOpenChange,
  onCreate,
  loading,
  form,
  setForm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: () => void;
  loading: boolean;
  form: { name: string; code: string; units: string; discount: string };
  setForm: React.Dispatch<
    React.SetStateAction<{ name: string; code: string; units: string; discount: string }>
  >;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[520px]">
      <DialogHeader>
        <DialogTitle>Add Promo Code</DialogTitle>
        <DialogDescription>Create a new promo code</DialogDescription>
      </DialogHeader>

      <div className="grid gap-4 py-2">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="promo-name">Name</Label>
          <div className="col-span-3">
            <Input
              id="promo-name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="promo-code">Code</Label>
          <div className="col-span-3">
            <Input
              id="promo-code"
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="promo-units">Units</Label>
          <div className="col-span-3">
            <Input
              id="promo-units"
              type="number"
              min={0}
              value={form.units}
              onChange={(e) => setForm((f) => ({ ...f, units: e.target.value }))}
            />
          </div>
        </div>

        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="promo-discount">Discount (%)</Label>
          <div className="col-span-3">
            <Input
              id="promo-discount"
              type="number"
              min={0}
              max={100}
              value={form.discount}
              onChange={(e) => setForm((f) => ({ ...f, discount: e.target.value }))}
            />
          </div>
        </div>
      </div>

      <DialogFooter>
        <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
          Close
        </Button>
        <Button
          className="gradient-primary text-primary-foreground"
          onClick={onCreate}
          disabled={loading}
          loading={loading}
        >
          Create
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default function Promocode() {
  // pagination state (added)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
    nextPage: null as number | null,
    previousPage: null as number | null,
  });

  // useGetData uses pagination params so it refetches when page/limit change
  const { data, isLoading, refetch } = useGetData(
    `/subscriptions/promo-codes?page=${pagination.currentPage}&limit=${pagination.limit}`
  );

  const [promoCodes, setPromoCodes] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [form, setForm] = useState({ name: "", code: "", units: "0", discount: "0" });

  useEffect(() => {
    // API returns records and pagination (if paginated). Map them into state.
    if (data) {
      setPromoCodes(data?.records || []);
      if (data?.pagination) {
        setPagination((prev) => ({
          ...prev,
          currentPage: data.pagination.currentPage ?? prev.currentPage,
          totalPages: data.pagination.totalPages ?? prev.totalPages,
          totalCount: data.pagination.totalCount ?? prev.totalCount,
          limit: data.pagination.limit ?? prev.limit,
          hasNextPage: !!data.pagination.hasNextPage,
          hasPreviousPage: !!data.pagination.hasPreviousPage,
          nextPage: data.pagination.nextPage ?? null,
          previousPage: data.pagination.previousPage ?? null,
        }));
      }
    }
  }, [data]);

  const handleCreate = async () => {
    if (!form.name || !form.code) {
      toast({
        title: "Validation error",
        description: "Name and code are required.",
        variant: "destructive",
      });
      return;
    }
    setCreateLoading(true);
    const payload = {
      name: form.name,
      code: form.code,
      units: Number(form.units),
      discount: Number(form.discount),
    };
    try {
      const { success } = await API.post("/subscriptions/promo-codes", payload);
      if (success) {
        toast({
          title: "Promo code created",
          description: "The promo code has been added.",
          variant: "default",
        });
        setForm({ name: "", code: "", units: "0", discount: "0" });
        setIsDialogOpen(false);
        refetch();
      } else {
        toast({
          title: "Failed to create",
          description: "Unable to create promo code.",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong while creating promo code.",
        variant: "destructive",
      });
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Promo Codes</h1>
          <p className="text-muted-foreground">Manage promotional codes and discounts</p>
        </div>
        <div>
          <Button onClick={() => setIsDialogOpen(true)}>Add Promo Code</Button>
        </div>
      </div>

      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">Promo Codes</CardTitle>
          <CardDescription>List of active promo codes</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Pagination controls (added) */}
          <div className="flex justify-end items-center mb-4 space-x-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPreviousPage}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.previousPage ?? prev.currentPage,
                }))
              }
            >
              Prev
            </Button>
            <span className="text-sm">
              Page {pagination.currentPage} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              disabled={!pagination.hasNextPage}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: prev.nextPage ?? prev.currentPage,
                }))
              }
            >
              Next
            </Button>
            <Label htmlFor="limit" className="ml-4 mr-2 text-sm">
              Rows:
            </Label>
            <select
              id="limit"
              value={pagination.limit}
              onChange={(e) => {
                setPagination((prev) => ({
                  ...prev,
                  limit: Number(e.target.value),
                  currentPage: 1,
                }));
              }}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
            </select>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">S No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Discount (%)</TableHead>
                  <TableHead>Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && promoCodes.length <= 0 ? (
                  <TableSkeleton rows={8} columns={6} />
                ) : promoCodes.length <= 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center text-muted-foreground">
                      No promo codes found.
                    </TableCell>
                  </TableRow>
                ) : (
                  promoCodes.map((p: any, idx: number) => (
                    <TableRow key={p.id ?? idx}>
                      <TableCell>{(pagination.currentPage - 1) * pagination.limit + idx + 1}</TableCell>
                      <TableCell>{p.name}</TableCell>
                      <TableCell className="font-mono">{p.code}</TableCell>
                      <TableCell>{p.units}</TableCell>
                      <TableCell>{p.discount}</TableCell>
                      <TableCell>
                        {p.createdAt ? moment(p.createdAt).format("Do MMM YYYY h:mm A") : "-"}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <AddPromoDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onCreate={handleCreate}
        loading={createLoading}
        form={form}
        setForm={setForm}
      />
    </div>
  );
}
