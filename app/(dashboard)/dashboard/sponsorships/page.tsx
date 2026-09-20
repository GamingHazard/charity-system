"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Download,
  Users,
  DollarSign,
  ArrowUpRight,
  Loader,
  Plus,
  Archive,
} from "lucide-react";
import {
  mockSponsorshipRecords,
  PaymentRecord,
  SponsorshipRecord,
} from "@/lib/mock-data";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/query-client";

type SponsorshipStatus = SponsorshipRecord["status"];
type PaymentStatus = PaymentRecord["status"];

type SponsorProfile = {
  _id: string;
  profile?: {
    fullName?: string;
    email?: string;
    phone?: string;
    country?: string;
    city?: string;
    state?: string;
    region?: string;
    zipCode?: string;
    bio?: string;
  };
  location?: {
    address?: string;
    country?: string;
    city?: string;
    state?: string;
    region?: string;
    zipCode?: string;
  };
  donation?: {
    amount?: number;
    period?: string;
    remindByEmail?: boolean;
  };
  paymentMethod?: string;
  profileStatus?: "Complete" | "Incomplete" | string;
  isArchived?: boolean;
};

type PaymentForm = {
  amount: string;
  method: string;
  txnId: string;
  note: string;
};

type SponsorForm = {
  name: string;
  email: string;
  phone: string;
  country: string;
  address: string;
  city: string;
  state: string;
  region: string;
  zipCode: string;
  bio: string;
  amount: string;
  period: string;
  remindByEmail: boolean;
  paymentMethod: string;
  childId: string;
  startDate: string;
};

const initialPayment: PaymentForm = {
  amount: "",
  method: "Select method",
  txnId: "",
  note: "",
};

const initialSponsorForm: SponsorForm = {
  name: "",
  email: "",
  phone: "",
  country: "",
  address: "",
  city: "",
  state: "",
  region: "",
  zipCode: "",
  bio: "",
  amount: "",
  period: "Monthly",
  remindByEmail: true,
  paymentMethod: "zelle",
  childId: "",
  startDate: new Date().toISOString().slice(0, 10),
};

function getStatusClasses(status: SponsorshipStatus | string) {
  switch (status) {
    case "Active":
      return "bg-emerald-100 text-emerald-800";
    case "Pending":
      return "bg-amber-100 text-amber-800";
    case "Paused":
      return "bg-slate-100 text-slate-800";
    case "Completed":
      return "bg-sky-100 text-sky-800";
    case "Complete":
      return "bg-emerald-100 text-emerald-800";
    case "Incomplete":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-slate-100 text-slate-800";
  }
}

