import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { 
  History, 
  Search, 
  Shield, 
  Clock,
  MapPin,
  Monitor
} from "lucide-react"

const mockLoginHistory = [
  {
    id: "LOG001",
    user: "admin@acme.com",
    role: "Client",
    ip: "192.168.1.100",
    location: "Mumbai, India",
    device: "Chrome on Windows",
    timestamp: "2024-01-18 14:30:25",
    status: "Success"
  },
  {
    id: "LOG002", 
    user: "super.admin@panel.com",
    role: "Super Admin",
    ip: "10.0.0.1",
    location: "Delhi, India",
    device: "Firefox on Mac",
    timestamp: "2024-01-18 12:15:10",
    status: "Success"
  },
  {
    id: "LOG003",
    user: "contact@techstart.com", 
    role: "Client",
    ip: "203.192.1.50",
    location: "Bangalore, India",
    device: "Safari on iOS",
    timestamp: "2024-01-18 09:45:33",
    status: "Failed"
  },
  {
    id: "LOG004",
    user: "admin@panel.com",
    role: "Admin",
    ip: "172.16.0.10",
    location: "Pune, India", 
    device: "Chrome on Android",
    timestamp: "2024-01-18 08:20:15",
    status: "Success"
  },
  {
    id: "LOG005",
    user: "info@global.com",
    role: "Client",
    ip: "192.168.2.45",
    location: "Chennai, India",
    device: "Edge on Windows",
    timestamp: "2024-01-17 16:55:42",
    status: "Success"
  }
]

const LoginHistory = () => {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredHistory = mockLoginHistory.filter(log =>
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ip.includes(searchTerm) ||
    log.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const successLogins = mockLoginHistory.filter(log => log.status === "Success").length
  const failedLogins = mockLoginHistory.filter(log => log.status === "Failed").length
  const uniqueUsers = new Set(mockLoginHistory.map(log => log.user)).size

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Login History</h1>
          <p className="text-muted-foreground">Monitor user access and security events</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <History className="w-3 h-3 mr-1" />
          Live Monitoring
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Logins</CardTitle>
            <History className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{mockLoginHistory.length}</div>
            <p className="text-xs text-muted-foreground">
              Last 24 hours
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Successful</CardTitle>
            <Shield className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{successLogins}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((successLogins / mockLoginHistory.length) * 100)}% success rate
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Failed Attempts</CardTitle>
            <Shield className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{failedLogins}</div>
            <p className="text-xs text-muted-foreground">
              Security alerts
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Unique Users</CardTitle>
            <Monitor className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{uniqueUsers}</div>
            <p className="text-xs text-muted-foreground">
              Active today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Login History Table */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">Recent Login Activity</CardTitle>
          <CardDescription>Track user access patterns and security events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, IP, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="rounded-md border border-border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>
                      <div className="font-medium">{log.user}</div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        log.role === "Super Admin" ? "default" : 
                        log.role === "Admin" ? "secondary" : 
                        "outline"
                      }>
                        {log.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <code className="text-xs bg-muted px-1 py-0.5 rounded">
                        {log.ip}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                        {log.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Monitor className="w-3 h-3 mr-1 text-muted-foreground" />
                        {log.device}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Clock className="w-3 h-3 mr-1 text-muted-foreground" />
                        {log.timestamp}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={log.status === "Success" ? "default" : "destructive"}>
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginHistory