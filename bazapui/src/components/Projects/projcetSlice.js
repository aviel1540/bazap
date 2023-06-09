import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
export const fetchProjects = createAsyncThunk('project/fetchProjects', async () => {
  // try {
  //const response = await axios.get('/api/projects'); // Replace with your API endpoint
  return [];
  // } 
  // catch (error) {
  //   // Handle error
  //   console.error('Error fetching projects:', error);
  //   throw error;
  // }
});

const initialState = {
  projects: [],
  projectName: '',
  unit: '',
  startDate: '',
};

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    addProject: (state, action) => {
      const project = {
        id: "id" + Math.random().toString(16).slice(2),
        totaldefectives: 0,
        categories: [],
        devices:[],
        totalFixed: 0,
        totalDevices: 10,
        totalWaiting: 5,
        totalInWork: 5,
        totalFinished: 0,
        TotalOut: 0,
        ...action.payload,
      };
      state.projects.push(project);
    },
    updateProject: (state, action) => {
      const { id } = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === id);

      if (projectIndex !== -1) {
        state.projects[projectIndex] = { ...state.projects[projectIndex], ...action.payload };
      }
    },
    updateCategories: (state, action) => {
      const { id, categories } = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === id);

      if (projectIndex !== -1) {
        state.projects[projectIndex] = {
          ...state.projects[projectIndex],
          categories: [...categories] // Replace existing categories with the new array
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.projects = action.payload;
    });
  },
});

export const { addProject, updateProject,updateCategories } = projectSlice.actions;

export default projectSlice.reducer;
