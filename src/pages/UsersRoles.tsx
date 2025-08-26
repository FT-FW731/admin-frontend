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

const AddUserDialog = ({
  isOpen,
  setIsOpen,
  formData,
  setFormData,
  errors,
  onCreate,
  loading,
}: any) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                onChange={(e: any) =>
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
                onChange={(e: any) =>
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
                onChange={(e: any) =>
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
                onValueChange={(value: any) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="gradient-primary text-primary-foreground"
            onClick={onCreate}
            loading={loading}
          >
            Create User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const UpdateUserDialog = ({
  isOpen,
  setIsOpen,
  updateFormData,
  setUpdateFormData,
  updateErrors,
  onUpdate,
  loading,
}: any) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                onChange={(e: any) =>
                  setUpdateFormData({ ...updateFormData, name: e.target.value })
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
                onChange={(e: any) =>
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
                onValueChange={(value: any) =>
                  setUpdateFormData({ ...updateFormData, role: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
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
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="gradient-primary text-primary-foreground"
            onClick={onUpdate}
            loading={loading}
          >
            Update User
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const DeleteUserAlert = ({ open, setOpen, onConfirm }: any) => {
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete User</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this user?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={onConfirm}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

const StatsCards = ({ stats }: any) => (
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
        <p className="text-xs text-muted-foreground">Limited admin access</p>
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
);

const UsersTable = ({
  users,
  filteredUsers,
  isLoading,
  handleOpenUpdateDialog,
  handleDeleteUser,
  pagination,
  setPagination,
  searchTerm,
  setSearchTerm,
}: any) => {
  return (
    <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-card-foreground">User Directory</CardTitle>
        <CardDescription>Manage user accounts and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name, email, or role..."
              value={searchTerm}
              onChange={(e: any) => setSearchTerm(e.target.value)}
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
              setPagination((prev: any) => ({
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
              setPagination((prev: any) => ({
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
            onChange={(e: any) => {
              setPagination((prev: any) => ({
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
              ) : users?.length <= 0 && !isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="text-center text-muted-foreground"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user: any) => (
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
  );
};

const UsersRoles = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
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
  const [selectedUser, setSelectedUser] = useState<any>(null);
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
  const [userToDelete, setUserToDelete] = useState<any>(null);
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
  const [addUpdateUserLoading, setAddUpdateUserLoading] = useState(false);

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
      setUsers(data?.users || []);
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

  const handleCreateUser = async (e?: any) => {
    e && e.preventDefault && e.preventDefault();
    setAddUpdateUserLoading(true);
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
    if (!valid) {
      setAddUpdateUserLoading(false);
      return;
    }

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
    setAddUpdateUserLoading(false);
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

  const handleUpdateUser = async (e?: any) => {
    e && e.preventDefault && e.preventDefault();
    setAddUpdateUserLoading(true);
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
    if (!valid) {
      setAddUpdateUserLoading(false);
      return;
    }

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
    setAddUpdateUserLoading(false);
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

        {/* Add User Dialog Trigger + Dialog */}
        <AddUserDialog
          isOpen={isAddDialogOpen}
          setIsOpen={setIsAddDialogOpen}
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          onCreate={handleCreateUser}
          loading={addUpdateUserLoading}
        />

        {/* Update and Delete dialogs are mounted here as well so they can access parent state */}
        <UpdateUserDialog
          isOpen={isUpdateDialogOpen}
          setIsOpen={setIsUpdateDialogOpen}
          updateFormData={updateFormData}
          setUpdateFormData={setUpdateFormData}
          updateErrors={updateErrors}
          onUpdate={handleUpdateUser}
          loading={addUpdateUserLoading}
        />
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Users Table */}
      <UsersTable
        users={users}
        filteredUsers={filteredUsers}
        isLoading={isLoading}
        handleOpenUpdateDialog={handleOpenUpdateDialog}
        handleDeleteUser={handleDeleteUser}
        pagination={pagination}
        setPagination={setPagination}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteUserAlert
        open={isDeleteDialogOpen}
        setOpen={setIsDeleteDialogOpen}
        onConfirm={confirmDeleteUser}
      />
    </div>
  );
};

export default UsersRoles;
