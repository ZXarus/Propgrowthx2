import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  User,
  Mail,
  Phone,
  MapPin,
  Building2,
  Camera,
  Bell,
  Shield,
  CreditCard,
  ArrowLeft,
  Save,
  Globe,
  Briefcase,
} from "lucide-react";

import { toast } from "sonner";
import { useData } from "@/context/dataContext";

export type ProfileData = {
  id?: string;
  name: string;
  email: string;
  role?: "tenant" | "owner";
  password: string;
  profile_image: string;
  emer_contact: string | null;
  s_link1: string | null;
  s_link2: string | null;
  s_link3: string | null;
  phone: string;
  address: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  avatar: string | null;
  past_residence?: string | null;
  id_proof?: string | null;
  background?: string | null;
  company?: string | null;
  comp_address?: string | null;
};

const Profile = () => {
  const { profile, setProfile } = useData();

  const currentProfile = Array.isArray(profile)
    ? profile[0]
    : profile
      ? profile
      : null;

  const role = currentProfile?.role || "tenant";
  const isOwner = role === "owner";

  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [idPreview, setIdPreview] = useState<string | null>(null);

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailAlerts: true,
    smsAlerts: false,
    inquiryNotifications: true,
    paymentReminders: true,
    marketUpdates: false,
  });

  // Update profile input values
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setProfile((prev: any) =>
      Array.isArray(prev)
        ? [{ ...prev[0], [name]: value }]
        : { ...prev, [name]: value },
    );
  };

  // Avatar file change
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setAvatarPreview(previewURL);

    setProfile((prev: any) =>
      Array.isArray(prev)
        ? [{ ...prev[0], avatar: previewURL }]
        : { ...prev, avatar: previewURL },
    );
  };

  // ID Proof change
  const handleIdProofChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewURL = URL.createObjectURL(file);
    setIdPreview(previewURL);

    setProfile((prev: any) =>
      Array.isArray(prev)
        ? [{ ...prev[0], id_proof: previewURL }]
        : { ...prev, id_proof: previewURL },
    );
  };

  // Save Profile Button
  const handleSaveProfile = async () => {
    if (!profile) return;

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      toast.success("Profile saved!");
    }, 800);
  };

  return (
    <>
      <Helmet>
        <title>Profile | PropGrowthX</title>
        <meta
          name="description"
          content="Manage your owner profile, settings, and preferences on PropGrowthX."
        />
      </Helmet>

      <Layout>
        <div className="bg-muted/30 min-h-screen py-8 lg:py-12">
          <div className="container-custom max-w-4xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard/owner">
                  <ArrowLeft className="w-5 h-5" />
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{role}</h1>
                <p className="text-muted-foreground">
                  Manage your profile and account settings
                </p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Avatar & Basic Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Personal Information
                  </CardTitle>
                  <CardDescription>
                    Update your personal details and profile picture
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar Upload */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full bg-accent flex items-center justify-center overflow-hidden border-4 border-secondary/20">
                        {avatarPreview || currentProfile?.avatar ? (
                          <img
                            src={avatarPreview || currentProfile?.avatar}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-12 h-12 text-muted-foreground" />
                        )}
                      </div>
                      <label
                        htmlFor="avatar-upload"
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center cursor-pointer hover:bg-secondary/90 transition-colors"
                      >
                        <Camera className="w-4 h-4" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Profile Photo
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        JPG, GIF or PNG. Max size 2MB.
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Name</Label>
                    <Input
                      name="name"
                      value={currentProfile?.name ?? ""}
                      onChange={handleInputChange}
                      placeholder="Enter name"
                    />
                  </div>

                  {/* Email & Phone */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address
                      </Label>
                      <Input
                        name="email"
                        type="email"
                        value={currentProfile?.email ?? ""}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        Phone Number
                      </Label>
                      <Input
                        name="phone"
                        value={currentProfile?.phone ?? ""}
                        onChange={handleInputChange}
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Family Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Family Details
                  </CardTitle>
                </CardHeader>
              </Card>

              {/* Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Address
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Street Address</Label>
                    <Input
                      name="address"
                      value={currentProfile?.address ?? ""}
                      onChange={handleInputChange}
                      placeholder="Enter street address"
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>City</Label>
                      <Input
                        name="city"
                        value={currentProfile?.city ?? ""}
                        onChange={handleInputChange}
                        placeholder="Enter city"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>State</Label>
                      <Input
                        name="state"
                        value={currentProfile?.state ?? ""}
                        onChange={handleInputChange}
                        placeholder="Enter state"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Zip Code</Label>
                      <Input
                        name="zip_code"
                        value={currentProfile?.zip_code ?? ""}
                        onChange={handleInputChange}
                        placeholder="Enter zip code"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Links */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Social Links
                  </CardTitle>
                  <CardDescription>Manage your social presence</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Company / Business Name</Label>
                    <Input
                      name="company"
                      value={currentProfile?.company ?? ""}
                      onChange={handleInputChange}
                      placeholder="Enter business name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Street Address</Label>
                    <Input
                      name="comp_address"
                      value={currentProfile?.comp_address ?? ""}
                      onChange={handleInputChange}
                      placeholder="Enter company/business address"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Website</Label>
                    <Input
                      name="s_link1"
                      value={currentProfile?.s_link1 ?? ""}
                      onChange={handleInputChange}
                      placeholder="https://"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>LinkedIn</Label>
                    <Input
                      name="s_link2"
                      value={currentProfile?.s_link2 ?? ""}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Instagram / Twitter</Label>
                    <Input
                      name="s_link3"
                      value={currentProfile?.s_link3 ?? ""}
                      onChange={handleInputChange}
                      placeholder="https://"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Tenant Only Sections */}
              {!isOwner && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Tenant Verification Details
                      </CardTitle>
                      <CardDescription>
                        Residential history and verification information
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Past Residence Address</Label>
                        <Textarea
                          name="past_residence"
                          value={currentProfile?.past_residence ?? ""}
                          onChange={handleInputChange}
                          placeholder="Enter previous residence address"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>ID Proof (Aadhaar / PAN / Passport)</Label>

                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleIdProofChange}
                        />

                        {idPreview && (
                          <div className="mt-2">
                            <img
                              src={idPreview}
                              alt="ID Proof Preview"
                              className="w-48 h-auto rounded-md border"
                            />
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label>Background / Occupation</Label>
                        <Textarea
                          name="background"
                          value={currentProfile?.background ?? ""}
                          onChange={handleInputChange}
                          placeholder="Student / Job / Business / Other"
                        />
                      </div>
                    </CardContent>
                  </Card>

                  {/* Emergency Contact */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Emergency Contact
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                        <div className="space-y-2">
                          <Label>Name</Label>
                          <Input
                            name="emer_contact"
                            value={currentProfile?.emer_contact ?? ""}
                            onChange={handleInputChange}
                            placeholder="Enter name"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Phone</Label>
                          <Input
                            name="emer_phone"
                            value={currentProfile?.emer_contact ?? ""}
                            onChange={handleInputChange}
                            placeholder="Enter phone"
                          />
                        </div>

                        <div className="space-y-2 md:col-span-4">
                          <Label>Residence Address</Label>
                          <Textarea
                            name="emer_address"
                            value={currentProfile?.address ?? ""}
                            onChange={handleInputChange}
                            placeholder="Enter residence address"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </>
              )}

              {/* Notification Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Choose how you want to receive notifications
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        Email Alerts
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Receive notifications via email
                      </div>
                    </div>
                    <Switch
                      checked={notifications.emailAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          emailAlerts: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        SMS Alerts
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Receive notifications via SMS
                      </div>
                    </div>
                    <Switch
                      checked={notifications.smsAlerts}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          smsAlerts: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        Property Inquiries
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Get notified when someone inquires about your property
                      </div>
                    </div>
                    <Switch
                      checked={notifications.inquiryNotifications}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          inquiryNotifications: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        Payment Reminders
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Get reminded about upcoming rent payments
                      </div>
                    </div>
                    <Switch
                      checked={notifications.paymentReminders}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          paymentReminders: checked,
                        }))
                      }
                    />
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">
                        Market Updates
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Receive real estate market insights and trends
                      </div>
                    </div>
                    <Switch
                      checked={notifications.marketUpdates}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({
                          ...prev,
                          marketUpdates: checked,
                        }))
                      }
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Account Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Account Settings
                  </CardTitle>
                  <CardDescription>
                    Manage your account security and billing
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      variant="outline"
                      className="justify-start h-auto py-4"
                    >
                      <Shield className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Security Settings</div>
                        <div className="text-sm text-muted-foreground">
                          Password, 2FA, sessions
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start h-auto py-4"
                    >
                      <CreditCard className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Billing & Payments</div>
                        <div className="text-sm text-muted-foreground">
                          Payment methods, invoices
                        </div>
                      </div>
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start h-auto py-4"
                    >
                      <Building2 className="w-5 h-5 mr-3" />
                      <div className="text-left">
                        <div className="font-medium">Property Settings</div>
                        <div className="text-sm text-muted-foreground">
                          Default listing preferences
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Save Button */}
              <div className="flex justify-end gap-4">
                <Button variant="outline" asChild>
                  <Link to="/dashboard/owner">Cancel</Link>
                </Button>

                <Button
                  className="bg-secondary hover:bg-secondary/90"
                  onClick={handleSaveProfile}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default Profile;
