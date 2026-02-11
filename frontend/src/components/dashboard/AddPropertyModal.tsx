import { useState, ChangeEvent, FormEvent } from "react";
import { toast } from "@/hooks/use-toast";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2, Upload, X, Calendar as CalendarIcon } from "lucide-react";
import axios from "axios";

interface PropertyFormData {
  property_name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  listing_type: "RENT" | "SALE";
  property_type: string;
  monthly_rent: string;
  price: string;
  due_date: Date | null;
  bedrooms: string;
  bathrooms: string;
  otherrooms: string;
  floors: string;
  total_area: string;
  amenities: string;
  status: "AVAILABLE" | "BOOKED" | "SOLD";
}

interface AddPropertyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddPropertyModal({
  open,
  onOpenChange,
}: AddPropertyModalProps) {
  const [formData, setFormData] = useState<PropertyFormData>({
    property_name: "",
    description: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    listing_type: "RENT",
    property_type: "Apartment",
    monthly_rent: "",
    price: "",
    due_date: null,
    bedrooms: "0",
    bathrooms: "1",
    otherrooms: "0",
    floors: "1",
    total_area: "",
    amenities: "",
    status: "AVAILABLE",
  });

  const [images, setImages] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const token = sessionStorage.getItem("token");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newFiles = Array.from(e.target.files).slice(0, 5 - images.length);

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("Payload to be sent:", token);

    e.preventDefault();
    setSubmitting(true);

    const payload = {
      property_name: formData.property_name.trim(),
      description: formData.description.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      zip_code: formData.zip_code.trim(),

      listing_type: formData.listing_type,
      property_type: formData.property_type,

      monthly_rent:
        formData.listing_type === "RENT" && formData.monthly_rent
          ? Number(formData.monthly_rent)
          : null,
      price:
        formData.listing_type === "SALE" && formData.price
          ? Number(formData.price)
          : null,

      due_date: formData.due_date ? formData.due_date.toISOString() : null,

      bedrooms: Number(formData.bedrooms) || 0,
      bathrooms: Number(formData.bathrooms) || 0,
      otherrooms: Number(formData.otherrooms) || 0,
      floors: Number(formData.floors) || 0,
      total_area: Number(formData.total_area) || 0,

      amenities: formData.amenities
        ? formData.amenities
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      images,

      status: formData.status,

      water_available: true,
      electricity_available: true,
    };

    console.log("Payload to be sent:", payload);
    if (token == null) {
      toast({
        title: "Reject (demo)",
        description: "Check console for token",
      });
      return;
    }

    await axios
      .post("http://localhost:5000/api/properties/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log("success");
      })
      .catch((err) => {
        alert(err.message);
      })
      .finally(() => {
        setSubmitting(false);
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto p-4 md:p-8 bg-white rounded-3xl shadow-2xl [&_[data-radix-dialog-close]]:hidden">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-50 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Add New Property</h3>
              <p className="text-sm text-gray-600">Create a new listing</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <section className="space-y-4">
            <h4 className="font-semibold border-b pb-2">Basic Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  PropertyName
                </label>
                <input
                  name="property_name"
                  value={formData.property_name}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input px-3 text-sm"
                  placeholder="Enter your propertyName"
                />
              </div>
              <div>
                <label className="text-sm font-medium block mb-1">
                  Listing Type
                </label>
                <select
                  name="listing_type"
                  value={formData.listing_type}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input px-3 text-sm"
                >
                  <option value="RENT">For Rent</option>
                  <option value="SALE">For Sale</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Property Type
                </label>
                <select
                  name="property_type"
                  value={formData.property_type}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input px-3 text-sm"
                >
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Studio</option>
                  <option>Commercial</option>
                  <option>Penthouse</option>
                  <option>Cabin</option>
                  <option>Villa</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input px-3 text-sm"
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BOOKED">Booked</option>
                  <option value="SOLD">Sold</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {formData.listing_type === "RENT" ? (
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Rent per Month (₹)
                  </label>
                  <input
                    type="number"
                    name="monthly_rent"
                    value={formData.monthly_rent}
                    onChange={handleChange}
                    placeholder="8500"
                    className="h-10 w-full rounded-md border border-input px-3 text-sm"
                  />
                </div>
              ) : (
                <div>
                  <label className="text-sm font-medium block mb-1">
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="4500000"
                    className="h-10 w-full rounded-md border border-input px-3 text-sm"
                  />
                </div>
              )}

              <div>
                <label className="text-sm font-medium block mb-1">
                  Available From
                </label>
                <input
                  type="date"
                  name="due_date"
                  value={
                    formData.due_date
                      ? formData.due_date.toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) => {
                    if (e.target.value) {
                      setFormData((prev) => ({
                        ...prev,
                        due_date: new Date(e.target.value),
                      }));
                    } else {
                      setFormData((prev) => ({ ...prev, due_date: null }));
                    }
                  }}
                  min={new Date().toISOString().split("T")[0]}
                  className="h-10 w-full rounded-md border border-input px-3 py-2 text-sm bg-white"
                />
              </div>
            </div>
          </section>

          {/* Location */}
          <section className="space-y-4">
            <h4 className="font-semibold border-b pb-2">Location</h4>
            <input
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Full Address"
              className="h-10 w-full rounded-md border border-input px-3 text-sm"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="City"
                className="h-10 rounded-md border px-3 text-sm"
              />
              <input
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="State"
                className="h-10 rounded-md border px-3 text-sm"
              />
              <input
                name="zip_code"
                value={formData.zip_code}
                onChange={handleChange}
                placeholder="ZIP / PIN"
                className="h-10 rounded-md border px-3 text-sm"
              />
            </div>
          </section>

          {/* Property Details*/}
          <section className="space-y-4">
            <h4 className="font-semibold border-b pb-2">Property Details</h4>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium block mb-1">
                  Bedrooms
                </label>
                <input
                  name="bedrooms"
                  type="number"
                  min="0"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input px-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Bathrooms
                </label>
                <input
                  name="bathrooms"
                  type="number"
                  min="0"
                  step="0.5"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input px-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">
                  Other Rooms
                </label>
                <input
                  name="otherrooms"
                  type="number"
                  min="0"
                  value={formData.otherrooms}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input px-3 text-sm"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-1">Floors</label>
                <input
                  name="floors"
                  type="number"
                  min="0"
                  value={formData.floors}
                  onChange={handleChange}
                  className="h-10 w-full rounded-md border border-input px-3 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Total Area (sqft)
              </label>
              <input
                name="total_area"
                type="number"
                value={formData.total_area}
                onChange={handleChange}
                placeholder="1200"
                className="h-10 w-full rounded-md border border-input px-3 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the property..."
                className="min-h-[100px] w-full rounded-md border border-input px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-1">
                Amenities (comma separated)
              </label>
              <input
                name="amenities"
                value={formData.amenities}
                onChange={handleChange}
                placeholder="Parking, Gym, Balcony, Lift"
                className="h-10 w-full rounded-md border border-input px-3 text-sm"
              />
            </div>
          </section>

          {/* Images */}
          <section className="space-y-4">
            <h4 className="font-semibold border-b pb-2">Images</h4>
            <div className="border-2 border-dashed rounded-xl p-6 text-center hover:border-red-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
                id="img-upload-simple"
              />
              <label
                htmlFor="img-upload-simple"
                className="cursor-pointer block"
              >
                <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  Upload images (max 5)
                </p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {images.map((src, i) => (
                  <div key={i} className="relative rounded-lg overflow-hidden">
                    <img
                      src={src}
                      alt="preview"
                      className="h-28 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 bg-black/70 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Submit */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="flex-1 h-11 bg-red-600 hover:bg-red-700"
            >
              {submitting ? "Saving..." : "Add Property"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
