"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Calendar, MoreHorizontal, ArrowRight } from "lucide-react";

const priorityStyles: Record<string, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

const priorityDots: Record<string, string> = {
  low: "bg-slate-400",
  medium: "bg-yellow-400",
  high: "bg-red-400",
};

interface Column {
  key: string;
  label: string;
  color: string;
}

interface Task {
  id: number;
  title: string;
  description?: string;
  priority: string;
  status: string;
  dueDate?: string;
  assignee?: {
    id: number;
    name: string;
    avatar?: string;
  };
}

interface Props {
  task: Task;
  onMove: (taskId: number, status: string) => void;
  onClick: () => void;
  columns: Column[];
}

export default function TaskCard({ task, onMove, onClick, columns }: Props) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

  return (
    <div
      className="bg-white rounded-lg border border-slate-200 p-3 hover:shadow-sm transition-shadow cursor-pointer group"
      onClick={onClick}
    >
      {/* Priority indicator */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2 h-2 rounded-full shrink-0 ${priorityDots[task.priority]}`}
          />
          <span className="text-xs text-slate-500 capitalize">
            {task.priority}
          </span>
        </div>

        {/* Move task dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Move to</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns
              .filter((col) => col.key !== task.status)
              .map((col) => (
                <DropdownMenuItem
                  key={col.key}
                  onClick={(e) => {
                    e.stopPropagation();
                    onMove(task.id, col.key);
                  }}
                  className="flex items-center gap-2"
                >
                  <ArrowRight className="h-3 w-3" />
                  {col.label}
                </DropdownMenuItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Title */}
      <p className="text-sm font-medium text-slate-900 mb-2 line-clamp-2">
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p className="text-xs text-slate-500 mb-2 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-2">
        {task.dueDate && (
          <div
            className={`flex items-center gap-1 text-xs ${
              isOverdue ? "text-red-500" : "text-slate-400"
            }`}
          >
            <Calendar className="h-3 w-3" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}

        {task.assignee && (
          <Avatar className="h-5 w-5 ml-auto">
            <AvatarFallback className="text-xs bg-slate-200">
              {task.assignee.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        )}
      </div>
    </div>
  );
}
