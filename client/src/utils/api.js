/**
 * API utility functions for communicating with the backend
 * 
 * In production on Catalyst:
 * - Frontend is deployed to Slate (e.g., https://app-name.onslate.in)
 * - Backend is deployed to AppSail (e.g., https://app-name-appsail.onslate.in)
 * - CORS must be configured in Catalyst Console
 * 
 * In development:
 * - Use Vite proxy to forward /api requests to localhost:3000
 */

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://hospital-queue-api-50044499616.development.catalystappsail.in'
  : '/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for Catalyst auth cookies
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.error || `HTTP error! status: ${response.status}`);
  }
  
  return data;
}

// Patients API
export const patientsApi = {
  getAll: (userId) => apiFetch(`/patients${userId ? `?userId=${userId}` : ''}`),
  getById: (id) => apiFetch(`/patients/${id}`),
  create: (patientData) => apiFetch('/patients', {
    method: 'POST',
    body: JSON.stringify(patientData),
  }),
  update: (id, patientData) => apiFetch(`/patients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(patientData),
  }),
};

// Doctors API
export const doctorsApi = {
  getAll: () => apiFetch('/doctors'),
  getById: (id) => apiFetch(`/doctors/${id}`),
  create: (doctorData) => apiFetch('/doctors', {
    method: 'POST',
    body: JSON.stringify(doctorData),
  }),
  update: (id, doctorData) => apiFetch(`/doctors/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(doctorData),
  }),
};

// Visits API
export const visitsApi = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.doctorId) params.append('doctorId', filters.doctorId);
    if (filters.patientId) params.append('patientId', filters.patientId);
    if (filters.status) params.append('status', filters.status);
    return apiFetch(`/visits?${params.toString()}`);
  },
  getById: (id) => apiFetch(`/visits/${id}`),
  getDoctorQueue: (doctorId) => apiFetch(`/visits/queue/${doctorId}`),
  create: (visitData) => apiFetch('/visits', {
    method: 'POST',
    body: JSON.stringify(visitData),
  }),
  update: (id, visitData) => apiFetch(`/visits/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(visitData),
  }),
};

// Analytics API
export const analyticsApi = {
  getStats: () => apiFetch('/analytics'),
};
