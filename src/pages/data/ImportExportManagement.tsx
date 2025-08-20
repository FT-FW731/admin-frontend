import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Plus, 
  Search, 
  Edit, 
  Plane, 
  Building,
  TrendingUp,
  TrendingDown,
  MoreHorizontal
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const mockImportExportData = [
  {
    id: "IE001",
    state: "Maharashtra",
    stateCode: "MH",
    totalImporters: 15678,
    totalExporters: 12345,
    tradeVolume: 245.6,
    status: "Active",
    lastUpdated: "2024-01-18"
  },
  {
    id: "IE002", 
    state: "Gujarat",
    stateCode: "GJ",
    totalImporters: 14523,
    totalExporters: 18967,
    tradeVolume: 312.4,
    status: "Active", 
    lastUpdated: "2024-01-17"
  },
  {
    id: "IE003",
    state: "Tamil Nadu", 
    stateCode: "TN",
    totalImporters: 11234,
    totalExporters: 14567,
    tradeVolume: 198.7,
    status: "Active",
    lastUpdated: "2024-01-16"
  },
  {
    id: "IE004",
    state: "Karnataka", 
    stateCode: "KA",
    totalImporters: 9876,
    totalExporters: 11234,
    tradeVolume: 167.3,
    status: "Active",
    lastUpdated: "2024-01-15"
  }
]

const ImportExportManagement = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  const filteredData = mockImportExportData.filter(item =>
    item.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.stateCode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalStates = mockImportExportData.length
  const totalImporters = mockImportExportData.reduce((acc, item) => acc + item.totalImporters, 0)
  const totalExporters = mockImportExportData.reduce((acc, item) => acc + item.totalExporters, 0)
  const totalTradeVolume = mockImportExportData.reduce((acc, item) => acc + item.tradeVolume, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Import/Export Management</h1>
          <p className="text-muted-foreground">Manage state-wise import/export data</p>
        </div>
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground">
              <Plus className="w-4 h-4 mr-2" />
              Add State Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Import/Export State Entry</DialogTitle>
              <DialogDescription>
                Create a new state entry for import/export data tracking.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="state" className="text-right">
                  State
                </Label>
                <Select>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    <SelectItem value="assam">Assam</SelectItem>
                    <SelectItem value="bihar">Bihar</SelectItem>
                    <SelectItem value="goa">Goa</SelectItem>
                    <SelectItem value="haryana">Haryana</SelectItem>
                    <SelectItem value="kerala">Kerala</SelectItem>
                    <SelectItem value="punjab">Punjab</SelectItem>
                    <SelectItem value="rajasthan">Rajasthan</SelectItem>
                    <SelectItem value="west-bengal">West Bengal</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stateCode" className="text-right">
                  State Code
                </Label>
                <Input id="stateCode" placeholder="e.g., AP" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="importers" className="text-right">
                  Importers
                </Label>
                <Input id="importers" type="number" placeholder="0" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="exporters" className="text-right">
                  Exporters
                </Label>
                <Input id="exporters" type="number" placeholder="0" className="col-span-3" />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="gradient-primary text-primary-foreground">
                Add State Entry
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total States</CardTitle>
            <Building className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalStates}</div>
            <p className="text-xs text-muted-foreground">
              Trade enabled states
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Importers</CardTitle>
            <TrendingDown className="h-4 w-4 text-chart-3" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalImporters.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Registered importers
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Exporters</CardTitle>
            <TrendingUp className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalExporters.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Registered exporters
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Trade Volume</CardTitle>
            <Plane className="h-4 w-4 text-chart-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">₹{totalTradeVolume.toFixed(1)}B</div>
            <p className="text-xs text-muted-foreground">
              Annual trade volume
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Import/Export Data Table */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">State-wise Trade Data</CardTitle>
          <CardDescription>Manage import/export data by state</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by state or state code..."
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
                  <TableHead>State</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Importers</TableHead>
                  <TableHead>Exporters</TableHead>
                  <TableHead>Trade Volume</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center">
                        <Building className="w-4 h-4 mr-2 text-primary" />
                        <div>
                          <div className="font-medium">{item.state}</div>
                          <div className="text-xs text-muted-foreground">ID: {item.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {item.stateCode}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingDown className="w-3 h-3 mr-1 text-chart-3" />
                        <span className="font-medium">{item.totalImporters.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1 text-accent" />
                        <span className="font-medium">{item.totalExporters.toLocaleString()}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Plane className="w-3 h-3 mr-1 text-chart-secondary" />
                        <span className="font-medium">₹{item.tradeVolume}B</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.status === "Active" ? "default" : "secondary"}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.lastUpdated}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit Entry
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Plane className="mr-2 h-4 w-4" />
                            View Trade Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            Delete Entry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Trade Overview */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">Import/Export Overview</CardTitle>
          <CardDescription>Key insights about trade data management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-card-foreground mb-2">Trade Data Structure:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Data is organized by state-level (no city subdivision for trade data)</li>
              <li>• Each state tracks both import and export business registrations</li>
              <li>• Trade volume represents annual value in billions (₹B)</li>
              <li>• Import/Export codes (IEC) are managed at state level</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ImportExportManagement