"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { projectService } from "@/services/projectService";
import { taskService } from "@/services/taskService";
import { Button } from "@/components/ui/button";

import TaskCard from "@/components/task/TaskCard";
import Link from "next/link";
import { Plus, ArrowLeft, Calendar, Loader2 } from "lucide-react";
import TaskDetailDialog from "@/components/task/TaskDetailDialog";
import CreateTaskDialog from "@/components/task/CreateTaskDialog";

const columns = [
  { key: "todo", label: "To Do", color: "bg-slate-200" },
  { key: "in_progress", label: "In Progress", color: "bg-blue-200" },
  { key: "completed", label: "Completed", color: "bg-green-200" },
];

export default function ProjectPage() {
  const { id, projectId } = useParams();
  const workspaceId = parseInt(id as string);
  const projId = parseInt(projectId as string);
  const queryClient = useQueryClient();

  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [createTaskStatus, setCreateTaskStatus] = useState("todo");
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);

  // Fetch project details and tasks
  const { data: projectData, isLoading: projectLoading } = useQuery({
    queryKey: ["project", projId],
    queryFn: () => projectService.getById(projId),
  });

  // Fetch tasks for the project
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ["tasks", projId],
    queryFn: () => taskService.getByProject(projId),
  });

  // Mutation to update task status when moving between columns
  const updateTaskMutation = useMutation({
    mutationFn: ({ taskId, status }: { taskId: number; status: string }) =>
      taskService.update(taskId, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks", projId] });
    },
  });

  const project = projectData?.data;
  const kanban = tasksData?.kanban || {
    todo: [],
    in_progress: [],
    completed: [],
  };

  const handleAddTask = (status: string) => {
    setCreateTaskStatus(status);
    setCreateTaskOpen(true);
  };

  const handleMoveTask = (taskId: number, newStatus: string) => {
    updateTaskMutation.mutate({ taskId, status: newStatus });
  };

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/workspace/${workspaceId}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back
            </Button>
          </Link>

          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
              style={{ backgroundColor: project?.color || "#6366f1" }}
            >
              {project?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                {project?.name}
              </h1>
              {project?.deadline && (
                <div className="flex items-center gap-1 text-xs text-slate-400">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Due {new Date(project.deadline).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Button onClick={() => handleAddTask("todo")}>
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      {/* Task counts */}
      <div className="flex items-center gap-4">
        {columns.map((col) => (
          <div key={col.key} className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${col.color}`} />
            <span className="text-sm text-slate-500">
              {col.label}:{" "}
              <span className="font-medium text-slate-700">
                {kanban[col.key as keyof typeof kanban]?.length || 0}
              </span>
            </span>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      {tasksLoading ? (
        <div className="flex gap-4 flex-1">
          {columns.map((col) => (
            <div
              key={col.key}
              className="flex-1 bg-slate-100 rounded-xl animate-pulse h-64"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 flex-1 overflow-x-auto pb-4">
          {columns.map((col) => {
            const columnTasks = kanban[col.key as keyof typeof kanban] || [];
            return (
              <div
                key={col.key}
                className="flex-1 min-w-72 flex flex-col bg-slate-50 rounded-xl p-3"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${col.color}`} />
                    <span className="font-semibold text-sm text-slate-700">
                      {col.label}
                    </span>
                    <span className="text-xs bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded-full">
                      {columnTasks.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => handleAddTask(col.key)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Tasks */}
                <div className="flex flex-col gap-2 flex-1">
                  {columnTasks.map((task: any) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onMove={handleMoveTask}
                      onClick={() => setSelectedTaskId(task.id)}
                      columns={columns}
                    />
                  ))}

                  {/* Empty state */}
                  {columnTasks.length === 0 && (
                    <div
                      className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-slate-300 transition-colors"
                      onClick={() => handleAddTask(col.key)}
                    >
                      <Plus className="h-5 w-5 text-slate-300 mb-1" />
                      <p className="text-xs text-slate-400">Add task</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <CreateTaskDialog
        open={createTaskOpen}
        onClose={() => setCreateTaskOpen(false)}
        projectId={projId}
        defaultStatus={createTaskStatus}
      />

      {selectedTaskId && (
        <TaskDetailDialog
          taskId={selectedTaskId}
          onClose={() => setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}
