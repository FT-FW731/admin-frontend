import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Edit,
  Key,
  Mail,
  Calendar,
  Users,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useGetData from "@/hooks/use-get-data";
import TableSkeleton from "@/components/TableSkeleton";
import { toast } from "@/hooks/use-toast";
import { API } from "@/api/axiosInstance";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

// Mock client data
const mockClients = [
  {
    id: "CL001",
    name: "Acme Corporation",
    email: "admin@acme.com",
    status: "Active",
    subUsers: 5,
    apiKey: "ak_live_***********",
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    lastLogin: "2024-01-18",
  },
  {
    id: "CL002",
    name: "TechStart Solutions",
    email: "contact@techstart.com",
    status: "Active",
    subUsers: 3,
    apiKey: "ak_live_***********",
    startDate: "2024-02-01",
    endDate: "2024-12-31",
    lastLogin: "2024-01-17",
  },
  {
    id: "CL003",
    name: "Global Enterprises",
    email: "info@global.com",
    status: "Inactive",
    subUsers: 0,
    apiKey: "ak_live_***********",
    startDate: "2023-11-01",
    endDate: "2024-01-31",
    lastLogin: "2024-01-10",
  },
];

const Clients = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 1,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
    nextPage: null,
    previousPage: null,
  });
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const { data, isLoading, error, refetch } = useGetData(
    `/clients?page=${pagination.currentPage}&limit=${pagination.limit}&search=${debouncedSearchTerm}`
  );

  // Extract API data
  const clients = data?.users || [];
  const stats = {
    totalClients: data?.cards?.totalClients || 0,
    totalUsers: data?.cards?.totalUsers || 0,
    totalSubUsers: data?.cards?.totalSubUsers || 0,
    // You can add more stats if available in API response
  };

  useEffect(() => {
    if (data?.pagination) {
      setPagination(data.pagination);
    }
  }, [data]);

  const filteredClients = clients.filter(
    (client: { name: string; email: string }) =>
      client.name?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      client.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  // Add state for create client dialog
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    mobile: "",
  });
  const [createErrors, setCreateErrors] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    mobile: "",
  });

  // Add state for update client dialog
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    email: "",
    company: "",
    mobile: "",
  });
  const [updateErrors, setUpdateErrors] = useState({
    name: "",
    email: "",
    company: "",
    mobile: "",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState(null);

  // Create client handler
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = {
      name: "",
      email: "",
      password: "",
      company: "",
      mobile: "",
    };

    if (!createFormData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!createFormData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(createFormData.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }
    if (!createFormData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (createFormData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }
    if (!createFormData.company.trim()) {
      newErrors.company = "Company is required";
      valid = false;
    }
    if (
      !createFormData.mobile.trim() ||
      !/^\d{10}$/.test(createFormData.mobile)
    ) {
      newErrors.mobile = "Mobile is required and must be 10 digits";
      valid = false;
    }

    setCreateErrors(newErrors);
    if (!valid) return;

    const { success } = await API.post("/clients", createFormData);
    if (success) {
      toast({
        title: "Client created",
        description: "The client has been successfully created.",
        variant: "default",
      });
      setIsCreateDialogOpen(false);
      setCreateFormData({
        name: "",
        email: "",
        password: "",
        company: "",
        mobile: "",
      });
      refetch();
    }
  };

  // Open update dialog
  const handleOpenUpdateDialog = (client: any) => {
    setSelectedClient(client);
    setUpdateFormData({
      name: client.name || "",
      email: client.email || "",
      company: client.company || "",
      mobile: client.mobile || "",
    });
    setUpdateErrors({ name: "", email: "", company: "", mobile: "" });
    setIsUpdateDialogOpen(true);
  };

  // Update client handler
  const handleUpdateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { name: "", email: "", company: "", mobile: "" };

    if (!updateFormData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!updateFormData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(updateFormData.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }
    if (!updateFormData.company.trim()) {
      newErrors.company = "Company is required";
      valid = false;
    }
    if (
      !updateFormData.mobile.trim() ||
      !/^\d{10}$/.test(updateFormData.mobile)
    ) {
      newErrors.mobile = "Mobile is required and must be 10 digits";
      valid = false;
    }

    setUpdateErrors(newErrors);
    if (!valid) return;

    const { success } = await API.put(
      `/clients/${selectedClient.id}`,
      updateFormData
    );
    if (success) {
      toast({
        title: "Client updated",
        description: "The client has been successfully updated.",
        variant: "default",
      });
      setIsUpdateDialogOpen(false);
      setSelectedClient(null);
      refetch();
    }
  };

  const handleDeleteClient = (client: any) => {
    setClientToDelete(client);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteClient = async () => {
    if (!clientToDelete) return;
    const { success } = await API.delete(`/clients/${clientToDelete.id}`);
    if (success) {
      toast({
        title: "Client deleted",
        description: "The client has been successfully deleted.",
        variant: "default",
      });
      setIsDeleteDialogOpen(false);
      setClientToDelete(null);
      refetch();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            Clients Management
          </h1>
          <p className="text-muted-foreground">
            Manage client accounts, credentials, and API access
          </p>
        </div>

        {/* Create Client Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
              <DialogDescription>
                Create a new client account.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateClient}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="name"
                      placeholder="Enter name"
                      value={createFormData.name}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          name: e.target.value,
                        })
                      }
                    />
                    {createErrors.name && (
                      <div className="text-xs text-destructive mt-1">
                        {createErrors.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@company.com"
                      value={createFormData.email}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          email: e.target.value,
                        })
                      }
                    />
                    {createErrors.email && (
                      <div className="text-xs text-destructive mt-1">
                        {createErrors.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter password"
                      value={createFormData.password}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          password: e.target.value,
                        })
                      }
                    />
                    {createErrors.password && (
                      <div className="text-xs text-destructive mt-1">
                        {createErrors.password}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="company" className="text-right">
                    Company
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="company"
                      placeholder="Enter company"
                      value={createFormData.company}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          company: e.target.value,
                        })
                      }
                    />
                    {createErrors.company && (
                      <div className="text-xs text-destructive mt-1">
                        {createErrors.company}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="mobile" className="text-right">
                    Mobile
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="mobile"
                      placeholder="Enter mobile"
                      value={createFormData.mobile}
                      onChange={(e) =>
                        setCreateFormData({
                          ...createFormData,
                          mobile: e.target.value,
                        })
                      }
                    />
                    {createErrors.mobile && (
                      <div className="text-xs text-destructive mt-1">
                        {createErrors.mobile}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="gradient-primary text-primary-foreground"
                  type="submit"
                >
                  Create Client
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Update Client Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Client</DialogTitle>
              <DialogDescription>
                Update client account details.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleUpdateClient}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="update-name" className="text-right">
                    Name
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="update-name"
                      placeholder="Enter name"
                      value={updateFormData.name}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          name: e.target.value,
                        })
                      }
                    />
                    {updateErrors.name && (
                      <div className="text-xs text-destructive mt-1">
                        {updateErrors.name}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="update-email" className="text-right">
                    Email
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="update-email"
                      type="email"
                      placeholder="admin@company.com"
                      value={updateFormData.email}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          email: e.target.value,
                        })
                      }
                    />
                    {updateErrors.email && (
                      <div className="text-xs text-destructive mt-1">
                        {updateErrors.email}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="update-company" className="text-right">
                    Company
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="update-company"
                      placeholder="Enter company"
                      value={updateFormData.company}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          company: e.target.value,
                        })
                      }
                    />
                    {updateErrors.company && (
                      <div className="text-xs text-destructive mt-1">
                        {updateErrors.company}
                      </div>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="update-mobile" className="text-right">
                    Mobile
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="update-mobile"
                      placeholder="Enter mobile"
                      value={updateFormData.mobile}
                      onChange={(e) =>
                        setUpdateFormData({
                          ...updateFormData,
                          mobile: e.target.value,
                        })
                      }
                    />
                    {updateErrors.mobile && (
                      <div className="text-xs text-destructive mt-1">
                        {updateErrors.mobile}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="gradient-primary text-primary-foreground"
                  type="submit"
                >
                  Update Client
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Total Clients
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.totalClients}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* You can add more info if available */}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Active Clients
            </CardTitle>
            <Users className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* 90% of total clients */}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Sub Users
            </CardTitle>
            <Users className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.totalSubUsers}
            </div>
            <p className="text-xs text-muted-foreground">
              {/* Average 2.7 per client */}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Client Directory
          </CardTitle>
          <CardDescription>
            Search and manage all client accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-end items-center mb-2 space-x-2">
            <Button
              variant="outline"
              disabled={!pagination.hasPreviousPage}
              onClick={() =>
                setPagination((prev) => ({
                  ...prev,
                  currentPage: pagination.previousPage ?? prev.currentPage,
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
                  currentPage: pagination.nextPage ?? prev.currentPage,
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
                  <TableHead>Client</TableHead>
                  <TableHead>Sub Users</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients?.length <= 0 && isLoading ? (
                  <TableSkeleton columns={6} />
                ) : clients?.length <= 0 && !isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center text-muted-foreground"
                    >
                      No clients found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredClients.map(
                    (client: {
                      id: number;
                      name: string;
                      email: string;
                      subUsers: number;
                      company: string;
                      mobile: string;
                      credits: number;
                    }) => (
                      <TableRow key={client.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{client.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {client.email}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              ID: {client.id}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{client.subUsers}</TableCell>
                        <TableCell>{client.company}</TableCell>
                        <TableCell>{client.mobile}</TableCell>
                        <TableCell>{client.credits}</TableCell>
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
                                onClick={() => handleOpenUpdateDialog(client)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit Client
                              </DropdownMenuItem>
                              {/* <DropdownMenuItem>
                            <Key className="mr-2 h-4 w-4" />
                            Reset API Key
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Send Credentials
                          </DropdownMenuItem> */}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => handleDeleteClient(client)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this client?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDeleteClient}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Clients;
