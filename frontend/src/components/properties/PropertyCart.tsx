import { MapPin, Bed, Bath, Square, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PropertyData } from "../dashboard/EditPropertyModal";
import { useNavigate } from "react-router-dom";

const PropertyCard = ({
  property_name,
  address,
  monthly_rent,
  listing_type,
  bedrooms,
  bathrooms,
  total_area,
  id,
}: PropertyData) => {
  const navigate = useNavigate();
  const typeLabels = {
    buy: { label: "For Sale", color: "bg-success text-primary-foreground" },
    rent: {
      label: "For Rent",
      color: "bg-secondary text-secondary-foreground",
    },
    lease: { label: "For Lease", color: "bg-warning text-foreground" },
  };

  const formatPrice = (price: number, type: string) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
    return type === "buy" ? formatted : `${formatted}/mo`;
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src="#"
          alt={property_name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-center gap-1 text-muted-foreground text-sm mb-2">
          <MapPin className="w-4 h-4" />
          <span>{address}</span>
        </div>

        <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-1">
          {property_name}
        </h3>

        {/* Features */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Bed className="w-4 h-4" />
            <span>{bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="w-4 h-4" />
            <span>{bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="w-4 h-4" />
            <span>{total_area} sqft</span>
          </div>
        </div>

        {/* Price & CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center gap-1">
            <Tag className="w-4 h-4 text-secondary" />
            <span className="text-md font-bold text-foreground">
              {formatPrice(monthly_rent, listing_type)}
            </span>
          </div>
          <button
            className="text-primary border-primary hover:bg-primary hover:text-primary-foreground border-2 border-blue-400 p-2 rounded-md"
            onClick={() => navigate(`/property/${id}`)}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
