import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
  res => res,
  err => {
    const message = err.response?.data?.error || err.response?.data?.message || err.message;
    return Promise.reject(new Error(message));
  }
);

// Components
export const getComponents = () => api.get('/components').then(r => r.data);
export const getDeletedComponents = () => api.get('/components/deleted').then(r => r.data);
export const getComponent = id => api.get(`/components/${id}`).then(r => r.data);
export const createComponent = data => api.post('/components', data).then(r => r.data);
export const updateComponent = (id, data) => api.put(`/components/${id}`, data).then(r => r.data);
export const deleteComponent = id => api.delete(`/components/${id}`);
export const restoreComponent = id => api.put(`/components/${id}/restore`).then(r => r.data);
export const executeOnRequest = (id, context) =>
  api.post(`/components/${id}/execute`, { context }).then(r => r.data);

// Pages
export const getPages = () => api.get('/pages').then(r => r.data);
export const getPage = id => api.get(`/pages/${id}`).then(r => r.data);
export const createPage = data => api.post('/pages', data).then(r => r.data);
export const updatePage = (id, data) => api.put(`/pages/${id}`, data).then(r => r.data);
export const deletePage = id => api.delete(`/pages/${id}`);

// Content Entries
export const getEntries = componentId =>
  api.get(`/components/${componentId}/entries`).then(r => r.data);
export const getEntry = (componentId, id) =>
  api.get(`/components/${componentId}/entries/${id}`).then(r => r.data);
export const createEntry = (componentId, data) =>
  api.post(`/components/${componentId}/entries`, data).then(r => r.data);
export const updateEntry = (componentId, id, data) =>
  api.put(`/components/${componentId}/entries/${id}`, data).then(r => r.data);
export const deleteEntry = (componentId, id) =>
  api.delete(`/components/${componentId}/entries/${id}`);
