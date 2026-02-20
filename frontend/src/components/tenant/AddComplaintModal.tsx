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
  const [images, setImages] = useState<string[]>([]);
  const [myProperties, setMyProperties] = useState<PropertyData[]>([]);
  const [dragActive, setDragActive] = useState(false);

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

  useEffect(() => {
    setMyProperties(properties.filter((p) => p.buyer_id === id));
  }, [id, properties]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    processFiles(files);
    e.target.value = "";
  };

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const processFiles = (files: File[]) => {
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result === "string") {
          setImages((prev) => {
            const updated = [...prev, result];
            return updated.slice(0, 5);
          });
        }
      };
      reader.readAsDataURL(file);
    });
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
      setImages([]);
      onOpenChange(false);
    }

    setIsSubmitting(false);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600;700&display=swap');

        :root {
          --brand-red: #DC2626;
          --muted: #6b7280;
          --text-primary: #0b1220;
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(20px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .modal-wrapper {
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 20px 48px rgba(0, 0, 0, 0.12);
          animation: slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          max-width: 500px;
        }

        .modal-wrapper [role="dialog"] {
          max-height: 90vh;
        }

        .modal-header {
          background: linear-gradient(180deg, #fff 0%, #fbfbfd 100%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.04);
          padding: 24px;
        }

        .modal-title {
          font-family: 'Geist', system-ui;
          font-size: 20px;
          font-weight: 700;
          color: var(--text-primary);
          margin: 0;
          letter-spacing: -0.5px;
        }

        .modal-subtitle {
          font-size: 12px;
          color: var(--muted);
          margin: 6px 0 0;
          font-weight: 500;
        }

        .modal-body {
          padding: 24px;
          background: #fff;
          max-height: calc(90vh - 130px);
          overflow-y: auto;
          scrollbar-width: thin;
          scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
        }

        .modal-body::-webkit-scrollbar {
          width: 5px;
        }

        .modal-body::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }

        .form-item {
          margin-bottom: 18px;
        }

        .form-item:last-child {
          margin-bottom: 0;
        }

        .form-label {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          margin-bottom: 8px;
          display: block;
        }

        .form-control {
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.06);
          background: #fff;
          transition: all 0.2s ease;
          font-family: 'Geist', system-ui;
        }

        .form-control:hover {
          border-color: rgba(0, 0, 0, 0.09);
          background: #fbfbfd;
        }

        .form-control:focus,
        .form-control:focus-visible {
          border-color: var(--brand-red);
          box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1);
          outline: none;
          background: #fff;
        }

        .select-trigger {
          height: 42px;
          padding: 0 12px;
        }

        .textarea-input {
          min-height: 100px;
          padding: 10px 12px;
          font-family: 'Geist', system-ui;
          resize: none;
          line-height: 1.5;
        }

        .upload-box {
          border: 2px dashed rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          padding: 28px 20px;
          text-align: center;
          background: linear-gradient(180deg, rgba(248, 248, 248, 0.7), rgba(255, 255, 255, 0.9));
          transition: all 0.3s ease;
          cursor: pointer;
          position: relative;
        }

        .upload-box:hover {
          border-color: rgba(0, 0, 0, 0.12);
          background: linear-gradient(180deg, rgba(243, 244, 246, 1), rgba(255, 255, 255, 1));
          transform: translateY(-2px);
        }

        .upload-box.drag-active {
          border-color: var(--brand-red);
          background: linear-gradient(180deg, rgba(220, 38, 38, 0.04), rgba(220, 38, 38, 0.01));
          transform: scale(1.01);
          box-shadow: 0 6px 20px rgba(220, 38, 38, 0.12);
        }

        .upload-icon {
          width: 48px;
          height: 48px;
          margin: 0 auto 12px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, #fff, #fbfbfd);
          border: 1px solid rgba(0, 0, 0, 0.04);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.04);
        }

        .upload-icon svg {
          width: 24px;
          height: 24px;
          color: var(--muted);
        }

        .upload-text {
          font-size: 13px;
          color: var(--muted);
          margin: 6px 0 0;
          font-weight: 500;
        }

        .image-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
          margin-top: 12px;
          animation: fadeIn 0.3s ease;
        }

        .image-item {
          position: relative;
          border-radius: 10px;
          overflow: hidden;
          border: 1px solid rgba(0, 0, 0, 0.06);
          aspect-ratio: 1;
          background: #f3f4f6;
        }

        .image-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .image-remove {
          position: absolute;
          top: 6px;
          right: 6px;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          background: rgba(0, 0, 0, 0.65);
          border: none;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 16px;
          padding: 0;
        }

        .image-remove:hover {
          background: rgba(0, 0, 0, 0.85);
        }

        .image-count {
          font-size: 12px;
          color: var(--muted);
          margin-top: 8px;
          text-align: right;
        }

        .modal-footer {
          display: flex;
          gap: 10px;
          margin-top: 20px;
          padding-top: 20px;
          border-top: 1px solid rgba(0, 0, 0, 0.04);
        }

        .btn-cancel {
          flex: 1;
          height: 42px;
          border-radius: 10px;
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: #fff;
          color: var(--text-primary);
          font-weight: 600;
          font-size: 14px;
          transition: all 0.2s ease;
          cursor: pointer;
          font-family: 'Geist', system-ui;
        }

        .btn-cancel:hover {
          background: #f9fafb;
          border-color: rgba(0, 0, 0, 0.12);
        }

        .btn-submit {
          flex: 1;
          height: 42px;
          border-radius: 10px;
          background: var(--brand-red);
          color: #fff;
          font-weight: 600;
          font-size: 14px;
          border: none;
          transition: all 0.2s ease;
          cursor: pointer;
          font-family: 'Geist', system-ui;
        }

        .btn-submit:hover:not(:disabled) {
          background: #b91c1c;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(220, 38, 38, 0.25);
        }

        .btn-submit:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        input[type="file"] {
          display: none;
        }

        .form-error {
          border-color: #ef4444 !important;
          background: rgba(239, 68, 68, 0.02) !important;
        }

        .error-text {
          font-size: 12px;
          color: #ef4444;
          margin-top: 5px;
        }

        @media (max-width: 640px) {
          .modal-wrapper {
            border-radius: 14px;
          }

          .modal-header {
            padding: 20px;
          }

          .modal-body {
            padding: 20px;
          }

          .modal-title {
            font-size: 18px;
          }

          .image-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>

      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="modal-wrapper p-0">
          <DialogHeader className="modal-header">
            <DialogTitle className="modal-title">Add New Complaint</DialogTitle>
            <p className="modal-subtitle">Report an issue with your property</p>
          </DialogHeader>

          <div className="modal-body">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">

                <FormField
                  control={form.control}
                  name="property_id"
                  render={({ field }) => (
                    <FormItem className="form-item">
                      <FormLabel className="form-label">Property</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={`form-control select-trigger ${form.formState.errors.property_id ? 'form-error' : ''}`}>
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
                      {form.formState.errors.property_id && (
                        <span className="error-text">{form.formState.errors.property_id.message}</span>
                      )}
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
                          <SelectTrigger className="form-control select-trigger">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
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
                          <SelectTrigger className="form-control select-trigger">
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
                        <Input
                          placeholder="Brief title of the issue"
                          className={`form-control ${form.formState.errors.subject ? 'form-error' : ''}`}
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.subject && (
                        <span className="error-text">{form.formState.errors.subject.message}</span>
                      )}
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
                        <Textarea
                          placeholder="Describe the issue in detail"
                          className={`form-control textarea-input ${form.formState.errors.description ? 'form-error' : ''}`}
                          {...field}
                        />
                      </FormControl>
                      {form.formState.errors.description && (
                        <span className="error-text">{form.formState.errors.description.message}</span>
                      )}
                    </FormItem>
                  )}
                />

                <div className="form-item">
                  <FormLabel className="form-label">Images (Optional)</FormLabel>

                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />

                  <div
                    className={`upload-box ${dragActive ? 'drag-active' : ''}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => document.getElementById('image-upload')?.click()}
                  >
                    <div className="upload-icon">
                      <Upload />
                    </div>
                    <p className="upload-text">Click to upload images or drag them here</p>
                    <p className="upload-text" style={{ fontSize: '11px', marginTop: '4px' }}>PNG, JPG up to 10MB (max 5)</p>
                  </div>

                  {images.length > 0 && (
                    <>
                      <div className="image-grid">
                        {images.map((img, index) => (
                          <div key={index} className="image-item">
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
                      <p className="image-count">{images.length} of 5 images</p>
                    </>
                  )}
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      form.reset();
                      setImages([]);
                    }}
                    className="btn-cancel"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-submit"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddComplaintModal;