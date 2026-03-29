import api from "@/lib/api";

// Workspace service: handles all API calls related to workspaces
export const workspaceService = {
  // Get all workspaces for the current user
  getAll: async () => {
    // Send GET request
    const response = await api.get("/api/workspaces");

    // Return list of workspaces
    return response.data;
  },

  // Get a single workspace by ID
  getById: async (id: number) => {
    // Send GET request with workspace ID
    const response = await api.get(`/api/workspaces/${id}`);

    // Return workspace details
    return response.data;
  },

  // Create a new workspace
  create: async (data: {
    name: string;
    description?: string;
    color?: string;
  }) => {
    // Send POST request with workspace data
    const response = await api.post("/api/workspaces", data);

    // Return created workspace
    return response.data;
  },

  // Update an existing workspace
  update: async (
    id: number,
    data: {
      name?: string;
      description?: string;
      color?: string;
    },
  ) => {
    // Send PUT request with updated fields
    const response = await api.put(`/api/workspaces/${id}`, data);

    // Return updated workspace
    return response.data;
  },

  // Delete a workspace by ID
  delete: async (id: number) => {
    // Send DELETE request
    const response = await api.delete(`/api/workspaces/${id}`);

    // Return confirmation / result
    return response.data;
  },

  // Add a member to a workspace
  addMember: async (
    workspaceId: number,
    data: {
      email: string; // email of the user to invite
      role?: string; 
    },
  ) => {
    // Send POST request to add/invite member
    const response = await api.post(
      `/api/workspaces/${workspaceId}/members`,
      data,
    );

    // Return updated workspace or membership info
    return response.data;
  },
};
