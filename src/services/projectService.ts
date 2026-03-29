import api from "@/lib/api";

// Project service: handles all API calls related to projects
export const projectService = {
  // Get all projects that belong to a specific workspace
  getByWorkspace: async (workspaceId: number) => {
    // Send GET request with workspace ID
    const response = await api.get(`/api/projects/workspace/${workspaceId}`);

    // Return only the response data
    return response.data;
  },

  // Get a single project by its ID
  getById: async (id: number) => {
    // Send GET request with project ID
    const response = await api.get(`/api/projects/${id}`);

    // Return project details
    return response.data;
  },

  // Create a new project inside a workspace
  create: async (
    workspaceId: number,
    data: {
      name: string;
      description?: string;
      color?: string;
      deadline?: string;
    },
  ) => {
    // Send POST request with project data
    const response = await api.post(
      `/api/projects/workspace/${workspaceId}`,
      data,
    );

    // Return created project
    return response.data;
  },

  // Update an existing project
  update: async (
    id: number,
    data: {
      name?: string;
      description?: string;
      color?: string;
      deadline?: string;
    },
  ) => {
    // Send PUT request with updated fields (partial update allowed)
    const response = await api.put(`/api/projects/${id}`, data);

    // Return updated project
    return response.data;
  },

  // Delete a project by ID
  delete: async (id: number) => {
    // Send DELETE request
    const response = await api.delete(`/api/projects/${id}`);

    // Return confirmation / result
    return response.data;
  },
};
