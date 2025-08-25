import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { API } from "@/api/axiosInstance";
import Loader from "@/components/ui/loader";
import useGetData from "@/hooks/use-get-data";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Edit3, FileText, Calendar } from "lucide-react";

const TITLE_LIMIT = 80;
const DESCRIPTION_LIMIT = 300;

const Banner = () => {
  const [banner, setBanner] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editFields, setEditFields] = useState({
    title: "",
    description: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);
  const { data, isLoading, refetch } = useGetData("/miscellaneous/banners");

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      setBanner(data[0]);
    } else {
      setBanner(null);
    }
  }, [data]);

  useEffect(() => {
    if (banner) {
      setEditFields({
        title: banner.title || "",
        description: banner.description || "",
      });
    }
  }, [banner]);

  const handleUpdateBanner = async () => {
    setUpdateLoading(true);
    const payload = {
      title: editFields.title,
      description: editFields.description,
    };
    const { success } = await API.put(
      `/miscellaneous/banners/${banner?.id || 1}`,
      payload
    );
    if (success) {
      refetch();
      toast({
        title: "Banner updated successfully",
        description: "Your banner changes have been saved.",
        variant: "default",
      });
      setIsDialogOpen(false);
    }
    setUpdateLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-background/90">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="p-2 rounded-full bg-primary/10">
              <FileText className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Homepage Banner
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Manage and customize your website's main banner content
          </p>
        </div>

        {/* Banner Content Card */}
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg border-0 bg-card/60 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-2xl text-card-foreground">
                    Current Banner
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    Live
                  </Badge>
                </div>
              </div>
              <CardDescription className="text-base">
                This content appears on your website's homepage
              </CardDescription>
            </CardHeader>

            <CardContent className="pt-0">
              {isLoading && !data ? (
                <div className="flex items-center justify-center py-16">
                  <Loader />
                </div>
              ) : banner ? (
                <div className="space-y-6">
                  {/* Banner Preview */}
                  <div className="relative p-8 rounded-xl bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 border border-primary/20">
                    <div className="absolute top-4 right-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsDialogOpen(true)}
                        className="bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200"
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    </div>

                    <div className="space-y-4 pr-20">
                      <h2 className="text-3xl font-bold text-foreground leading-tight">
                        {banner.title}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {banner.description}
                      </p>
                    </div>
                  </div>

                  {/* Meta Information */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground border-t pt-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Last updated:{" "}
                        {banner.updatedAt
                          ? new Date(banner.updatedAt).toLocaleDateString()
                          : "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-16 space-y-4">
                  <div className="p-4 rounded-full bg-muted/50 w-fit mx-auto">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-muted-foreground">
                      No banner found
                    </h3>
                    <p className="text-muted-foreground">
                      Create your first banner to get started
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsDialogOpen(true)}
                    className="mt-4"
                  >
                    Create Banner
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader className="space-y-3">
              <DialogTitle className="text-2xl">
                {banner ? "Edit Banner" : "Create Banner"}
              </DialogTitle>
              <DialogDescription className="text-base">
                {banner
                  ? "Update your banner content below."
                  : "Create a new banner for your homepage."}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-medium">
                  Title
                </Label>
                <Input
                  id="title"
                  value={editFields.title}
                  onChange={(e) =>
                    setEditFields((f) => ({
                      ...f,
                      title: e.target.value.slice(0, TITLE_LIMIT),
                    }))
                  }
                  placeholder="Enter banner title..."
                  className="text-base"
                  maxLength={TITLE_LIMIT}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {editFields.title.length}/{TITLE_LIMIT}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-medium">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={editFields.description}
                  onChange={(e) =>
                    setEditFields((f) => ({
                      ...f,
                      description: e.target.value.slice(0, DESCRIPTION_LIMIT),
                    }))
                  }
                  placeholder="Enter banner description..."
                  rows={4}
                  className="text-base resize-none"
                  maxLength={DESCRIPTION_LIMIT}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {editFields.description.length}/{DESCRIPTION_LIMIT}
                </div>
              </div>
            </div>

            <DialogFooter className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateBanner}
                loading={updateLoading}
                type="button"
                className="px-6"
              >
                {banner ? "Update Banner" : "Create Banner"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Banner;
