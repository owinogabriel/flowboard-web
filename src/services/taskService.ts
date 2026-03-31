import api from "@/lib/api";

// Task service: handles all API calls related to tasks
export const taskService = {
  // Get all tasks that belong to a specific project
  getByProject: async (projectId: number) => {
    const response = await api.get(`/api/tasks/project/${projectId}`);
    return response.data;
  },
  // Get a single task by its ID
  getById: async (id: number) => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },
  // Create a new task inside a project
  create: async (
    projectId: number,
    data: {
      title: string;
      description?: string;
      priority: string;
      status?: string;
      dueDate?: string;
      assigneeId?: number;
    },
  ) => {
    const response = await api.post(`/api/tasks/project/${projectId}`, data);
    return response.data;
  },
  // Update an existing task
  update: async (
    id: number,
    data: {
      title?: string;
      description?: string;
      priority?: string;
      status?: string;
      dueDate?: string;
      assigneeId?: number;
      position?: number;
    },
  ) => {
    const response = await api.put(`/api/tasks/${id}`, data);
    return response.data;
  },
  // Delete a task by ID
  delete: async (id: number) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  },
  // Add a comment to a task
  addComment: async (taskId: number, content: string) => {
    const response = await api.post(`/api/tasks/${taskId}/comments`, {
      content,
    });
    return response.data;
  },
};
