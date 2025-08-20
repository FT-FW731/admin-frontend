import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Upload, 
  FileSpreadsheet, 
  CheckCircle, 
  XCircle,
  Clock,
  Download,
  Building2,
  FileText,
  Plane
} from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"

const mockImports = [
  {
    id: "IMP001",
    category: "MCA",
    fileName: "mca_data_jan_2024.xlsx",
    recordsTotal: 1500,
    recordsSuccess: 1450,
    recordsFailed: 50,
    status: "Completed",
    uploadedAt: "2024-01-18 14:30:25",
    uploadedBy: "john@panel.com"
  },
  {
    id: "IMP002", 
    category: "GST",
    fileName: "gst_records_batch_1.xlsx",
    recordsTotal: 2300,
    recordsSuccess: 2300,
    recordsFailed: 0,
    status: "Completed",
    uploadedAt: "2024-01-18 12:15:10",
    uploadedBy: "jane@panel.com"
  },
  {
    id: "IMP003",
    category: "Import/Export", 
    fileName: "trade_data_q4.xlsx",
    recordsTotal: 800,
    recordsSuccess: 650,
    recordsFailed: 150,
    status: "Processing",
    uploadedAt: "2024-01-18 15:45:33",
    uploadedBy: "admin@panel.com"
  }
]

const ImportData = () => {
  const [selectedCategory, setSelectedCategory] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && selectedCategory) {
      setIsUploading(true)
      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += 10
        setUploadProgress(progress)
        if (progress >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setUploadProgress(0)
        }
      }, 200)
    }
  }

  const totalRecords = mockImports.reduce((acc, imp) => acc + imp.recordsTotal, 0)
  const successfulRecords = mockImports.reduce((acc, imp) => acc + imp.recordsSuccess, 0)
  const failedRecords = mockImports.reduce((acc, imp) => acc + imp.recordsFailed, 0)

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Import Data</h1>
          <p className="text-muted-foreground">Upload CSV/Excel files for bulk data import</p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Upload className="w-3 h-3 mr-1" />
          Bulk Import
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Total Imports</CardTitle>
            <FileSpreadsheet className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{mockImports.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent uploads
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Records Processed</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{totalRecords.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total records uploaded
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">
              {Math.round((successfulRecords / totalRecords) * 100)}%
            </div>
            <p className="text-xs text-muted-foreground">
              {successfulRecords.toLocaleString()} successful
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-card-foreground">Failed Records</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-card-foreground">{failedRecords}</div>
            <p className="text-xs text-muted-foreground">
              Require attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Upload Section */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">Upload New Data</CardTitle>
          <CardDescription>Select category and upload CSV/Excel file for bulk import</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">
                Select Category
              </label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose data category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mca">
                    <div className="flex items-center">
                      <Building2 className="w-4 h-4 mr-2" />
                      MCA Data
                    </div>
                  </SelectItem>
                  <SelectItem value="gst">
                    <div className="flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      GST Data
                    </div>
                  </SelectItem>
                  <SelectItem value="import-export">
                    <div className="flex items-center">
                      <Plane className="w-4 h-4 mr-2" />
                      Import/Export Data
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm font-medium text-card-foreground mb-2 block">
                Upload File
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  disabled={!selectedCategory || isUploading}
                  className="flex-1 text-sm text-card-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer cursor-pointer disabled:opacity-50"
                />
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-card-foreground">Uploading...</span>
                <span className="text-sm text-muted-foreground">{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} className="w-full" />
            </div>
          )}

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-card-foreground mb-2">Upload Guidelines:</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Supported formats: CSV, Excel (.xlsx, .xls)</li>
              <li>• Maximum file size: 10MB</li>
              <li>• Ensure proper column headers match the category requirements</li>
              <li>• Remove any duplicate records before upload</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Import History */}
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle className="text-card-foreground">Import History</CardTitle>
          <CardDescription>Track previous data uploads and their status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockImports.map((importItem) => (
              <div key={importItem.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      {importItem.category === "MCA" ? (
                        <Building2 className="w-5 h-5 text-primary" />
                      ) : importItem.category === "GST" ? (
                        <FileText className="w-5 h-5 text-primary" />
                      ) : (
                        <Plane className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-card-foreground">{importItem.fileName}</h4>
                      <p className="text-sm text-muted-foreground">Category: {importItem.category}</p>
                    </div>
                  </div>
                  <Badge variant={importItem.status === "Completed" ? "default" : "secondary"}>
                    {importItem.status === "Processing" && <Clock className="w-3 h-3 mr-1" />}
                    {importItem.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-card-foreground">
                      {importItem.recordsTotal.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Total Records</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-accent">
                      {importItem.recordsSuccess.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-destructive">
                      {importItem.recordsFailed}
                    </div>
                    <div className="text-xs text-muted-foreground">Failed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">
                      {Math.round((importItem.recordsSuccess / importItem.recordsTotal) * 100)}%
                    </div>
                    <div className="text-xs text-muted-foreground">Success Rate</div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Uploaded by {importItem.uploadedBy} on {importItem.uploadedAt}</span>
                  {importItem.recordsFailed > 0 && (
                    <Button variant="outline" size="sm">
                      <Download className="w-3 h-3 mr-1" />
                      Download Errors
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ImportData