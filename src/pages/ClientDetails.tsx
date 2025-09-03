import moment from "moment";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useGetData from "@/hooks/use-get-data";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { API } from "@/api/axiosInstance";
import { toast } from "@/hooks/use-toast";
import Loader from "@/components/ui/loader";

type Client = {
  id?: number | string;
  name?: string;
  email?: string;
  company?: string;
  mobile?: string;
  subUsers?: number;
  credits?: number;
  subscriptionId?: string | number;
  createdAt?: string;
  lastLogin?: string;
  [key: string]: any;
};

interface Props {
  clientId?: string | number;
}

const ClientDetails: React.FC<Props> = ({ clientId }) => {
  const params = useParams();
  const navigate = useNavigate();
  const id = clientId ?? params.id;

  const { data, isLoading, error, refetch } = useGetData<unknown>(
    id ? `/clients/${id}` : "/clients"
  );

  // Try to support a few possible API shapes
  const client: Client | null =
    (data as any)?.user || (data as any)?.data || (data as any) || null;

  const [form, setForm] = useState<Client>({});
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (client) {
      // populate editable fields from API response `data` shape (sample in request uses `data` key)
      const src = (data as any)?.data || (data as any)?.user || data;
      setForm({
        id: src?.id,
        name: src?.name ?? "",
        email: src?.email ?? "",
        company: src?.company ?? src?.company ?? "",
        mobile: src?.mobile ?? "",
        credits: src?.credits ?? 0,
        designation: src?.designation ?? "",
        website: src?.website ?? "",
        state: src?.state ?? "",
        apikey: src?.apikey ?? src?.apiKey ?? "",
        apisecret: src?.apisecret ?? src?.apiSecret ?? "",
        subscriptionId: src?.subscriptionId ?? src?.plan ?? "",
        createdAt: src?.createdAt,
        lastLogin: src?.lastLogin ?? src?.updatedAt,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (!id) {
    return (
      <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
        <CardHeader>
          <CardTitle>No client id</CardTitle>
          <CardDescription>
            Provide a client id via props or route param.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Unable to fetch client details without an id.
          </div>
        </CardContent>
      </Card>
    );
  }

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name || !String(form.name).trim()) e.name = "Name is required";
    if (
      !form.email ||
      !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(String(form.email))
    )
      e.email = "Valid email is required";
    if (!form.mobile || !/^\d{10}$/.test(String(form.mobile)))
      e.mobile = "Mobile must be 10 digits";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!validate() || !id) return;
    setSaving(true);
    try {
      const payload: any = {
        name: form.name,
        email: form.email,
        company: form.company,
        mobile: form.mobile,
        credits: form.credits,
        designation: form.designation,
        website: form.website,
        state: form.state,
        apikey: form.apikey,
        apisecret: form.apisecret,
      };
      const { success } = await API.put(`/clients/${id}`, payload);
      if (success) {
        toast({
          title: "Client updated",
          description: "Client details saved successfully.",
          variant: "default",
        });
        refetch();
      }
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err?.message || "Unable to update client",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  // New helpers for improved UI
  const getInitials = (name?: string) =>
    (name || "")
      .split(" ")
      .map((s) => s.charAt(0))
      .slice(0, 2)
      .join("")
      .toUpperCase();

  const handleCopy = async (value?: string, label = "Value") => {
    if (!value) {
      toast({ title: `${label} empty`, variant: "destructive" });
      return;
    }
    try {
      await navigator.clipboard.writeText(String(value));
      toast({
        title: `${label} copied`,
        description: `Copied ${label} to clipboard.`,
      });
    } catch {
      toast({ title: `Copy failed`, variant: "destructive" });
    }
  };

  return (
    <Card className="shadow-card border-0 bg-card/50 backdrop-blur">
      <form onSubmit={handleSave}>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 flex items-center justify-center text-white font-semibold">
                {getInitials(form.name)}
              </div>
              <div>
                <CardTitle className="text-base">Client Details</CardTitle>
                <CardDescription className="text-sm">
                  {form.name || "Unknown client"} • ID:{" "}
                  <span className="font-medium">{form.id ?? "-"}</span>
                </CardDescription>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="text-right">
              <div className="text-xs text-muted-foreground">Last login</div>
              <div className="text-sm font-medium">
                {form.lastLogin ? moment(form.lastLogin).fromNow() : "-"}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => navigate(-1)}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="gradient-primary text-primary-foreground"
                loading={saving}
              >
                Save
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading && !client ? (
            <div className="text-sm text-muted-foreground">
              <Loader />
            </div>
          ) : error ? (
            <div className="text-sm text-destructive">{error}</div>
          ) : !client ? (
            <div className="text-sm text-muted-foreground">
              No client found.
            </div>
          ) : (
            <div className="space-y-6">
              {/* Basic info */}
              <div>
                <h3 className="text-sm font-medium mb-2">Basic information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={form.name || ""}
                      placeholder="Full name"
                      onChange={(ev) =>
                        setForm({ ...form, name: ev.target.value })
                      }
                      error={errors.name}
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={form.email || ""}
                      placeholder="email@example.com"
                      onChange={(ev) =>
                        setForm({ ...form, email: ev.target.value })
                      }
                      error={errors.email}
                    />
                  </div>

                  <div>
                    <Label>Company</Label>
                    <Input
                      value={form.company || ""}
                      placeholder="Company / Organization"
                      onChange={(ev) =>
                        setForm({ ...form, company: ev.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label htmlFor="mobile">Mobile</Label>
                    <Input
                      id="mobile"
                      value={form.mobile || ""}
                      placeholder="10 digit number"
                      onChange={(ev) =>
                        setForm({ ...form, mobile: ev.target.value })
                      }
                      error={errors.mobile}
                    />
                  </div>
                </div>
              </div>

              {/* Account & keys */}
              <div>
                <h3 className="text-sm font-medium mb-2">Account & API</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Credits</Label>
                    <Input
                      type="number"
                      value={String(form.credits ?? 0)}
                      onChange={(ev) =>
                        setForm({ ...form, credits: Number(ev.target.value) })
                      }
                    />
                  </div>

                  <div>
                    <Label>Subscription</Label>
                    <Input
                      value={String(form.subscriptionId ?? "-")}
                      disabled
                    />
                  </div>

                  <div>
                    <Label>API Key</Label>
                    <div className="flex gap-2">
                      <Input
                        value={form.apikey || ""}
                        onChange={(ev) =>
                          setForm({ ...form, apikey: ev.target.value })
                        }
                        className="flex-1"
                        disabled={true}
                      />
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => handleCopy(form.apikey, "API Key")}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Use this key in client integrations.
                    </div>
                  </div>

                  <div>
                    <Label>API Secret</Label>
                    <div className="flex gap-2">
                      <Input
                        value={form.apisecret || ""}
                        onChange={(ev) =>
                          setForm({ ...form, apisecret: ev.target.value })
                        }
                        className="flex-1"
                        disabled={true}
                      />
                      <Button
                        size="sm"
                        type="button"
                        onClick={() => handleCopy(form.apisecret, "API Secret")}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Keep this secret safe.
                    </div>
                  </div>
                </div>
              </div>

              {/* Extra details */}
              <div>
                <h3 className="text-sm font-medium mb-2">Other details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Designation</Label>
                    <Input
                      value={form.designation || ""}
                      onChange={(ev) =>
                        setForm({ ...form, designation: ev.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Website</Label>
                    <Input
                      value={form.website || ""}
                      onChange={(ev) =>
                        setForm({ ...form, website: ev.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>State</Label>
                    <Input
                      value={form.state || ""}
                      onChange={(ev) =>
                        setForm({ ...form, state: ev.target.value })
                      }
                    />
                  </div>

                  <div>
                    <Label>Created At</Label>
                    <div className="text-sm text-muted-foreground">
                      {form.createdAt
                        ? moment(form.createdAt).format(
                            "Do MMMM YYYY, h:mm:ss a"
                          )
                        : "-"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </form>
    </Card>
  );
};

export default ClientDetails;
