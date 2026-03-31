"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { taskService } from "@/services/taskService";
import { Loader2 } from "lucide-react";

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
  projectId: number;
  defaultStatus: string;
}

export default function CreateTaskDialog({
  open,
  onClose,
  projectId,
  defaultStatus,
}: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      priority: "medium" as const,
    },
  }); // Set default priority to medium

  // Update the mutation to handle task creation
  const createMutation = useMutation({
    mutationFn: (data: FormData) =>
      taskService.create(projectId, {
        ...data, // Spread the form data (title, description, priority, dueDate)
        status: defaultStatus, // Set the status based on the column where the task is being created
        dueDate: data.dueDate
          ? new Date(data.dueDate).toISOString()
          : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projectId] });
      toast({ title: "Task created!" });
      reset();
      onClose();
    },
    onError: (error: any) => {
      toast({
        title: "Failed to create task",
        description: error.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Adding to{" "}
            <span className="font-medium capitalize">
              {defaultStatus.replace("_", " ")}
            </span>
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit((data) => createMutation.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Title</Label>
            <Input placeholder="Design the homepage" {...register("title")} />
            {errors.title && (
              <p className="text-xs text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description (optional)</Label>
            <Input
              placeholder="Add more details..."
              {...register("description")}
            />
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <select
              {...register("priority")}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Due Date (optional)</Label>
            <Input type="date" {...register("dueDate")} />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                </>
              ) : (
                "Create Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