export default function SponsorshipsDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: sponsorships, isLoading } = useQuery<SponsorProfile[]>({
    queryKey: ["sponsors", "profiles", "all"],
  });
  const { data: childrenData = [] } = useQuery<any[]>({
    queryKey: ["children", "profiles"],
  });

  const [records, setRecords] = useState<SponsorshipRecord[]>(
    mockSponsorshipRecords,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "Complete" | "Incomplete"
  >("all");
  const [selectedRecord, setSelectedRecord] =
    useState<SponsorshipRecord | null>(null);
  const [selectedSponsorProfile, setSelectedSponsorProfile] =
    useState<any>(null);
  const [selectedSponsorChildren, setSelectedSponsorChildren] = useState<any[]>(
    [],
  );
  const [selectedSponsorSummary, setSelectedSponsorSummary] =
    useState<any>(null);
  const [loadingSponsorChildren, setLoadingSponsorChildren] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sponsorSubmitting, setSponsorSubmitting] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<SponsorProfile | null>(
    null,
  );
  const [isArchiving, setIsArchiving] = useState(false);
  const [archiveError, setArchiveError] = useState("");
  const [sponsorFormError, setSponsorFormError] = useState("");
  const [paymentForm, setPaymentForm] = useState(initialPayment);
  const [sponsorForm, setSponsorForm] =
    useState<SponsorForm>(initialSponsorForm);

  const sponsorProfiles = useMemo(
    () => (Array.isArray(sponsorships) ? sponsorships : []),
    [sponsorships],
  );

  const filteredRecords = useMemo(() => {
    return sponsorProfiles.filter((profile) => {
      const matchesSearch = [
        profile.profile?.fullName,
        profile.profile?.email,
        profile.profile?.phone,
        profile.location?.city,
        profile.location?.country,
      ]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || profile.profileStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sponsorProfiles, searchQuery, statusFilter]);

  const totalActive = sponsorProfiles.filter(
    (profile) => profile.profileStatus === "Complete",
  ).length;

  const totalMonthly = sponsorProfiles.reduce(
    (sum, profile) => sum + Number(profile.donation?.amount || 0),
    0,
  );
  const totalPaid = 0;

  const openDetail = (profile: SponsorProfile) => {
    if (!profile._id) return;
    router.push(`/dashboard/sponsorships/${profile._id}`);
  };

  const resetSponsorForm = () => {
    setSponsorForm(initialSponsorForm);
    setSponsorFormError("");
  };

  const openProfileEditor = () => {
    const profile =
      selectedSponsorProfile?.profile || selectedSponsorProfile?.sponsor || {};
    const location = selectedSponsorProfile?.location || {};

    setSponsorForm((current) => ({
      ...current,
      name: profile.fullName || profile.name || current.name,
      email: profile.email || current.email,
      phone: profile.phone || current.phone,
      country: profile.country || location.country || current.country,
      city: profile.city || location.city || current.city,
      state: profile.state || location.state || current.state,
      region: profile.region || location.region || current.region,
      zipCode: profile.zipCode || location.zipCode || current.zipCode,
      bio: profile.bio || current.bio,
    }));
    setIsEditProfileOpen(true);
  };

  const handleUpdateProfile = async () => {
    const sponsorId = selectedSponsorProfile?._id || selectedRecord?.donor?._id;
    if (!sponsorId) return;

    try {
      const response = await apiRequest(
        "PATCH",
        `/sponsors/profile/${sponsorId}`,
        {
          profile: {
            fullName: sponsorForm.name.trim(),
            email: sponsorForm.email.trim(),
            phone: sponsorForm.phone.trim(),
            country: sponsorForm.country.trim(),
            city: sponsorForm.city.trim(),
            state: sponsorForm.state.trim(),
            region: sponsorForm.region.trim(),
            zipCode: sponsorForm.zipCode.trim(),
            bio: sponsorForm.bio.trim(),
          },
        },
      );

      if (!response.ok) throw new Error("Failed to update sponsor profile");

      const result = await response.json();
      setSelectedSponsorProfile(result.sponsor);
      setIsEditProfileOpen(false);
      await queryClient.invalidateQueries({
        queryKey: ["sponsors", "profiles", "all"],
      });
    } catch (error) {
      console.error("Error updating sponsor profile:", error);
      setSponsorFormError(
        "Failed to update sponsor profile. Please try again.",
      );
    }
  };

  const handleCreateSponsor = async () => {
    if (
      !sponsorForm.name.trim() ||
      !sponsorForm.email.trim() ||
      !sponsorForm.phone.trim() ||
      !sponsorForm.amount.trim()
    ) {
      setSponsorFormError(
        "Please provide the sponsor name, email, phone number, and donation amount.",
      );
      return;
    }

    const amount = Number(sponsorForm.amount);
    if (isNaN(amount) || amount <= 0) {
      setSponsorFormError("Please enter a valid donation amount.");
      return;
    }

    setSponsorSubmitting(true);
    setSponsorFormError("");

    try {
      const payload = {
        sponsor: {
          name: sponsorForm.name.trim(),
          email: sponsorForm.email.trim(),
          phone: sponsorForm.phone.trim(),
        },
        profile: {
          fullName: sponsorForm.name.trim(),
          email: sponsorForm.email.trim(),
          phone: sponsorForm.phone.trim(),
          country: sponsorForm.country.trim(),
          city: sponsorForm.city.trim(),
          state: sponsorForm.state.trim(),
          region: sponsorForm.region.trim(),
          zipCode: sponsorForm.zipCode.trim(),
          bio: sponsorForm.bio.trim(),
        },
        childId: sponsorForm.childId || undefined,
        child: sponsorForm.childId || undefined,
        location: {
          address: sponsorForm.address.trim(),
          city: sponsorForm.city.trim(),
          state: sponsorForm.state.trim(),
          zipCode: sponsorForm.zipCode.trim(),
        },
        donation: {
          amount,
          period: sponsorForm.period,
          remindByEmail: sponsorForm.remindByEmail,
        },
        paymentMethod: sponsorForm.paymentMethod,
        startDate: sponsorForm.startDate,
        status: "Active",
        source: "dashboard",
      };

      const res = await apiRequest("POST", "/sponsors/profile/new", payload);
      if (!res.ok) {
        throw new Error("Failed to create sponsor profile");
      }

      await queryClient.invalidateQueries({
        queryKey: ["sponsors", "profiles", "all"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["children", "profiles"],
      });

      setIsCreateDialogOpen(false);
      resetSponsorForm();
    } catch (error) {
      console.error("Error creating sponsor profile:", error);
      setSponsorFormError(
        "Failed to create sponsor profile. Please try again.",
      );
    } finally {
      setSponsorSubmitting(false);
    }
  };

  const handleArchiveSponsor = async () => {
    if (!archiveTarget?._id) return;

    setIsArchiving(true);
    setArchiveError("");
    try {
      await apiRequest("DELETE", `/sponsors/profile/${archiveTarget._id}`);
      await queryClient.invalidateQueries({
        queryKey: ["sponsors", "profiles", "all"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["children", "profiles"],
      });
      setArchiveTarget(null);
    } catch (error) {
      console.error("Error archiving sponsor profile:", error);
      setArchiveError(
        "Unable to archive this sponsor profile. Please try again.",
      );
    } finally {
      setIsArchiving(false);
    }
  };

  const handleUpdateStatus = async (status: SponsorshipStatus) => {
    if (!selectedRecord) return;

    try {
      const res = await apiRequest(
        "PATCH",
        `/sponsors/sponsorship/${selectedRecord._id}/status`,
        { status },
      );

      if (!res.ok) {
        throw new Error("Failed to update sponsorship status");
      }

      const updated: SponsorshipRecord = { ...selectedRecord, status };
      setSelectedRecord(updated);
      setRecords((current) =>
        current.map((record) =>
          record._id === updated._id ? updated : record,
        ),
      );
      await queryClient.invalidateQueries({
        queryKey: ["sponsors", "profiles", "all"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["children", "profiles"],
      });
    } catch (error) {
      console.error("Error updating sponsorship status:", error);
    }
  };

  const handleAddPayment = async () => {
    if (!selectedRecord || !paymentForm.amount.trim()) {
      return;
    }

    setLoading(true);
    try {
      const amountValue = Number(paymentForm.amount);
      if (isNaN(amountValue) || amountValue <= 0) {
        return;
      }

      const payLoad: any = {
        date: new Date().toISOString().slice(0, 10),
        amount: amountValue,
        method: paymentForm.method,
        status: "Completed" as PaymentStatus,
        transactionId: `REC-${Date.now()}`,
        note: paymentForm.note.trim(),
      };
      // const payLoad: any = {
      //   id: selectedRecord._id,
      //   date: new Date().toISOString().slice(0, 10),
      //   amount: amountValue,
      //   method: paymentForm.method,
      //   status: "Completed" as PaymentStatus,
      //   transactionId: `REC-${Date.now()}`,
      //   note: paymentForm.note.trim(),
      // };

      const res = await apiRequest(
        "POST",
        `/sponsors/sponsorship/${selectedRecord._id}/new/payment`,
        payLoad,
      );

      if (!res.ok) {
        throw new Error("Failed to add payment");
      }

      const newPayment: PaymentRecord = {
        date: payLoad.date,
        amount: payLoad.amount,
        method: payLoad.method,
        status: payLoad.status,
        transactionId: payLoad.transactionId,
        note: payLoad.note,
      };

      const updatedRecord: SponsorshipRecord = {
        ...selectedRecord,
        lastPayment: newPayment.date,
        payments: [newPayment, ...selectedRecord.payments],
        status:
          selectedRecord.status === "Pending"
            ? "Active"
            : selectedRecord.status,
      };

      setSelectedRecord(updatedRecord);
      setRecords((current) =>
        current.map((record) =>
          record._id === updatedRecord._id ? updatedRecord : record,
        ),
      );
      await queryClient.invalidateQueries({
        queryKey: ["sponsors", "profiles", "all"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["children", "profiles"],
      });
      setPaymentForm(initialPayment);
    } catch (error) {
      console.error("Error adding payment:", error);
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = () => {
    const headers = [
      "Sponsor",
      "Email",
      "Phone",
      "Location",
      "DonationAmount",
      "Period",
      "ProfileStatus",
    ];
    const rows = sponsorProfiles.map((profile) => [
      profile.profile?.fullName || "",
      profile.profile?.email || "",
      profile.profile?.phone || "",
      [
        profile.location?.city,
        profile.location?.state,
        profile.location?.country,
      ]
        .filter(Boolean)
        .join(", "),
      String(profile.donation?.amount || 0),
      profile.donation?.period || "",
      profile.profileStatus || "Incomplete",
    ]);
    const csvContent = [headers, ...rows]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "sponsor-profiles.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
            Dashboard / Sponsorships
          </p>
          <h1 className="text-3xl font-bold text-foreground">
            Sponsorship Tracking
          </h1>
          <p className="max-w-2xl text-foreground/70 mt-2">
            Track donors, payment history, and active sponsorship plans in one
            place.
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
          <Button
            onClick={() => {
              resetSponsorForm();
              setIsCreateDialogOpen(true);
            }}
            className="w-full md:w-auto"
          >
            <Plus className="mr-2" size={16} /> Add sponsor profile
          </Button>
          <Button onClick={downloadCsv} className="w-full md:w-auto">
            <Download className="mr-2" size={16} /> Export CSV
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 mb-8">
        {isLoading ? (
          <>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-4">
                <Skeleton className="size-6 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-4">
                <Skeleton className="size-6 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-4">
                <Skeleton className="size-6 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </Card>
          </>
        ) : (
          <>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-4">
                <Users className="size-6 text-primary" />
                <div>
                  <p className="text-sm uppercase text-muted-foreground">
                    Complete profiles
                  </p>
                  <p className="text-3xl font-semibold text-foreground">
                    {totalActive}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-4">
                <DollarSign className="size-6 text-emerald-600" />
                <div>
                  <p className="text-sm uppercase text-muted-foreground">
                    Pledged amount
                  </p>
                  <p className="text-3xl font-semibold text-foreground">
                    ${totalMonthly}
                  </p>
                </div>
              </div>
            </Card>
            <Card className="p-6 bg-card border-border">
              <div className="flex items-center gap-4">
                <ArrowUpRight className="size-6 text-sky-600" />
                <div>
                  <p className="text-sm uppercase text-muted-foreground">
                    Paid total
                  </p>
                  <p className="text-3xl font-semibold text-foreground">
                    {totalPaid ? `$${totalPaid}` : "View details"}
                  </p>
                </div>
              </div>
            </Card>
          </>
        )}
      </div>

      {!isLoading && (
        <Card className="p-6 mb-8 bg-card border-border">
          <div className="grid gap-4 md:grid-cols-[1fr_auto] items-end">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="search">Search sponsors</Label>
                <Input
                  id="search"
                  value={searchQuery}
                  placeholder="Search by name, email, or location"
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="statusFilter">Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as "all" | "Complete" | "Incomplete")
                  }
                >
                  <SelectTrigger id="statusFilter">
                    <SelectValue>{statusFilter}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Complete">Complete</SelectItem>
                    <SelectItem value="Incomplete">Incomplete</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Records</Label>
                <p className="text-sm text-foreground/70">
                  {filteredRecords.length} sponsor profiles
                </p>
              </div>
            </div>
          </div>
        </Card>
      )}

      <Card className="overflow-hidden bg-card border-border">
        {isLoading ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sponsor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Donation amount</TableHead>
                <TableHead>Period</TableHead>
                <TableHead>Profile status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold text-primary">
                  Sponsor
                </TableHead>
                <TableHead className="font-bold text-primary">
                  Contact
                </TableHead>
                <TableHead className="font-bold text-primary">
                  Location
                </TableHead>
                <TableHead className="font-bold text-primary">
                  Donation amount
                </TableHead>
                <TableHead className="font-bold text-primary">Period</TableHead>
                <TableHead className="font-bold text-primary">
                  Profile status
                </TableHead>
                {/* <TableHead className="text-right">Action</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((profile, index) => (
                <TableRow
                  className="cursor-pointer"
                  onClick={() => {
                    openDetail(profile);
                  }}
                  key={profile._id || index}
                >
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">
                        {profile.profile?.fullName || "Unnamed sponsor"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {profile.profile?.bio || "No bio provided"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-foreground/80">
                      <p>{profile.profile?.email || "No email"}</p>
                      <p>{profile.profile?.phone || "No phone"}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {[
                      profile.location?.city,
                      profile.location?.state,
                      profile.location?.country,
                    ]
                      .filter(Boolean)
                      .join(", ") || "No location"}
                  </TableCell>
                  <TableCell>
                    ${Number(profile.donation?.amount || 0)}
                  </TableCell>
                  <TableCell>
                    {profile.donation?.period || "Not provided"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusClasses(profile.profileStatus || "Incomplete")}`}
                    >
                      {profile.profileStatus || "Incomplete"}
                    </span>
                  </TableCell>
                  {/* <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openDetail(profile)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => setArchiveTarget(profile)}
                      >
                        <Archive className="mr-1 size-4" />
                        Archive
                      </Button>
                    </div>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>

      <Dialog
        open={Boolean(archiveTarget)}
        onOpenChange={(open) => {
          if (!open) {
            setArchiveTarget(null);
            setArchiveError("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive sponsor profile?</DialogTitle>
            <DialogDescription>
              This will release the sponsor&apos;s active children and hide the
              profile from active lists. Sponsorship and payment history will be
              preserved.
            </DialogDescription>
            {archiveError ? (
              <p className="text-sm text-destructive">{archiveError}</p>
            ) : null}
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isArchiving}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleArchiveSponsor}
              disabled={isArchiving}
            >
              {isArchiving ? (
                <Loader className="mr-2 size-4 animate-spin" />
              ) : (
                <Archive className="mr-2 size-4" />
              )}
              {isArchiving ? "Archiving..." : "Archive profile"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create sponsor profile</DialogTitle>
            <DialogDescription>
              Add a sponsor who can support a child and begin tracking the
              sponsorship relationship.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Sponsor basics
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sponsorName">Full name</Label>
                  <Input
                    id="sponsorName"
                    value={sponsorForm.name}
                    onChange={(event) =>
                      setSponsorForm({
                        ...sponsorForm,
                        name: event.target.value,
                      })
                    }
                    placeholder="Sponsor full name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsorEmail">Email</Label>
                  <Input
                    id="sponsorEmail"
                    type="email"
                    value={sponsorForm.email}
                    onChange={(event) =>
                      setSponsorForm({
                        ...sponsorForm,
                        email: event.target.value,
                      })
                    }
                    placeholder="sponsor@example.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sponsorPhone">Phone</Label>
                  <Input
                    id="sponsorPhone"
                    value={sponsorForm.phone}
                    onChange={(event) =>
                      setSponsorForm({
                        ...sponsorForm,
                        phone: event.target.value,
                      })
                    }
                    placeholder="(555) 123-4567"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsorCountry">Country of origin</Label>
                  <Input
                    id="sponsorCountry"
                    value={sponsorForm.country}
                    onChange={(event) =>
                      setSponsorForm({
                        ...sponsorForm,
                        country: event.target.value,
                      })
                    }
                    placeholder="Country"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsorPaymentMethod">Payment method</Label>
                  <Select
                    value={sponsorForm.paymentMethod}
                    onValueChange={(value) =>
                      setSponsorForm({ ...sponsorForm, paymentMethod: value })
                    }
                  >
                    <SelectTrigger id="sponsorPaymentMethod" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="zelle">Zelle</SelectItem>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="check">Check</SelectItem>
                      <SelectItem value="card">Card</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="ach">ACH</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">Location</p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sponsorAddress">Address</Label>
                  <Input
                    id="sponsorAddress"
                    value={sponsorForm.address}
                    onChange={(event) =>
                      setSponsorForm({
                        ...sponsorForm,
                        address: event.target.value,
                      })
                    }
                    placeholder="Street address"
                  />
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sponsorCity">City</Label>
                    <Input
                      id="sponsorCity"
                      value={sponsorForm.city}
                      onChange={(event) =>
                        setSponsorForm({
                          ...sponsorForm,
                          city: event.target.value,
                        })
                      }
                      placeholder="City"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsorState">State</Label>
                    <Input
                      id="sponsorState"
                      value={sponsorForm.state}
                      onChange={(event) =>
                        setSponsorForm({
                          ...sponsorForm,
                          state: event.target.value,
                        })
                      }
                      placeholder="State"
                    />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="sponsorRegion">Region</Label>
                    <Input
                      id="sponsorRegion"
                      value={sponsorForm.region}
                      onChange={(event) =>
                        setSponsorForm({
                          ...sponsorForm,
                          region: event.target.value,
                        })
                      }
                      placeholder="Region"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sponsorZipCode">Zip code</Label>
                    <Input
                      id="sponsorZipCode"
                      value={sponsorForm.zipCode}
                      onChange={(event) =>
                        setSponsorForm({
                          ...sponsorForm,
                          zipCode: event.target.value,
                        })
                      }
                      placeholder="ZIP code"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsorBio">Bio</Label>
                  <textarea
                    id="sponsorBio"
                    value={sponsorForm.bio}
                    onChange={(event) =>
                      setSponsorForm({
                        ...sponsorForm,
                        bio: event.target.value,
                      })
                    }
                    placeholder="Tell us about the sponsor"
                    className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Donation details
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sponsorAmount">Amount</Label>
                  <Input
                    id="sponsorAmount"
                    type="number"
                    value={sponsorForm.amount}
                    onChange={(event) =>
                      setSponsorForm({
                        ...sponsorForm,
                        amount: event.target.value,
                      })
                    }
                    placeholder="150"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sponsorPeriod">Period</Label>
                  <Select
                    value={sponsorForm.period}
                    onValueChange={(value) =>
                      setSponsorForm({ ...sponsorForm, period: value })
                    }
                  >
                    <SelectTrigger id="sponsorPeriod" className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="3 Months">3 Months</SelectItem>
                      <SelectItem value="6 Months">6 Months</SelectItem>
                      <SelectItem value="Yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsorStartDate">Start date</Label>
                <Input
                  id="sponsorStartDate"
                  type="date"
                  value={sponsorForm.startDate}
                  onChange={(event) =>
                    setSponsorForm({
                      ...sponsorForm,
                      startDate: event.target.value,
                    })
                  }
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="remindByEmail"
                  type="checkbox"
                  checked={sponsorForm.remindByEmail}
                  onChange={(event) =>
                    setSponsorForm({
                      ...sponsorForm,
                      remindByEmail: event.target.checked,
                    })
                  }
                  className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
                />
                <Label htmlFor="remindByEmail">Send reminders by email</Label>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Optional child assignment
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sponsorChild">Link to child</Label>
                <Select
                  value={sponsorForm.childId}
                  onValueChange={(value) =>
                    setSponsorForm({ ...sponsorForm, childId: value })
                  }
                >
                  <SelectTrigger id="sponsorChild" className="w-full">
                    <SelectValue placeholder="Select a child (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {childrenData.map((child) => (
                      <SelectItem key={child._id} value={child._id}>
                        {child.firstName} {child.secondName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {sponsorFormError ? (
              <p className="text-sm text-red-500">{sponsorFormError}</p>
            ) : null}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                variant="outline"
                onClick={() => {
                  resetSponsorForm();
                  setSponsorFormError("");
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button onClick={handleCreateSponsor} disabled={sponsorSubmitting}>
              {sponsorSubmitting ? (
                <>
                  Creating... <Loader className="ml-2 animate-spin" size={16} />
                </>
              ) : (
                "Create sponsor"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditProfileOpen} onOpenChange={setIsEditProfileOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Complete sponsor profile</DialogTitle>
            <DialogDescription>
              Add or correct the sponsor information without changing
              sponsorship payments.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="editSponsorName">Full name</Label>
              <Input
                id="editSponsorName"
                value={sponsorForm.name}
                onChange={(event) =>
                  setSponsorForm({ ...sponsorForm, name: event.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editSponsorEmail">Email</Label>
              <Input
                id="editSponsorEmail"
                type="email"
                value={sponsorForm.email}
                onChange={(event) =>
                  setSponsorForm({ ...sponsorForm, email: event.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editSponsorPhone">Phone</Label>
              <Input
                id="editSponsorPhone"
                value={sponsorForm.phone}
                onChange={(event) =>
                  setSponsorForm({ ...sponsorForm, phone: event.target.value })
                }
              />
            </div>
            {[
              ["country", "Country of origin"],
              ["city", "City"],
              ["state", "State"],
              ["region", "Region"],
              ["zipCode", "Zip code"],
            ].map(([field, label]) => (
              <div className="space-y-2" key={field}>
                <Label htmlFor={`editSponsor${field}`}>{label}</Label>
                <Input
                  id={`editSponsor${field}`}
                  value={sponsorForm[field as keyof SponsorForm] as string}
                  onChange={(event) =>
                    setSponsorForm({
                      ...sponsorForm,
                      [field]: event.target.value,
                    })
                  }
                />
              </div>
            ))}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="editSponsorBio">Bio</Label>
              <textarea
                id="editSponsorBio"
                value={sponsorForm.bio}
                onChange={(event) =>
                  setSponsorForm({ ...sponsorForm, bio: event.target.value })
                }
                className="min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              />
            </div>
            {sponsorFormError ? (
              <p className="text-sm text-red-500 md:col-span-2">
                {sponsorFormError}
              </p>
            ) : null}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditProfileOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleUpdateProfile}>Save profile</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-175 overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sponsorship details</DialogTitle>
          </DialogHeader>
          {selectedRecord ? (
            <div className="space-y-6">
              <div className="grid gap-4 lg:grid-cols-1">
                <Card className="p-6 relative   bg-card border-border">
                  <div className="space-y-4">
                    <div className="absolute top-5 right-3">
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                        Status
                      </p>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusClasses(selectedRecord.status)}`}
                      >
                        {selectedRecord.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                        Child
                      </p>
                      <h2 className="text-xl font-semibold text-foreground">
                        {selectedRecord.child?.firstName}
                      </h2>
                      <p className="text-sm text-foreground/70">
                        {selectedRecord.plan}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                        Sponsor profile
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={openProfileEditor}
                      >
                        Complete profile
                      </Button>
                      <p className="text-lg font-semibold text-foreground">
                        {selectedSponsorProfile?.sponsor?.name ||
                          selectedSponsorProfile?.name ||
                          selectedRecord.donor?.sponsor?.name}
                      </p>
                      <a
                        href={`mailto:${selectedSponsorProfile?.sponsor?.email || selectedSponsorProfile?.email || selectedRecord.donor?.sponsor?.email}`}
                        className="text-sm text-accent underline"
                      >
                        {selectedSponsorProfile?.sponsor?.email ||
                          selectedSponsorProfile?.email ||
                          selectedRecord.donor?.sponsor?.email}
                      </a>{" "}
                      -{" "}
                      {selectedSponsorProfile?.sponsor?.phone ||
                        selectedSponsorProfile?.phone ||
                        selectedRecord.donor?.sponsor?.phone}
                      <p className="text-sm text-foreground/70">
                        {selectedSponsorProfile?.location?.city ||
                          selectedRecord.donor?.phone ||
                          "Location not provided"}
                      </p>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-lg bg-slate-100 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          {selectedRecord.donor?.donation?.period}
                        </p>
                        <p className="text-xl font-semibold text-foreground">
                          ${selectedRecord?.donor?.donation?.amount || 0}
                        </p>
                      </div>
                      <div className="rounded-lg bg-slate-100 p-4">
                        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                          All time Donations
                        </p>
                        <p className="text-xl font-semibold text-foreground">
                          $
                          {selectedRecord.payments
                            .map((p) => p.amount)
                            .reduce((sum, amount) => sum + amount, 0)}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-lg border border-border bg-background p-4">
                      <div className="mb-3 flex items-center justify-between gap-3">
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                          Sponsor relationship
                        </p>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                          {(selectedSponsorSummary?.totalChildren ??
                            selectedSponsorChildren.length) ||
                            0}{" "}
                          children
                        </span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-md bg-slate-100 p-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Active
                          </p>
                          <p className="mt-2 text-lg font-semibold text-foreground">
                            {selectedSponsorSummary?.activeChildren ??
                              selectedSponsorChildren.filter(
                                (entry) => entry.status === "Active",
                              ).length}
                          </p>
                        </div>
                        <div className="rounded-md bg-slate-100 p-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Pledged
                          </p>
                          <p className="mt-2 text-lg font-semibold text-foreground">
                            $
                            {selectedSponsorSummary?.totalPledged ??
                              selectedSponsorChildren.reduce(
                                (sum, entry) => sum + (entry.amount || 0),
                                0,
                              )}
                          </p>
                        </div>
                        <div className="rounded-md bg-slate-100 p-3">
                          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            Paid
                          </p>
                          <p className="mt-2 text-lg font-semibold text-foreground">
                            $
                            {selectedSponsorSummary?.totalPaid ??
                              selectedSponsorChildren.reduce(
                                (sum, entry) => sum + (entry.totalPaid || 0),
                                0,
                              )}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {loadingSponsorChildren ? (
                          <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            <Skeleton className="h-10 w-full" />
                          </div>
                        ) : selectedSponsorChildren.length > 0 ? (
                          selectedSponsorChildren.map((entry, index) => {
                            const child = entry.child || {};
                            const childName =
                              child.firstName || child.name || "Unnamed child";
                            const lastPayment = entry.lastPayment
                              ? new Date(entry.lastPayment).toLocaleDateString()
                              : "No payment";

                            return (
                              <div
                                key={entry._id || index}
                                className="flex items-center justify-between gap-3 rounded-md border border-border bg-slate-50 p-3"
                              >
                                <div>
                                  <p className="font-medium text-foreground">
                                    {childName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {entry.status} • ${entry.amount || 0} •{" "}
                                    {lastPayment}
                                  </p>
                                </div>
                                <span
                                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusClasses(entry.status)}`}
                                >
                                  {entry.status}
                                </span>
                              </div>
                            );
                          })
                        ) : (
                          <p className="rounded-md border border-dashed border-border p-3 text-sm text-foreground/70">
                            No children are currently linked to this sponsor.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-3">
                        <Label htmlFor="recordStatus">Update status</Label>
                        <Select
                          value={selectedRecord.status}
                          onValueChange={handleUpdateStatus}
                        >
                          <SelectTrigger id="recordStatus" className="w-full">
                            <SelectValue>{selectedRecord.status}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Paused">Paused</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="grid gap-4 lg:grid-cols-1">
                <Card className="p-6 bg-card border-border">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                          Payment history
                        </p>
                        <p className="text-foreground/70">
                          Latest contributions for this sponsorship.
                        </p>
                      </div>
                      <Badge className="bg-slate-100 text-slate-800">
                        {selectedRecord.payments.length} entries
                      </Badge>
                    </div>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Method</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Transaction ID</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {selectedRecord.payments.map((payment, index) => (
                            <TableRow key={index}>
                              <TableCell>
                                {new Date(payment.date).toLocaleDateString()}
                              </TableCell>
                              <TableCell>${payment.amount}</TableCell>
                              <TableCell>{payment.method}</TableCell>
                              <TableCell>{payment.status}</TableCell>
                              <TableCell>{payment.transactionId}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </Card>
                <Card className="p-6 bg-card border-border">
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                        Record a payment
                      </p>
                      <p className="text-foreground/70">
                        Add a new donation or sponsor contribution.
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="paymentAmount">Amount</Label>
                        <Input
                          id="paymentAmount"
                          type="number"
                          value={paymentForm.amount}
                          placeholder="100"
                          onChange={(event) =>
                            setPaymentForm({
                              ...paymentForm,
                              amount: event.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentMethod">Method</Label>
                        <Select
                          value={paymentForm.method}
                          onValueChange={(value) =>
                            setPaymentForm({ ...paymentForm, method: value })
                          }
                        >
                          <SelectTrigger id="paymentMethod" className="w-full ">
                            <SelectValue>{paymentForm.method}</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Zelle">Zelle</SelectItem>
                            <SelectItem value="Stripe">Stripe</SelectItem>
                            <SelectItem value="Check">Check</SelectItem>
                            <SelectItem value="PayPal">PayPal</SelectItem>
                            <SelectItem value="ACH">ACH</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="paymentTxnId">Transaction ID</Label>
                        <Input
                          id="paymentTxnId"
                          type="text"
                          value={paymentForm.txnId}
                          placeholder="transaction ID / receipt No. from the payment method used"
                          onChange={(event) =>
                            setPaymentForm({
                              ...paymentForm,
                              txnId: event.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="paymentNote">Note</Label>
                        <Input
                          id="paymentNote"
                          value={paymentForm.note}
                          placeholder="Gift update or memo"
                          onChange={(event) =>
                            setPaymentForm({
                              ...paymentForm,
                              note: event.target.value,
                            })
                          }
                        />
                      </div>
                      <Button
                        onClick={handleAddPayment}
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            Adding payment...{" "}
                            <Loader className="animate-spin" />
                          </>
                        ) : (
                          "Add payment"
                        )}
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-foreground/70">
              No sponsorship record selected.
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
