import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { NavLink } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Building2,
  Edit,
  Trash2,
  ArrowRight,
  FileText,
  MessageSquare,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AddPropertyModal from "@/components/dashboard/AddPropertyModal";
import EditPropertyModal, {
  PropertyData,
} from "@/components/dashboard/EditPropertyModal";
import DeletePropertyDialog from "@/components/dashboard/DeletePropertyDialog";
import PropertyAnalyticsModal from "@/components/dashboard/PropertyAnalyticsModal";
import { useData } from "@/context/dataContext";

const OwnerDashboard = () => {
  const {
    properties,
    setProperties,
    transactions,
    setTransactions,
    complaints,
    setComplaints,
  } = useData();

  console.log(properties);
  console.log(transactions);
  console.log(complaints);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(
    null,
  );

  const handleEditClick = (property: PropertyData) => {
    setSelectedProperty(property);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (property: PropertyData) => {
    setSelectedProperty(property);
    setIsDeleteDialogOpen(true);
  };

  const handleAnalyticsClick = (property: PropertyData) => {
    setSelectedProperty(property);
    setIsAnalyticsModalOpen(true);
  };

  const handlePropertyUpdated = (updatedProperty: PropertyData) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === updatedProperty.id ? updatedProperty : p)),
    );
  };

  const handlePropertyDeleted = (propertyId: string) => {
    setProperties((prev) => prev.filter((p) => p.id !== propertyId));
  };

  return (
    <>
      <Helmet>
        <title>Owner Dashboard | PropGrowthX</title>
        <meta
          name="description"
          content="Manage your properties, track performance, and handle transactions with PropGrowthX Owner Dashboard."
        />
      </Helmet>

      <Layout>
        <div className="bg-muted/30 min-h-screen py-8 lg:py-12">
          <div className="container-custom">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Owner Dashboard
                </h1>
                <p className="text-muted-foreground">
                  Manage your properties and track performance
                </p>
              </div>
            </div>

            {/* <AddPropertyModal
              open={isAddModalOpen}
              onOpenChange={setIsAddModalOpen}
            /> */}

            {/* <EditPropertyModal
              open={isEditModalOpen}
              onOpenChange={setIsEditModalOpen}
              property={selectedProperty}
              onPropertyUpdated={handlePropertyUpdated}
            /> */}

            {/* <DeletePropertyDialog
              open={isDeleteDialogOpen}
              onOpenChange={setIsDeleteDialogOpen}
              property={selectedProperty}
              onPropertyDeleted={handlePropertyDeleted}
            /> */}

            {/* <PropertyAnalyticsModal
              open={isAnalyticsModalOpen}
              onOpenChange={setIsAnalyticsModalOpen}
              property={selectedProperty}
            /> */}

            {/* Quick Navigation Cards */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {/* properties */}
              <NavLink
                to="/dashboard/owner/properties"
                className="bg-card border border-border rounded-2xl p-6 hover:border-secondary/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <Building2 className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        All Properties
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        View and manage all your listings
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                </div>
              </NavLink>
              {/* transactions */}
              <NavLink
                to="/dashboard/owner/transactions"
                className="bg-card border border-border rounded-2xl p-6 hover:border-secondary/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <FileText className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Transactions & Payments
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Track sales, rentals & rent payments
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                </div>
              </NavLink>
              {/* complaints */}
              <NavLink
                to="/dashboard/owner/complaints"
                className="bg-card border border-border rounded-2xl p-6 hover:border-secondary/50 hover:shadow-lg transition-all group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                      <MessageSquare className="w-6 h-6 text-primary group-hover:text-secondary transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">
                        Complaints
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Manage tenant complaints
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors" />
                </div>
              </NavLink>
            </div>

            {/* Properties Table */}
            <div className="bg-card border border-border rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  My Properties
                </h2>
                <div className="flex items-center gap-3">
                  <Input
                    placeholder="Search properties..."
                    className="max-w-xs"
                  />
                  <Button variant="outline" asChild>
                    <NavLink to="/dashboard/owner/properties">View All</NavLink>
                  </Button>
                </div>
              </div>

              {/* owner ows property */}

              {properties.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Property</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Rent / Price</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Inquiries</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {properties.map((property) => (
                        <TableRow key={property.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium text-foreground">
                                {property.property_name}
                              </div>
                              <div className="text-sm text-muted-foreground">
                                {property.city}
                              </div>
                            </div>
                          </TableCell>

                          {/* Type */}
                          <TableCell>{property.property_type}</TableCell>

                          {/* Rent / Price */}
                          <TableCell className="font-medium">
                            {property.listing_type === "RENT"
                              ? `${property.monthly_rent?.toLocaleString() ?? 0} /mo`
                              : (property.price?.toLocaleString() ?? 0)}
                          </TableCell>

                          {/* Status */}
                          <TableCell>
                            <span className="capitalize">
                              {property.status}
                            </span>
                          </TableCell>

                          {/* Views */}

                          {/* Inquiries */}
                          <TableCell>{property.inquiries ?? 0}</TableCell>

                          {/* Actions */}
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditClick(property)}
                                title="Edit Property"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => handleDeleteClick(property)}
                                title="Delete Property"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-center">You have no properties listed</p>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
};

export default OwnerDashboard;
