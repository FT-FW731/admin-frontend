import { useEffect, useState } from "react";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Edit,
  Shield,
  Users,
  Settings,
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
import { API } from "@/api/axiosInstance";
import { toast } from "@/hooks/use-toast";
import useGetData from "@/hooks/use-get-data";
import TableSkeleton from "@/components/TableSkeleton";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { debounce } from "@/utils/helpers";

const mockUsers = [
  {
    id: "USR001",
    name: "John Doe",
    email: "john@panel.com",
    role: "Super Admin",
    status: "Active",
    lastLogin: "2024-01-18",
    permissions: {
      userAccess: true,
      dataManagement: true,
      clientAccess: true,
      systemSettings: true,
    },
  },
  {
    id: "USR002",
    name: "Jane Smith",
    email: "jane@panel.com",
    role: "Admin",
    status: "Active",
    lastLogin: "2024-01-17",
    permissions: {
      userAccess: false,
      dataManagement: true,
      clientAccess: true,
      systemSettings: false,
    },
  },
  {
    id: "USR003",
    name: "Mike Johnson",
    email: "mike@acme.com",
    role: "User",
    status: "Active",
    lastLogin: "2024-01-16",
    permissions: {
      userAccess: false,
      dataManagement: false,
      clientAccess: true,
      systemSettings: false,
    },
  },
];

const UsersRoles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    superAdmins: 0,
    admins: 0,
    noOfUsers: 0,
  });
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateFormData, setUpdateFormData] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [updateErrors, setUpdateErrors] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
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
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    handler();
    return () => {
      handler.cancel && handler.cancel();
    };
  }, [searchTerm]);

  const { data, isLoading, error, refetch } = useGetData(
    `/auth/users?page=${pagination.currentPage}&limit=${pagination.limit}&search=${debouncedSearchTerm}`
  );

  useEffect(() => {
    if (data) {
      const cards = data?.cards;
      setStats({
        totalUsers: cards?.totalUsers || 0,
        superAdmins:
          cards?.usersByRole?.find(
            (r: { role: string }) => r.role === "Super Admin"
          )?.count || 0,
        admins:
          cards?.usersByRole?.find((r: { role: string }) => r.role === "Admin")
            ?.count || 0,
        noOfUsers:
          cards?.usersByRole?.find((r: { role: string }) => r.role === "User")
            ?.count || 0,
      });
      setUsers(data?.users);
      if (data?.pagination) {
        setPagination(data.pagination);
      }
    }
  }, [data]);

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { name: "", email: "", role: "", password: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)) {
      newErrors.email = "Invalid email address";
      valid = false;
    }
    if (!formData.role) {
      newErrors.role = "Role is required";
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) return;

    const { success } = await API.post("/auth/signup", formData);
    if (success) {
      toast({
        title: "User created",
        description: "The user has been successfully created.",
        variant: "default",
      });
      setIsAddDialogOpen(false);
      refetch();
    }
  };

  const handleOpenUpdateDialog = (user: any) => {
    setSelectedUser(user);
    setUpdateFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });
    setUpdateErrors({ name: "", email: "", role: "" });
    setIsUpdateDialogOpen(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { name: "", email: "", role: "" };

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
    if (!updateFormData.role) {
      newErrors.role = "Role is required";
      valid = false;
    }

    setUpdateErrors(newErrors);
    if (!valid) return;

    const { success } = await API.put(
      `/auth/users/${selectedUser.id}`,
      updateFormData
    );
    if (success) {
      toast({
        title: "User updated",
        description: "The user has been successfully updated.",
        variant: "default",
      });
      setIsUpdateDialogOpen(false);
      refetch();
    }
  };

  const handleDeleteUser = (user: any) => {
    setUserToDelete(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    const { success } = await API.delete(`/auth/users/${userToDelete.id}`);
    if (success) {
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted.",
        variant: "default",
      });
      setIsDeleteDialogOpen(false);
      setUserToDelete(null);
      refetch();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            User & Roles Management
          </h1>
          <p className="text-muted-foreground">
            Manage user accounts and role-based permissions
          </p>
        </div>

        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add New User</DialogTitle>
              <DialogDescription>
                Create a new user account with role-based permissions.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Full Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="name"
                    placeholder="Enter full name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    error={errors.name}
                  />
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
                    placeholder="user@company.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    error={errors.email}
                  />
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
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    error={errors.password}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select
                    value={formData.role}
                    onValueChange={(value) =>
                      setFormData({ ...formData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.role && (
                    <div className="text-xs text-destructive mt-1">
                      {errors.role}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="gradient-primary text-primary-foreground"
                onClick={handleCreateUser}
              >
                Create User
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Update User Dialog */}
        <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Update User</DialogTitle>
              <DialogDescription>
                Update user account details and role.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-name" className="text-right">
                  Full Name
                </Label>
                <div className="col-span-3">
                  <Input
                    id="update-name"
                    placeholder="Enter full name"
                    value={updateFormData.name}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        name: e.target.value,
                      })
                    }
                    error={updateErrors.name}
                  />
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
                    placeholder="user@company.com"
                    value={updateFormData.email}
                    onChange={(e) =>
                      setUpdateFormData({
                        ...updateFormData,
                        email: e.target.value,
                      })
                    }
                    error={updateErrors.email}
                  />
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="update-role" className="text-right">
                  Role
                </Label>
                <div className="col-span-3">
                  <Select
                    value={updateFormData.role}
                    onValueChange={(value) =>
                      setUpdateFormData({ ...updateFormData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Super Admin">Super Admin</SelectItem>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="User">User</SelectItem>
                    </SelectContent>
                  </Select>
                  {updateErrors.role && (
                    <div className="text-xs text-destructive mt-1">
                      {updateErrors.role}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsUpdateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="gradient-primary text-primary-foreground"
                onClick={handleUpdateUser}
              >
                Update User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Total Users
            </CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.totalUsers}
            </div>
            <p className="text-xs text-muted-foreground">Active system users</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Super Admins
            </CardTitle>
            <Shield className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.superAdmins}
            </div>
            <p className="text-xs text-muted-foreground">Full system access</p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Admins
            </CardTitle>
            <Settings className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.admins}
            </div>
            <p className="text-xs text-muted-foreground">
              Limited admin access
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Users
            </CardTitle>
            <Users className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {stats.noOfUsers}
            </div>
            <p className="text-xs text-muted-foreground">Client-level access</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">User Directory</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search users by name, email, or role..."
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
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Permissions</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users?.length <= 0 && isLoading ? (
                  <TableSkeleton />
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{user.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {user.email}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {user.id}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === "Super Admin"
                              ? "destructive"
                              : user.role === "Admin"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            {/* <Switch checked={user.permissions.clientAccess} /> */}
                            <span className="text-xs">Client Access</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {/* <Switch checked={user.permissions.dataManagement} /> */}
                            <span className="text-xs">Data Management</span>
                          </div>
                        </div>
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
                              onClick={() => handleOpenUpdateDialog(user)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit User
                            </DropdownMenuItem>
                            {/* <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Change Role
                            </DropdownMenuItem> */}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => handleDeleteUser(user)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
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
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this user?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-white hover:bg-destructive/90"
              onClick={confirmDeleteUser}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersRoles;
