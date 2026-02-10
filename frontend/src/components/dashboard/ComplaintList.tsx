/* eslint-disable react-refresh/only-export-components */

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Home,
  Calendar,
  User,
  XCircle,
  Send,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Complaint } from '@/components/tenant/AddComplaintModal';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Button } from '@/components/ui/button';
import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useData } from '@/context/dataContext';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'open':
      return <Badge className="bg-warning text-foreground">Open</Badge>;
    case 'in-progress':
      return <Badge className="bg-secondary text-secondary-foreground">In Progress</Badge>;
    case 'resolved':
      return <Badge className="bg-success text-primary-foreground">Resolved</Badge>;
    case 'closed':
      return <Badge variant="outline">Closed</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export const getPriorityBadge = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return <Badge className="bg-destructive text-destructive-foreground">Urgent</Badge>;
    case 'high':
      return <Badge className="bg-destructive/80 text-destructive-foreground">High</Badge>;
    case 'medium':
      return <Badge className="bg-warning text-foreground">Medium</Badge>;
    case 'low':
      return <Badge variant="outline">Low</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'open':
      return <AlertCircle className="w-5 h-5 text-warning" />;
    case 'in-progress':
      return <Clock className="w-5 h-5 text-secondary" />;
    case 'resolved':
      return <CheckCircle2 className="w-5 h-5 text-success" />;
    case 'closed':
      return <XCircle className="w-5 h-5 text-muted-foreground" />;
    default:
      return <MessageSquare className="w-5 h-5 text-muted-foreground" />;
  }
};

interface ComplaintListProps {
  complaints?: Complaint[];
  setComplaints : React.Dispatch<React.SetStateAction<Complaint[]>>;
  onSelect?: (complaint: Complaint) => void;

  searchTerm?: string;
  setSearchTerm?: (v: string) => void;

  statusFilter?: string;
  setStatusFilter?: (v: string) => void;

  priorityFilter?: string;
  setPriorityFilter?: (v: string) => void;
}

