"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { taskService } from "@/services/taskService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Calendar, MessageSquare, Send, Loader2, Trash2 } from "lucide-react";

const priorityStyles: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const statusStyles: Record<string, string> = {
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

interface Props {
  taskId: number;
  onClose: () => void;
}

export default function TaskDetailDialog({ taskId, onClose }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState("");

  const { data: taskData, isLoading } = useQuery({
    queryKey: ["task", taskId],
    queryFn: () => taskService.getById(taskId),
  });

  const addCommentMutation = useMutation({
    mutationFn: (content: string) => taskService.addComment(taskId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", taskId] });
      setComment("");
    },
    onError: () => {
      toast({
        title: "Failed to add comment",
        variant: "destructive",
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: () => taskService.delete(taskId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast({ title: "Task deleted" });
      onClose();
    },
  });

  const task = taskData?.data;

  const handleAddComment = () => {
    if (!comment.trim()) return;
    addCommentMutation.mutate(comment.trim());
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
          </div>
        ) : task ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-left pr-8">{task.title}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Badges */}
              <div className="flex flex-wrap gap-2">
                <Badge className={priorityStyles[task.priority]}>
                  {task.priority} priority
                </Badge>
                <Badge className={statusStyles[task.status]}>
                  {task.status.replace("_", " ")}
                </Badge>
              </div>

              {/* Description */}
              {task.description && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                    Description
                  </p>
                  <p className="text-sm text-slate-600">{task.description}</p>
                </div>
              )}

              {/* Due date */}
              {task.dueDate && (
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Calendar className="h-4 w-4" />
                  <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                </div>
              )}

              {/* Assignee */}
              {task.assignee && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Assignee
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs bg-slate-200">
                        {task.assignee.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-slate-700">
                      {task.assignee.name}
                    </span>
                  </div>
                </div>
              )}

              {/* Comments */}
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Comments ({task.comments?.length || 0})
                </p>

                <div className="space-y-3 mb-3 max-h-48 overflow-y-auto">
                  {task.comments?.length === 0 && (
                    <p className="text-xs text-slate-400 text-center py-4">
                      No comments yet
                    </p>
                  )}
                  {task.comments?.map((comment: any) => (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="h-6 w-6 shrink-0 mt-0.5">
                        <AvatarFallback className="text-xs bg-slate-200">
                          {comment.user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 bg-slate-50 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-medium text-slate-700">
                            {comment.user?.name}
                          </span>
                          <span className="text-xs text-slate-400">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add comment */}
                <div className="flex gap-2">
                  <Avatar className="h-7 w-7 shrink-0">
                    <AvatarFallback className="text-xs bg-slate-200">
                      {user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 flex gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleAddComment();
                        }
                      }}
                      className="text-sm"
                    />
                    <Button
                      size="icon"
                      onClick={handleAddComment}
                      disabled={!comment.trim() || addCommentMutation.isPending}
                    >
                      {addCommentMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Delete task */}
              <div className="pt-2 border-t border-slate-100">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={() => deleteTaskMutation.mutate()}
                  disabled={deleteTaskMutation.isPending}
                >
                  {deleteTaskMutation.isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  Delete Task
                </Button>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
