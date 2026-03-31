"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { workspaceService } from "@/services/workspaceService";
import { projectService } from "@/services/projectService";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import CreateProjectDialog from "@/components/project/CreateProjectDialog";
import Link from "next/link";
import {
  Plus,
  FolderKanban,
  Users,
  Calendar,
  ArrowRight,
  Settings,
} from "lucide-react";

export default function WorkspacePage() {
  const { id } = useParams();
  const workspaceId = parseInt(id as string);
  const [createProjectOpen, setCreateProjectOpen] = useState(false);

  // Fetch workspace details
  const { data: workspaceData, isLoading: workspaceLoading } = useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => workspaceService.getById(workspaceId),
  });

  // Fetch projects for the workspace
  const { data: projectsData, isLoading: projectsLoading } = useQuery({
    queryKey: ["projects", workspaceId],
    queryFn: () => projectService.getByWorkspace(workspaceId),
  });

  // Extract workspace and projects data
  const workspace = workspaceData?.data;
  const projects = projectsData?.data || [];
  const members = workspace?.members || [];

  if (workspaceLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="h-20 bg-slate-100 rounded-xl animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 bg-slate-100 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Workspace Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shrink-0"
            style={{ backgroundColor: workspace?.color || "#6366f1" }}
          >
            {workspace?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              {workspace?.name}
            </h1>
            {workspace?.description && (
              <p className="text-slate-500 mt-1">{workspace.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex -space-x-2">
                {members.slice(0, 4).map((member: any) => (
                  <Avatar
                    key={member.id}
                    className="h-6 w-6 border-2 border-white"
                  >
                    <AvatarFallback className="text-xs bg-slate-200">
                      {/* Show first initial of member's name */}
                      {member.name?.charAt(0).toUpperCase()}{" "}
                    </AvatarFallback>
                  </Avatar>
                ))}
              </div>
              <span className="text-sm text-slate-500">
                {/* Show member count with proper pluralization */}
                {members.length} member{members.length !== 1 ? "s" : ""}{" "}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/workspace/${workspaceId}/settings`}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Link>
          </Button>
          <Button size="sm" onClick={() => setCreateProjectOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Members */}
      <div>
        <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
          Team Members
        </h2>
        <div className="flex flex-wrap gap-2">
          {members.map((member: any) => (
            <div
              key={member.id}
              className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-3 py-1.5"
            >
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs bg-slate-200">
                  {member.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm text-slate-700">{member.name}</span>
              <Badge variant="secondary" className="text-xs py-0">
                {member.role}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Projects ({projects.length})
          </h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCreateProjectOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Project
          </Button>
        </div>

        {projectsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 bg-slate-100 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <FolderKanban className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">
                No projects yet
              </h3>
              <p className="text-slate-500 text-sm mb-4 max-w-xs">
                Create your first project to start managing tasks with your team
              </p>
              <Button onClick={() => setCreateProjectOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project: any) => (
              <Link
                key={project.id}
                href={`/workspace/${workspaceId}/project/${project.id}`}
              >
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: project.color || "#6366f1" }}
                      >
                        {project.name.charAt(0).toUpperCase()}
                      </div>
                    </div>

                    <h3 className="font-semibold text-slate-900 mb-1 truncate">
                      {project.name}
                    </h3>

                    {project.description && (
                      <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                        {project.description}
                      </p>
                    )}

                    {project.deadline && (
                      <div className="flex items-center gap-1 text-xs text-slate-400 mb-3">
                        <Calendar className="h-3 w-3" />
                        <span>
                          Due {new Date(project.deadline).toLocaleDateString()}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-2">
                      <ArrowRight className="h-3 w-3" />
                      <span>Open board</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            <Card
              className="border-dashed cursor-pointer hover:border-slate-400 transition-colors"
              onClick={() => setCreateProjectOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center py-8 text-center h-full">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                  <Plus className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">
                  New Project
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <CreateProjectDialog
        open={createProjectOpen}
        onClose={() => setCreateProjectOpen(false)}
        workspaceId={workspaceId}
      />
    </div>
  );
}
