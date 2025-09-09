import moment from "moment";
import { toast } from "@/hooks/use-toast";
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
  IndianRupee,
  Search,
  Filter,
  Download,
  TrendingUp,
  Calendar,
} from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import useGetData from "@/hooks/use-get-data";
import TableSkeleton from "@/components/TableSkeleton";
import { debounce, formatNumber } from "@/utils/helpers";
import CardSkeleton from "@/components/CardSkeleton";
import { generateAndDownloadInvoicePDF } from "@/utils/invoicePDF";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const paymentData = [
  { month: "Jan", amount: 85000 },
  { month: "Feb", amount: 95000 },
  { month: "Mar", amount: 78000 },
  { month: "Apr", amount: 125000 },
  { month: "May", amount: 110000 },
  { month: "Jun", amount: 135000 },
];

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
    limit: 10,
    hasNextPage: false,
    hasPreviousPage: false,
    nextPage: null,
    previousPage: null,
  });
  const [monthWisePayments, setMonthWisePayments] = useState([]);
  const [cardStats, setCardStats] = useState({
    totalCollections: 0,
    averagePaymentAmount: 0,
    mostCommonPaymentAmount: 0,
    totalCompletedPayments: 0,
    thisMonth: {
      totalAmount: 0,
      count: 0,
    },
    percentChangeFromPreviousMonth: 0,
    changeDirection: "no_change",
  });

  const [chartRange, setChartRange] = useState<"6m" | "1y" | "2y">("6m");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "completed" | "failed" | "created"
  >("all");

  const formatAxis = (value: number) => {
    try {
      return (
        "₹" +
        new Intl.NumberFormat("en-IN", {
          notation: "compact",
          maximumFractionDigits: 1,
        }).format(value)
      );
    } catch (e) {
      return "₹" + value;
    }
  };

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 400);
    handler();
    return () => {
      handler.cancel && handler.cancel();
    };
  }, [searchTerm]);

  const statusQuery =
    statusFilter && statusFilter !== "all" ? `&status=${statusFilter}` : "";

  const { data, isLoading } = useGetData(
    `/miscellaneous/payments?page=${pagination.currentPage}&limit=${pagination.limit}&search=${debouncedSearchTerm}${statusQuery}`
  );

  const { data: statsData, isLoading: isLoadingStats } = useGetData(
    `/miscellaneous/payments/stats?range=${chartRange}`
  );

  useEffect(() => {
    if (data) {
      setPayments(data.payments || []);
      if (data.pagination) {
        setPagination((prev) => ({ ...prev, ...data.pagination }));
      }
    } else {
      setPayments([]);
    }
  }, [data]);

  useEffect(() => {
    if (statsData && statsData.monthTotals) {
      setMonthWisePayments(statsData.monthTotals);
    }
    if (statsData && statsData.cards) {
      setCardStats(statsData.cards);
    }
  }, [statsData]);

  // fallback client-side filtering (keeps search responsive while server is used)
  const filteredPayments = payments.filter((p) => {
    const matchesSearch =
      (p.client || "")
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase()) ||
      (p.razorpayOrderId || "")
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Payments</h1>
          <p className="text-muted-foreground">
            Track payment collections and financial overview
          </p>
        </div>
        {/* <div className="flex space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button className="gradient-primary text-primary-foreground">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div> */}
      </div>

      {/* Stats Cards */}
      {isLoadingStats && !cardStats?.totalCollections ? (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <CardSkeleton count={4} />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Total Collections
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                ₹{formatNumber(cardStats.totalCollections)}
              </div>
              {/* <p className="text-xs text-muted-foreground">
              <span className="text-accent font-medium">+12.5%</span> from last
              month
            </p> */}
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                This Month
              </CardTitle>
              <Calendar className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                ₹{formatNumber(cardStats.thisMonth.totalAmount)}
              </div>
              <p className="text-xs text-muted-foreground">
                <span
                  className={`font-medium ${
                    cardStats.changeDirection === "increased"
                      ? "text-accent"
                      : cardStats.changeDirection === "decreased"
                      ? "text-destructive"
                      : ""
                  }`}
                >
                  {cardStats.changeDirection === "increased"
                    ? "+"
                    : cardStats.changeDirection === "decreased"
                    ? "-"
                    : ""}
                  {cardStats.percentChangeFromPreviousMonth}%
                </span>{" "}
                vs last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Most Common Amount
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-warning" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                ₹{formatNumber(cardStats.mostCommonPaymentAmount)}
              </div>
              {/* <p className="text-xs text-muted-foreground">3 pending payments</p> */}
            </CardContent>
          </Card>

          <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-card-foreground">
                Average Amount
              </CardTitle>
              <IndianRupee className="h-4 w-4 text-chart-3" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-card-foreground">
                ₹{formatNumber(cardStats.averagePaymentAmount)}
              </div>
              {/* <p className="text-xs text-muted-foreground">Per transaction</p> */}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Payment Trend Chart */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader className="flex items-center justify-between">
          <div className="text-center">
            <CardTitle className="text-card-foreground">
              Payment Collections Trend
            </CardTitle>
            <CardDescription>
              Monthly payment collections over the selected range
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={chartRange === "6m" ? "default" : "outline"}
              onClick={() => setChartRange("6m")}
              size="sm"
            >
              6M
            </Button>
            <Button
              variant={chartRange === "1y" ? "default" : "outline"}
              onClick={() => setChartRange("1y")}
              size="sm"
            >
              1Y
            </Button>
            <Button
              variant={chartRange === "2y" ? "default" : "outline"}
              onClick={() => setChartRange("2y")}
              size="sm"
            >
              2Y
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthWisePayments}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="month" className="text-muted-foreground" />
                <YAxis
                  className="text-muted-foreground"
                  tickFormatter={formatAxis}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                  formatter={(value: number) => [
                    `₹${value.toLocaleString()}`,
                    "Amount",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="amount"
                  stroke="hsl(var(--chart-secondary))"
                  strokeWidth={3}
                  dot={{
                    fill: "hsl(var(--chart-secondary))",
                    strokeWidth: 2,
                    r: 6,
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">
            Payment History
          </CardTitle>
          <CardDescription>
            Recent payment transactions and status
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search payments by client or invoice..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex items-center space-x-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setPagination((prev) => ({ ...prev, currentPage: 1 }));
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value="all">All</option>
                <option value="completed">Completed</option>
                <option value="failed">Failed</option>
                <option value="created">Created</option>
              </select>
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
            <label className="ml-4 mr-2 text-sm">Rows:</label>
            <select
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
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Subscription</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>End Date</TableHead>
                  <TableHead>Invoice</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading && filteredPayments.length === 0 ? (
                  <TableSkeleton columns={8} rows={10} />
                ) : filteredPayments.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center text-muted-foreground"
                    >
                      No payments found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPayments.map((payment) => (
                    <TableRow key={payment.razorpayOrderId}>
                      <TableCell className="font-medium">
                        {payment.razorpayOrderId}
                      </TableCell>
                      <TableCell>{payment.client}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <IndianRupee className="w-3 h-3 mr-1" />
                          {formatNumber(payment.amount / 100)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(payment.createdAt).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-block h-2 w-2 rounded-full mr-1 ${
                              payment.status === "completed"
                                ? "bg-emerald-400"
                                : payment.status === "failed"
                                ? "bg-red-400"
                                : payment.status === "created"
                                ? "bg-sky-400"
                                : "bg-gray-400"
                            }`}
                            aria-hidden="true"
                          />
                          <Badge
                            variant={
                              payment.status === "completed"
                                ? "default"
                                : payment.status === "failed"
                                ? "destructive"
                                : "secondary"
                            }
                            className="uppercase text-xs py-0.5 px-2"
                          >
                            {String(payment.status)
                              .replace(/_/g, " ")
                              .toUpperCase()}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {payment.subscription?.name ? (
                          <UITooltip>
                            <TooltipTrigger asChild>
                              <div className="max-w-[12rem] truncate">
                                {payment.subscription?.name}
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              {payment.subscription?.name}
                            </TooltipContent>
                          </UITooltip>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {payment.startDate
                          ? moment(payment.startDate).format("Do MMM YYYY")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {payment.endDate
                          ? moment(payment.endDate).format("Do MMM YYYY")
                          : "-"}
                      </TableCell>
                      <TableCell>
                        {/* <code className="text-xs bg-muted px-1 py-0.5 rounded">
                          {payment.razorpayOrderId}
                        </code> */}

                        {payment?.status === "completed" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              let description = [
                                {
                                  key: "Start Date",
                                  value: moment(payment.startDate).format(
                                    "DD MMM YYYY"
                                  ),
                                },
                              ];
                              const name = payment.subscription.name;
                              const val = payment?.values || "";
                              if (name.toLowerCase().includes("india")) {
                                description.push({
                                  key: "Location",
                                  value: "India",
                                });
                              } else if (name.toLowerCase().includes("state")) {
                                description.push({
                                  key: "State",
                                  value: Array.isArray(val)
                                    ? val.join(", ")
                                    : val,
                                });
                              } else if (name.toLowerCase().includes("city")) {
                                description.push({
                                  key: "City",
                                  value: Array.isArray(val)
                                    ? val.join(", ")
                                    : val,
                                });
                              } else if (name.toLowerCase().includes("roc")) {
                                description.push({
                                  key: "ROC",
                                  value: Array.isArray(val)
                                    ? val.join(", ")
                                    : val,
                                });
                              }

                              const orderData = {
                                id: payment.id ?? payment.razorpayOrderId,
                                createdAt: payment.createdAt,
                                company: payment.company ?? payment.client,
                                subscription: payment.subscription ?? {
                                  name: "Subscription",
                                  price: payment.subscription?.price ?? 0,
                                },
                                description,
                                unit: payment.unit ?? 1,
                                amount: payment.amount ?? 0,
                              };

                              try {
                                await generateAndDownloadInvoicePDF(orderData);
                              } catch (err) {
                                toast({
                                  title: "Error",
                                  description:
                                    "Failed to download invoice. Please try again.",
                                  variant: "destructive",
                                });
                              }
                            }}
                          >
                            Download
                          </Button>
                        )}
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

export default Payments;
