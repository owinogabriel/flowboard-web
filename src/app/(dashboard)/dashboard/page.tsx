'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/context/AuthContext'
import { workspaceService } from '@/services/workspaceService'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CreateWorkspaceDialog from '@/components/workspace/CreateWorkspaceDialog'
import Link from 'next/link'
import {
  Plus,
  FolderKanban,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react'

export default function DashboardPage() {
  const { user } = useAuth()
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false)
 
  // Fetch workspaces for the current user
  const { data: workspacesData, isLoading } = useQuery({
    queryKey: ['workspaces'],
    queryFn: workspaceService.getAll,
  })

  const workspaces = workspacesData?.data || []

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 sm:space-y-8">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {greeting()}, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-slate-500 mt-1 text-sm sm:text-base">
            Here's what's happening across your workspaces
          </p>
        </div>
        <Button onClick={() => setCreateWorkspaceOpen(true)} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          New Workspace
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <Card>
          <CardContent className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 p-4 sm:p-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-indigo-100 rounded-xl flex items-center justify-center shrink-0">
              <FolderKanban className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-600" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-bold text-slate-900">{workspaces.length}</p>
              <p className="text-xs sm:text-sm text-slate-500">Workspaces</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 p-4 sm:p-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-amber-600" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-bold text-slate-900">0</p>
              <p className="text-xs sm:text-sm text-slate-500">In Progress</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col sm:flex-row items-center sm:items-center gap-2 sm:gap-4 p-4 sm:p-6">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-xl sm:text-2xl font-bold text-slate-900">0</p>
              <p className="text-xs sm:text-sm text-slate-500">Completed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Workspaces */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-slate-900">Your Workspaces</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCreateWorkspaceOpen(true)}
          >
            <Plus className="mr-1 h-4 w-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : workspaces.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-10 sm:py-12 text-center px-4">
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
                <FolderKanban className="h-7 w-7 sm:h-8 sm:w-8 text-slate-400" />
              </div>
              <h3 className="font-semibold text-slate-900 mb-2">No workspaces yet</h3>
              <p className="text-slate-500 text-sm mb-4 max-w-xs">
                Create your first workspace to start organizing projects with your team
              </p>
              <Button onClick={() => setCreateWorkspaceOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workspaces.map((workspace: any) => (
              <Link key={workspace.id} href={`/workspace/${workspace.id}`}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="p-4 sm:p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm"
                        style={{ backgroundColor: workspace.color || '#6366f1' }}
                      >
                        {workspace.name.charAt(0).toUpperCase()}
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {workspace.role}
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-slate-900 mb-1 truncate text-sm sm:text-base">
                      {workspace.name}
                    </h3>
                    {workspace.description && (
                      <p className="text-sm text-slate-500 line-clamp-2 mb-3">
                        {workspace.description}
                      </p>
                    )}
                    <div className="flex items-center gap-1 text-slate-400 text-xs mt-auto">
                      <ArrowRight className="h-3 w-3" />
                      <span>View workspace</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {/* Create new card */}
            <Card
              className="border-dashed cursor-pointer hover:border-slate-400 transition-colors"
              onClick={() => setCreateWorkspaceOpen(true)}
            >
              <CardContent className="flex flex-col items-center justify-center py-8 text-center h-full">
                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-3">
                  <Plus className="h-5 w-5 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">New Workspace</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <CreateWorkspaceDialog
        open={createWorkspaceOpen}
        onClose={() => setCreateWorkspaceOpen(false)}
      />
    </div>
  )
}