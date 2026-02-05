import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useData } from "@/context/dataContext";
import { PropertyData } from "../dashboard/EditPropertyModal";

export interface Complaint {
  id: string;
  tenant_id: string;
  owner_id?: string;
  property_id: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  subject: string;
  description: string;
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  images: string[];
  created_at: string;
  updated_at: string;
  responses: { date: string; message: string; from: string }[];
}

const complaintSchema = z.object({
  property_id: z.string().min(1, "Select a property"),
  category: z.string().min(1, "Select category"),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  subject: z.string().min(3),
  description: z.string().min(10),
  status: z.enum(["open", "in-progress", "resolved", "closed"]),
});

export type ComplaintFormValues = z.infer<typeof complaintSchema>;

interface AddComplaintModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "Maintenance",
  "Appliances",
  "Plumbing",
  "Electrical",
  "Security",
  "Pest Control",
  "Noise Complaint",
  "Other",
];

const AddComplaintModal = ({
  open,
  onOpenChange,
}: AddComplaintModalProps) => {
  const { properties, id } = useData();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const tenantId = sessionStorage.getItem("id");
  const [images, setImages] = useState<(string)[]>([]);
  const [myProperties,setMyProperties] = useState<PropertyData[]>([]);
  
  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      property_id: "",
      category: "Maintenance",
      priority: "low",
      subject: "",
      description: "",
      status: "open",
    },
  });

  useEffect(()=>{
    setMyProperties(properties.filter((p) => p.buyer_id === id));
  },[id, properties])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        const result = reader.result;

        if (typeof result === "string") {
          setImages((prev) => {
            const updated: string[] = [...prev, result];
            return updated.slice(0, 5);
          });
        }
      };

      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: ComplaintFormValues) => {
    setIsSubmitting(true);

    const { error } = await supabase.from("complaints").insert([
      {
        tenant_id: tenantId,
        owner_id: properties.find((p) => p.id === data.property_id)?.owner_id || null,
        property_id: data.property_id,
        category: data.category,
        priority: data.priority,
        subject: data.subject,
        description: data.description,
        status: "open",
        images: images,
      },
    ]);

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Complaint Submitted",
        description: "We will respond shortly",
      });

      form.reset();
      onOpenChange(false);
    }

    setIsSubmitting(false);
  };

  return (
    <>
      {/* ----- UI-only styles for this modal (safe, no logic changes) ----- */}
      <style>{`
        /* Modal container */
        .complaint-dialog {
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 18px 48px rgba(7, 10, 25, 0.12);
        }

        .complaint-header {
          padding: 18px 20px;
          border-bottom: 1px solid rgba(15,23,42,0.06);
          background: linear-gradient(180deg, #fff, #fbfbfd);
        }

        .complaint-title {
          font-size: 18px;
          font-weight: 700;
          color: #0b1220;
          margin: 0;
        }

        .complaint-form {
          padding: 18px 20px 22px;
          background: #fff;
        }

        /* Labels & controls alignment */
        .complaint-form .form-item {
          margin-bottom: 8px;
        }

        .complaint-form .form-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #111827;
          margin-bottom: 8px;
        }

        .complaint-form .modern-input,
        .complaint-form .modern-textarea,
        .complaint-form [role="combobox"] {
          border-radius: 10px;
        }

        .complaint-form .modern-textarea {
          min-height: 96px;
        }

        /* Section title */
        .section-title {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          color: #6b7280;
          margin: 0 0 10px 0;
        }

        /* Upload box */
        .upload-box {
          border-radius: 12px;
          padding: 18px;
          background: linear-gradient(180deg, rgba(247,248,250,0.9), rgba(255,255,255,0.95));
          border: 1px dashed rgba(15,23,42,0.06);
          transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
        }
        .upload-box:hover {
          background: linear-gradient(180deg, rgba(243,244,246,0.98), rgba(255,255,255,1));
          transform: translateY(-2px);
          border-color: rgba(15,23,42,0.09);
        }

        .upload-box .upload-icon {
          width: 46px;
          height: 46px;
          border-radius: 10px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 1px solid rgba(15,23,42,0.04);
          box-shadow: 0 6px 18px rgba(2,6,23,0.03);
        }

        .upload-box p { margin: 6px 0 0 0; color: #6b7280; font-size: 13px; }

        /* Image grid */
        .image-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
        }
        @media(min-width: 640px) {
          .image-grid { grid-template-columns: repeat(3, 1fr); }
        }

        .image-preview {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(15,23,42,0.04);
        }

        .image-preview img {
          width: 100%;
          height: 128px;
          object-fit: cover;
          display: block;
        }

        .image-remove {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.6);
          color: #fff;
          border: none;
          cursor: pointer;
          transition: transform 120ms ease, background 120ms ease;
        }
        .image-remove:hover { transform: translateY(-2px); background: rgba(0,0,0,0.75); }

        /* Footer / action buttons */
        .modal-footer {
          display: flex;
          gap: 10px;
          margin-top: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(15,23,42,0.04);
        }

        .btn-cancel {
          background: #fff;
          border: 1px solid rgba(15,23,42,0.06);
          color: #0b1220;
        }

        .btn-submit {
          background: linear-gradient(90deg, #dc2626, #b91c1c);
          color: #fff;
        }

      `}</style>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="complaint-dialog max-w-lg max-h-[85vh] overflow-hidden">
          <DialogHeader className="complaint-header">
            <DialogTitle className="complaint-title">Add New Complaint</DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="complaint-form space-y-4 max-h-[70vh] overflow-y-auto pr-1"
            >
              <FormField
                control={form.control}
                name="property_id"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel className="form-label">Property</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="modern-input">
                          <SelectValue placeholder="Select a property" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {myProperties.map((property) => (
                          <SelectItem key={property.id} value={property.id.toString()}>
                            {property.property_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel className="form-label">Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="modern-input">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category.toString()}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel className="form-label">Priority</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="modern-input">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel className="form-label">Subject</FormLabel>
                    <FormControl>
                      <Input placeholder="Water leakage" {...field} className="modern-input" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="form-item">
                    <FormLabel className="form-label">Description</FormLabel>
                    <FormControl>
                      <Textarea rows={4} {...field} className="modern-textarea" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4">
                <h3 className="section-title">Complaint Images</h3>

                <div className="upload-box text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer inline-block">
                    <div className="upload-icon mx-auto mb-3">
                      <Upload className="w-5 h-5" style={{ color: '#6b7280' }} />
                    </div>
                    <p className="text-sm" style={{ color: '#6b7280' }}>
                      Click to upload images (max 5)
                    </p>
                    <p className="text-xs" style={{ color: '#9ca3af', marginTop: 6 }}>
                      PNG, JPG up to 10MB each
                    </p>
                  </label>
                </div>

                {images.length > 0 && (
                  <div className="image-grid mt-3">
                    {images.map((img, index) => (
                      <div key={index} className="image-preview">
                        <img src={img} alt={`preview-${index}`} />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="image-remove"
                          aria-label={`Remove image ${index + 1}`}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onOpenChange(false)}
                  className="flex-1 btn-cancel"
                >
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 btn-submit">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddComplaintModal;
