import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Database,
  Building2,
  FileText,
  Plane,
  ArrowUpRight,
  Edit,
} from "lucide-react";
import useGetData from "@/hooks/use-get-data";
import { API } from "@/api/axiosInstance";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { formatNumber } from "@/utils/helpers";
import CardSkeleton from "@/components/CardSkeleton";

const EditRecordDialog = ({
  isOpen,
  setIsOpen,
  editForm,
  setEditForm,
  selectedRecord,
  handleSaveEdit,
  updateLoading,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  editForm: { recordName: string; recordValue: number };
  setEditForm: (v: any) => void;
  selectedRecord: any;
  handleSaveEdit: () => Promise<void>;
  updateLoading: boolean;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Record</DialogTitle>
          <DialogDescription>
            Update the record name or value and save changes.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4">
              <label className="text-sm mb-1 block">Record Name</label>
              <Input
                value={editForm.recordName.toUpperCase()}
                onChange={(e) =>
                  setEditForm({ ...editForm, recordName: e.target.value })
                }
                disabled
              />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <div className="col-span-4">
              <label className="text-sm mb-1 block">Record Value</label>
              <Input
                type="number"
                value={String(editForm.recordValue ?? 0)}
                onChange={(e) =>
                  setEditForm({
                    ...editForm,
                    recordValue: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button
            className="gradient-primary text-primary-foreground"
            onClick={handleSaveEdit}
            loading={updateLoading}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Dashboard = () => {
  const { data, isLoading, refetch } = useGetData("/miscellaneous/dashboard");
  const records = data?.data ?? data ?? [];

  const getIconByName = (name: string) => {
    switch ((name || "").toLowerCase()) {
      case "gst":
        return <FileText className="h-4 w-4 text-chart-4" />;
      case "cin":
        return <Building2 className="h-4 w-4 text-chart-3" />;
      case "din":
        return <Database className="h-4 w-4 text-accent" />;
      case "iec":
        return <Plane className="h-4 w-4 text-primary" />;
      case "pan":
        return <CreditCard className="h-4 w-4 text-accent" />;
      default:
        return <ArrowUpRight className="h-4 w-4 text-primary" />;
    }
  };

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<null | any>(null);
  const [editForm, setEditForm] = useState({
    recordName: "",
    recordValue: 0,
  });

  const openEdit = (rec: any) => {
    setSelectedRecord(rec);
    setEditForm({
      recordName: rec.recordName ?? "",
      recordValue: rec.recordValue ?? 0,
    });
    setIsEditOpen(true);
  };

  const handleSaveEdit = async () => {
    setUpdateLoading(true);
    if (!selectedRecord) {
      setUpdateLoading(false);
      return;
    }
    const payload = {
      name: editForm.recordName,
      value: Number(editForm.recordValue),
    };
    const { success } = await API.put(
      `/miscellaneous/dashboard/${selectedRecord.id}`,
      payload
    );
    if (success) {
      toast({
        title: "Record updated",
        description: "The dashboard record was updated successfully.",
        variant: "default",
      });
      setIsEditOpen(false);
      setSelectedRecord(null);
      refetch && refetch();
    }
    setUpdateLoading(false);
  };

  return (
    <div className="p-6 space-y-6 min-h-screen relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(148,163,184,0.05)_1px,transparent_0)] bg-[length:32px_32px]" />
      </div>
      
 
      
      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your business overview.
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1 bg-white/60 backdrop-blur-sm border-green-200 text-green-700">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          Live Data
        </Badge>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {records.length <= 0 && isLoading ? (
          <CardSkeleton count={5} />
        ) : !isLoading && records.length <= 0 ? (
          <p className="text-center col-span-4 text-muted-foreground">
            No records found.
          </p>
        ) : (
          <React.Fragment>
            {records.map(
              (rec: {
                id: string;
                recordName: string;
                recordValue: number;
              }) => (
                <Card
                  className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 hover:shadow-xl hover:scale-[1.02] relative overflow-hidden"
                  key={rec.id}
                >
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-blue-50/30 pointer-events-none" />
                  
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                    <CardTitle className="text-sm font-medium text-card-foreground">
                      {rec.recordName ? rec.recordName.toUpperCase() : "RECORD"}
                    </CardTitle>

                    {/* icon + edit button */}
                    <div className="flex items-center gap-2">
                      {getIconByName(rec.recordName)}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEdit(rec)}
                        className="h-8 w-8 p-0"
                        aria-label={`Edit ${rec.recordName}`}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="text-2xl font-bold text-card-foreground">
                      {formatNumber(rec.recordValue ?? 0)}
                    </div>
                  </CardContent>
                </Card>
              )
            )}
          </React.Fragment>
        )}
      </div>

      <EditRecordDialog
        isOpen={isEditOpen}
        setIsOpen={setIsEditOpen}
        editForm={editForm}
        setEditForm={setEditForm}
        selectedRecord={selectedRecord}
        handleSaveEdit={handleSaveEdit}
        updateLoading={updateLoading}
      />
    </div>
  );
};

export default Dashboard;
