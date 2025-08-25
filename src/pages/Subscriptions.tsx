import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { API } from "@/api/axiosInstance";
import { IndianRupee, MoreHorizontal, Edit } from "lucide-react";
import TableSkeleton from "@/components/TableSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import useGetData from "@/hooks/use-get-data";
import { Label } from "@/components/ui/label";

const SubscriptionUpdatePopup = ({
  open,
  onOpenChange,
  selectedSubscription,
  editFields,
  setEditFields,
  updateLoading,
  handleUpdateSubscription,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSubscription: any;
  editFields: { price: string; description: string; credits: string };
  setEditFields: React.Dispatch<
    React.SetStateAction<{
      price: string;
      description: string;
      credits: string;
    }>
  >;
  updateLoading: boolean;
  handleUpdateSubscription: () => void;
}) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update Subscription</DialogTitle>
        <DialogDescription>
          Make changes to the subscription details
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subscription-name">Name</Label>
          <div className="col-span-3">
            <Input
              id="subscription-name"
              value={selectedSubscription?.name || ""}
              disabled
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subscription-type">Type</Label>
          <div className="col-span-3">
            <Input
              id="subscription-type"
              value={selectedSubscription?.type || ""}
              disabled
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subscription-price">Price</Label>
          <div className="col-span-3">
            <Input
              id="subscription-price"
              value={editFields.price}
              onChange={(e) =>
                setEditFields((f) => ({ ...f, price: e.target.value }))
              }
              type="number"
              min={0}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subscription-credits">Credits</Label>
          <div className="col-span-3">
            <Input
              id="subscription-credits"
              value={editFields.credits}
              onChange={(e) =>
                setEditFields((f) => ({ ...f, credits: e.target.value }))
              }
              type="number"
              min={0}
              disabled={selectedSubscription?.type !== "credits"}
            />
          </div>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="subscription-description">Description</Label>
          <div className="col-span-3">
            <Textarea
              id="subscription-description"
              value={editFields.description}
              className="text-base resize-none"
              onChange={(e) =>
                setEditFields((f) => ({
                  ...f,
                  description: e.target.value,
                }))
              }
              rows={4}
            />
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          onClick={() => onOpenChange(false)}
          disabled={updateLoading}
        >
          Close
        </Button>
        <Button
          className="gradient-primary text-primary-foreground"
          onClick={handleUpdateSubscription}
          disabled={updateLoading}
          loading={updateLoading}
        >
          Update
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

const Subscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSubscription, setSelectedSubscription] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editFields, setEditFields] = useState({
    price: "",
    description: "",
    credits: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const { data, isLoading, refetch } = useGetData(`/subscriptions`);

  useEffect(() => {
    if (data) {
      setSubscriptions(data);
    }
  }, [data]);

  useEffect(() => {
    if (selectedSubscription) {
      setEditFields({
        price: selectedSubscription.price?.toString() || "",
        description: selectedSubscription?.description || "",
        credits: selectedSubscription.credits?.toString() || "",
      });
    }
  }, [selectedSubscription]);

  const handleUpdateSubscription = async () => {
    if (!selectedSubscription) return;
    setUpdateLoading(true);
    const payload: any = {
      price: Number(editFields.price),
      description: editFields.description,
    };
    if (selectedSubscription.type === "credits") {
      payload.credits = Number(editFields.credits);
    }
    const { success } = await API.put(
      `/subscriptions/${selectedSubscription.id}`,
      payload
    );
    if (success) {
      refetch();
      toast({
        title: "Subscription updated",
        description: "Subscription details have been updated.",
        variant: "default",
      });
      setSelectedSubscription(null);
      setEditFields({
        price: "",
        description: "",
        credits: "",
      });
      setIsDialogOpen(false);
    }
    setUpdateLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subscriptions</h1>
          <p className="text-muted-foreground">
            Track subscription plans and billing details
          </p>
        </div>
      </div>

      {/* Subscription Plans Table */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Subscription Plans
          </CardTitle>
          <CardDescription>
            List of available subscription plans
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-20">S No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && subscriptions.length <= 0 ? (
                  <TableSkeleton rows={10} columns={7} />
                ) : subscriptions.length <= 0 && !isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center text-muted-foreground"
                    >
                      No subscriptions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  subscriptions.map(
                    (
                      sub: {
                        id: string;
                        name: string;
                        type: string;
                        price: number;
                        credits: number;
                        description: string;
                      },
                      index: number
                    ) => (
                      <TableRow key={sub.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell>{sub.name}</TableCell>
                        <TableCell>{sub.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <IndianRupee className="w-3 h-3 mr-1" />
                            {sub.price.toLocaleString()}
                          </div>
                        </TableCell>
                        <TableCell>{sub.credits}</TableCell>
                        <TableCell>
                          <span className="text-xs">{sub.description}</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedSubscription(sub);
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Subscription
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  )
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <SubscriptionUpdatePopup
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        selectedSubscription={selectedSubscription}
        editFields={editFields}
        setEditFields={setEditFields}
        updateLoading={updateLoading}
        handleUpdateSubscription={handleUpdateSubscription}
      />
    </div>
  );
};

export default Subscriptions;