export default function ComplaintList({
  complaints,
  setComplaints,
  onSelect,
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}: ComplaintListProps) {
  const { toast } = useToast();
  const {properties,profile} = useData();

  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState('');

  const isOwner = sessionStorage.getItem("role") === "owner";

  const safeSearch = searchTerm ?? "";
  const safeStatus = statusFilter ?? "all";
  const safePriority = priorityFilter ?? "all";

  const filteredComplaints = (complaints ?? []).filter((complaint) => {
    const subject = complaint.subject ?? "";
    const property = complaint.property_id ?? "";

    const matchesSearch =
      subject.toLowerCase().includes(safeSearch.toLowerCase()) ||
      property.toLowerCase().includes(safeSearch.toLowerCase());

    const matchesStatus =
      safeStatus === "all" || complaint.status === safeStatus;

    const matchesPriority =
      safePriority === "all" || complaint.priority === safePriority;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleStatusChange = async (
    complaintId: string,
    newStatus: Complaint["status"]
  ) => {

    setLoading(true);
    const { data, error } = await supabase
      .from("complaints")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", complaintId)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const updated = complaints.map((c) =>
      c.id === data.id ? data : c
    );

    setComplaints(updated);

    setSelectedComplaint((prev) =>
      prev?.id === data.id ? data : prev
    );

    toast({
      title: "Status Updated",
      description: `Complaint status changed to ${newStatus}`,
    });
    setLoading(false);
  };

  const handleSendResponse = async () => {
    if (!responseText.trim() || !selectedComplaint) return;

    setLoading(true);
    const newResponse = {
      date: new Date().toISOString(),
      message: responseText,
      from: isOwner ? "Owner" : "Tenant",
    };

    const { data, error } = await supabase
      .from("complaints")
      .update({
        responses: [...(selectedComplaint.responses || []), newResponse],
        status:
          selectedComplaint.status === "open"
            ? "in-progress"
            : selectedComplaint.status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", selectedComplaint.id)
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    const updated = complaints.map((c) =>
      c.id === data.id ? data : c
    );

    setComplaints(updated);

    setSelectedComplaint(data);
    setResponseText("");

    setResponseText('');
    toast({
      title: 'Response Sent',
      description: 'Your response has been sent to the tenant.',
    });
    setLoading(false);
  };

  return (
    <>
      <style>{`
        /* UI polish for ComplaintList (presentation only) */

        :root { --brand-red: #DC2626; }

        .complaint-list-root { width: 100%; }

        /* Filters container */
        .filters {
          background: #fff;
          border: 1px solid rgba(15,23,42,0.04);
          border-radius: 14px;
          padding: 12px;
          box-shadow: 0 6px 20px rgba(2,6,23,0.03);
        }
        .filters .search-wrapper {
          position: relative;
        }
        .filters .search-wrapper .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #9aa4b2;
        }
        .filters .search-input {
          padding-left: 40px;
          height: 44px;
          border-radius: 10px;
          border: 1px solid rgba(15,23,42,0.06);
          background: linear-gradient(180deg, #fff, #fbfbfd);
        }

        .filters .select-trigger {
          height: 44px;
          border-radius: 10px;
          border: 1px solid rgba(15,23,42,0.06);
          background: linear-gradient(180deg,#fff,#fbfbfd);
        }

        /* Empty state */
        .empty-state {
          background: #fff;
          border: 1px solid rgba(15,23,42,0.04);
          border-radius: 14px;
          padding: 56px 28px;
          text-align: center;
          color: #6b7280;
          box-shadow: 0 12px 36px rgba(2,6,23,0.04);
        }
        .empty-state .empty-icon {
          width: 72px;
          height: 72px;
          border-radius: 24px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, rgba(220,226,235,0.5), rgba(245,248,250,0.5));
          margin-bottom: 18px;
        }
        .empty-state h3 {
          margin: 0;
          font-size: 18px;
          color: #0b1220;
          margin-bottom: 6px;
        }
        .empty-state p {
          margin: 0;
          color: #6b7280;
        }

        /* Complaint card */
        .complaint-card {
          background: #fff;
          border: 1px solid rgba(15,23,42,0.04);
          border-radius: 14px;
          padding: 18px;
          transition: transform .16s ease, box-shadow .16s ease, border-color .16s ease;
          box-shadow: 0 6px 20px rgba(2,6,23,0.03);
        }
        .complaint-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(2,6,23,0.06);
          border-color: rgba(15,23,42,0.08);
        }

        .complaint-card .status-tile {
          width:48px;
          height:48px;
          border-radius:10px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          background: linear-gradient(180deg,#fff,#fbfbfd);
          border: 1px solid rgba(15,23,42,0.03);
          box-shadow: 0 6px 18px rgba(2,6,23,0.03);
          flex-shrink:0;
        }

        .complaint-meta .subject {
          font-weight: 700;
          color: #0b1220;
          margin-bottom: 6px;
        }

        .complaint-meta .meta-row {
          color: #6b7280;
          font-size: 13px;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .complaint-meta p.description {
          color: #475569;
          margin-top: 8px;
        }

        .complaint-images img {
          border-radius: 8px;
          border: 1px solid rgba(15,23,42,0.03);
        }

        /* Right-side meta */
        .complaint-right {
          min-width: 160px;
          display:flex;
          flex-direction:column;
          align-items:flex-end;
          gap:8px;
          color:#6b7280;
          font-size:13px;
        }

        /* Dialog adjustments (content inside modal) */
        .dialog-content-custom {
          max-width: 820px;
          max-height: 86vh;
        }

        /* Conversation bubbles */
        .conv-bubble {
          border-radius: 12px;
          padding: 12px;
          max-width: 85%;
        }
        .conv-bubble.tenant {
          background: #f3f4f6;
          color: #0b1220;
        }
        .conv-bubble.owner {
          background: linear-gradient(90deg, rgba(220,38,38,0.06), rgba(249, 115, 22, 0.04));
          color: #0b1220;
        }

      `}</style>

      <div className="complaint-list-root">
        <div className="space-y-4">
          {/* Filters */}
          <div className="filters mb-2">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1 search-wrapper">
                <Search className="search-icon" />
                <Input
                  placeholder="Search by subject, property, or tenant..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
              </div>

              <div style={{ minWidth: 160 }}>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="select-trigger w-full">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="open">Open</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                    <SelectItem value="closed">Closed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div style={{ minWidth: 160 }}>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="select-trigger w-full">
                    <SelectValue placeholder="All Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {filteredComplaints.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">
                <MessageSquare className="w-8 h-8" style={{ color: 'var(--brand-red)' }} />
              </div>
              <h3>No complaints found</h3>
              <p>
                {searchTerm || statusFilter !== 'all' || priorityFilter !== 'all'
                  ? 'Try adjusting your filters or search term'
                  : 'No complaints have been submitted yet'}
              </p>
            </div>
          ) : (
            /* List of complaints */
            <div className="space-y-3">
              {filteredComplaints.map((complaint) => (
                <div
                  key={complaint.id}
                  className="complaint-card cursor-pointer"
                  onClick={() => {
                    setSelectedComplaint(complaint);
                    setIsDetailModalOpen(true);
                    onSelect?.(complaint);
                  }}
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="status-tile">
                        {getStatusIcon(complaint.status)}
                      </div>

                      <div className="complaint-meta flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="subject truncate">{complaint.subject}</h3>
                          {complaint.priority === 'urgent' && (
                            <span className="text-xs" style={{ color: 'var(--brand-red)', fontWeight: 700 }}>⚠️ URGENT</span>
                          )}
                        </div>

                        <div className="meta-row">
                          {isOwner && <span className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {profile?.find((p) => p.id === complaint.tenant_id)?.name}
                          </span>}
                          <span className="flex items-center gap-1">
                            <Home className="w-4 h-4" />
                            {properties.find((p) => p.id === complaint.property_id)?.property_name}
                          </span>
                        </div>

                        <p className="description line-clamp-2">{complaint.description}</p>

                        {complaint.images?.length > 0 && (
                          <div className="mt-3 flex gap-2 complaint-images">
                            {complaint.images.slice(0, 3).map((img, idx) => (
                              <img
                                key={idx}
                                src={img}
                                alt={`complaint-${idx}`}
                                className="h-16 w-16 rounded-lg object-cover"
                              />
                            ))}
                            {complaint.images.length > 3 && (
                              <div className="h-16 w-16 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">
                                +{complaint.images.length - 3}
                              </div>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap items-center gap-2 mt-3">
                          <Badge variant="outline">{complaint.category}</Badge>
                          {getPriorityBadge(complaint.priority)}
                          {getStatusBadge(complaint.status)}
                        </div>
                      </div>
                    </div>

                    <div className="complaint-right">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {complaint.created_at}
                      </div>
                      {complaint.responses.length > 0 && (
                        <div className="flex items-center gap-1 text-secondary">
                          <MessageSquare className="w-4 h-4" />
                          {complaint.responses.length} conversation{complaint.responses.length > 1 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Complaint Detail Modal */}
        <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
          <DialogContent className="dialog-content-custom max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedComplaint && (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    {getStatusIcon(selectedComplaint.status)}
                    {selectedComplaint.subject}
                  </DialogTitle>
                  <DialogDescription>
                    Submitted by {profile.find(p=>p.id === selectedComplaint.tenant_id)?.name} - on {selectedComplaint.created_at.split('T')[0]}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                  {/* Complaint Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">Property</Label>
                      <p className="font-medium">{properties.find((p) => p.id === selectedComplaint.property_id)?.property_name}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Category</Label>
                      <p className="font-medium">{selectedComplaint.category}</p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Priority</Label>
                      <div className="mt-1">{getPriorityBadge(selectedComplaint.priority)}</div>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">Status</Label>
                      <div className="mt-1">
                        <Select
                          value={selectedComplaint.status}
                          onValueChange={(value) => handleStatusChange(selectedComplaint.id, value as Complaint['status'])}
                        >
                          <SelectTrigger className="w-40">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="in-progress">In Progress</SelectItem>
                            <SelectItem value="resolved">Resolved</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <Label className="text-muted-foreground">Description</Label>
                    <p className="mt-1 p-3 bg-muted rounded-lg">{selectedComplaint.description}</p>
                  </div>

                  {/* Tenant Info */}
                  {isOwner && <div className="p-4 bg-accent rounded-lg">
                    <Label className="text-muted-foreground">Tenant Contact</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-secondary/20 flex items-center justify-center">
                        <User className="w-5 h-5 text-secondary" />
                      </div>
                      <div>
                        <p className="font-medium">{profile.find(p=>p.id === selectedComplaint.tenant_id)?.name}</p>
                        <p className="font-medium">{profile.find(p=>p.id === selectedComplaint.tenant_id)?.email}</p>
                      </div>
                    </div>
                  </div>}

                  {/* Conversation */}
                  <div>
                    <Label className="text-muted-foreground mb-3 block">Conversation</Label>

                    {selectedComplaint.responses.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">
                        No responses yet
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {selectedComplaint.responses.map((response, index) => {
                          const isTenant = response.from === "Tenant";

                          return (
                            <div
                              key={index}
                              className={isOwner ?
                                `flex ${isTenant ? "justify-start" :"justify-end" }` :
                                `flex ${isTenant ? "justify-end" :"justify-start" }`
                              }
                            >
                              <div
                                className={`conv-bubble ${isTenant ? "tenant" : "owner"}`}
                              >
                                <div className="flex items-center gap-2 mb-1 text-xs opacity-80">
                                  <User className="w-4 h-4" />
                                  <span className="font-medium">{isOwner ?
                                    response.from === 'Tenant' ? 'Tenant' : 'You' :
                                    response.from === 'Tenant' ? 'You' : 'Owner'
                                  }</span>
                                  <span>{new Date(response.date).toLocaleString()}</span>
                                </div>

                                <p className="text-sm">{response.message}</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Send Response */}
                  {selectedComplaint.status !== 'closed' && (
                    <div className="border-t pt-4">
                      <Label className="mb-2 block">Send Response</Label>
                      <div className="flex gap-2">
                        <Textarea
                          value={responseText}
                          maxLength={100}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder={`Type your response to the ${isOwner ? 'tenant' : 'owner'}...`}
                          rows={3}
                          className="flex-1"
                        />
                      </div>
                      <div className="flex justify-end gap-3 mt-3">
                        <Button variant="outline" onClick={() => setIsDetailModalOpen(false)}>
                          Close
                        </Button>
                        <Button
                          className="bg-secondary hover:bg-secondary/90"
                          onClick={handleSendResponse}
                          disabled={loading}
                        >
                          <Send className="w-4 h-4 mr-2" />
                          {loading ? 'Sending...' : 'Send Response'}
                        </Button>
                      </div>
                    </div>
                  )}

                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
