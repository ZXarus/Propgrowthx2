/* eslint-disable react-refresh/only-export-components */

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  Calendar,
  XCircle,
  Send,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";

export default function ComplaintList({
  complaints = [],
  searchTerm = "",
  setSearchTerm,
  statusFilter = "all",
  setStatusFilter,
  priorityFilter = "all",
  setPriorityFilter,
  isDetailModalOpen,
  setIsDetailModalOpen,
  selectedComplaint,
  setSelectedComplaint,
}) {
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- FILTER LOGIC ---------------- */
  const filteredComplaints = complaints.filter((complaint) => {
    const subject = complaint.subject || "";
    const property = complaint.property_name || complaint.property_id || "";

    const matchesSearch =
      subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || complaint.status === statusFilter;

    const matchesPriority =
      priorityFilter === "all" || complaint.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  /* ---------------- BADGES ---------------- */
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return <Badge className="bg-warning text-foreground">Open</Badge>;
      case "in progress":
        return (
          <Badge className="bg-secondary text-secondary-foreground">
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-success text-primary-foreground">Resolved</Badge>
        );
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return (
          <Badge className="bg-destructive text-destructive-foreground">
            Urgent
          </Badge>
        );
      case "high":
        return (
          <Badge className="bg-destructive/80 text-destructive-foreground">
            High
          </Badge>
        );
      case "medium":
        return <Badge className="bg-warning text-foreground">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <AlertCircle className="w-5 h-5 text-warning" />;
      case "in progress":
        return <Clock className="w-5 h-5 text-secondary" />;
      case "resolved":
        return <CheckCircle2 className="w-5 h-5 text-success" />;
      case "closed":
        return <XCircle className="w-5 h-5 text-muted-foreground" />;
      default:
        return <MessageSquare className="w-5 h-5 text-muted-foreground" />;
    }
  };

  /* ---------------- SEND RESPONSE (LOCAL ONLY) ---------------- */
  const handleSendResponse = () => {
    if (!responseText.trim() || !selectedComplaint) return;

    setLoading(true);

    setTimeout(() => {
      setResponseText("");
      setLoading(false);
    }, 600);
  };

  return (
    <div className="w-full space-y-4">
      {/* Filters */}
      <div className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <Input
              placeholder="Search by subject, property, or tenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm?.(e.target.value)}
              className="pl-10 h-11 rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-44 rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
              <SelectItem value="closed">Closed</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="h-11 w-44 rounded-lg border border-slate-200 bg-gradient-to-b from-white to-slate-50">
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

      {/* Complaint List */}
      {filteredComplaints.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-xl py-14 px-7 text-center shadow-md">
          <MessageSquare className="w-8 h-8 text-red-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-900">
            No complaints found
          </h3>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredComplaints.map((complaint) => (
            <div
              key={complaint.id}
              className="bg-white border border-slate-100 rounded-xl p-4 transition-all duration-150 hover:-translate-y-1.5 hover:shadow-xl cursor-pointer"
              onClick={() => {
                setSelectedComplaint(complaint);
                setIsDetailModalOpen(true);
              }}
            >
              <div className="flex justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-b from-white to-slate-50 border border-slate-100 shadow-sm">
                    {getStatusIcon(complaint.status)}
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      {complaint.subject}
                    </h3>

                    <p className="text-slate-600 mt-1 line-clamp-2">
                      {complaint.description}
                    </p>

                    <div className="flex gap-2 mt-3">
                      {getPriorityBadge(complaint.priority)}
                      {getStatusBadge(complaint.status)}
                    </div>
                  </div>
                </div>

                <div className="text-slate-500 text-sm flex flex-col items-end">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {complaint.created_at?.split("T")[0] ||
                      complaint.created_at}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedComplaint && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedComplaint.subject}</DialogTitle>
                <DialogDescription>
                  {selectedComplaint.created_at?.split("T")[0] ||
                    selectedComplaint.created_at}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 mt-4">
                <Label>Description</Label>
                <p className="p-3 bg-slate-100 rounded-lg">
                  {selectedComplaint.description}
                </p>

                {selectedComplaint.status !== "closed" && (
                  <div className="border-t pt-4">
                    <Textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      rows={3}
                      placeholder="Type your response..."
                    />
                    <div className="flex justify-end mt-3">
                      <Button onClick={handleSendResponse} disabled={loading}>
                        <Send className="w-4 h-4 mr-2" />
                        {loading ? "Sending..." : "Send"}
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
  );
}
