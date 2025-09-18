import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  History,
  Search,
  Shield,
  Clock,
  MapPin,
  Monitor,
  Mail,
} from "lucide-react";
import useGetData from "@/hooks/use-get-data";
import moment from "moment";
import TableSkeleton from "@/components/TableSkeleton";
import CardSkeleton from "@/components/CardSkeleton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const LoginHistory = () => {
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

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounce searchTerm updates
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400); // 400ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm]);

  // useGetData uses debouncedSearchTerm
  const { data, isLoading, refetch } = useGetData(
    `/clients/login-history?page=${pagination.currentPage}&limit=${
      pagination.limit
    }&search=${encodeURIComponent(debouncedSearchTerm)}`
  );
  const cards = data?.cards;

  useEffect(() => {
    // API returns records and pagination (if paginated). Map them into state.
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
  }, [data]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Login History</h1>
          <p className="text-muted-foreground">
            Monitor user access and security events
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <History className="w-3 h-3 mr-1" />
          Live Monitoring
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Total Logins
            </CardTitle>
            <History className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {cards?.totalLogins}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Total Clients
            </CardTitle>
            <Shield className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {cards?.totalClients}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Total Sub Users
            </CardTitle>
            <Shield className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {cards?.totalSubUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Total Users
            </CardTitle>
            <Monitor className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {cards?.totalUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">
              Unique Users
            </CardTitle>
            <Monitor className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {cards?.uniqueUsers}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Login History Table */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Recent Login Activity
          </CardTitle>
          <CardDescription>
            Track user access patterns and security events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, IP, or location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setPagination((prev) => ({
                    ...prev,
                    currentPage: 1,
                  }));
                }}
                className="pl-8"
              />
            </div>
          </div>

          {/* Pagination controls (updated) */}
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
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Login At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableSkeleton />
                ) : data?.logins?.length <= 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="text-center text-muted-foreground"
                    >
                      No login history found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.logins?.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <div className="font-medium">{log.name}</div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            log.role === "Super Admin"
                              ? "default"
                              : log.role === "Admin"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {log.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Mail className="w-3 h-3 mr-1 text-muted-foreground" />
                          {log.email}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                          {moment(log.loginAt).format("DD MMM YYYY, hh:mm A")}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginHistory;
