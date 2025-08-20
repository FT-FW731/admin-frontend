import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  CreditCard, 
  Database, 
  TrendingUp, 
  Building2, 
  FileText, 
  Plane,
  ArrowUpRight,
  IndianRupee
} from "lucide-react"
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar
} from "recharts"

// Mock data for charts
const clientTrendData = [
  { month: "Jan", clients: 45 },
  { month: "Feb", clients: 52 },
  { month: "Mar", clients: 48 },
  { month: "Apr", clients: 61 },
  { month: "May", clients: 55 },
  { month: "Jun", clients: 67 },
]

const paymentData = [
  { month: "Jan", amount: 85000 },
  { month: "Feb", amount: 95000 },
  { month: "Mar", amount: 78000 },
  { month: "Apr", amount: 125000 },
  { month: "May", amount: 110000 },
  { month: "Jun", amount: 135000 },
]

const Dashboard = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's your business overview.</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Live Data
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">1,284</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent font-medium">+12.5%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Payment Collections</CardTitle>
            <IndianRupee className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">₹8,52,340</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent font-medium">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">MCA Records</CardTitle>
            <Building2 className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">15,678</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent font-medium">+156</span> new records
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">GST Records</CardTitle>
            <FileText className="h-4 w-4 text-chart-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">23,456</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-accent font-medium">+234</span> new records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-card-foreground">Client Growth Trend</CardTitle>
            <CardDescription>Monthly client acquisition over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={clientTrendData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="clients" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader>
            <CardTitle className="text-card-foreground">Payment Collections</CardTitle>
            <CardDescription>Monthly revenue over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="month" className="text-muted-foreground" />
                  <YAxis className="text-muted-foreground" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
                  />
                  <Bar 
                    dataKey="amount" 
                    fill="hsl(var(--chart-secondary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">Quick Actions</CardTitle>
          <CardDescription>Frequently used management tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/5">
              <CreditCard className="h-6 w-6" />
              <span>Payment History</span>
              <ArrowUpRight className="h-3 w-3 opacity-50" />
            </Button>
            
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/5">
              <Building2 className="h-6 w-6" />
              <span>MCA Data</span>
              <ArrowUpRight className="h-3 w-3 opacity-50" />
            </Button>
            
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/5">
              <FileText className="h-6 w-6" />
              <span>GST Data</span>
              <ArrowUpRight className="h-3 w-3 opacity-50" />
            </Button>
            
            <Button variant="outline" className="h-20 flex-col space-y-2 hover:bg-primary/5">
              <Plane className="h-6 w-6" />
              <span>Import/Export Data</span>
              <ArrowUpRight className="h-3 w-3 opacity-50" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard