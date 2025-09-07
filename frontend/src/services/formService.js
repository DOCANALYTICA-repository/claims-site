import api from './api';

const API_URL = '/forms/';

// All functions are now simpler - no need to pass the token!
const createForm = async (formData) => {
  const response = await api.post(API_URL, formData);
  return response.data;
};

const getUserForms = async () => {
  const response = await api.get(API_URL + `?timestamp=${new Date().getTime()}`);
  return response.data;
};

const getAllForms = async () => {
  const response = await api.get(API_URL + 'all');
  return response.data;
};

const updateFormStatus = async (formId, statusData) => {
  const response = await api.put(API_URL + `${formId}/status`, statusData);
  return response.data;
};

const getFormById = async (formId) => {
  const response = await api.get(API_URL + formId);
  return response.data;
};

const getTeacherApprovalForms = async () => {
  const response = await api.get(API_URL + 'approvals/teacher');
  return response.data;
};

const teacherApproveForm = async (formId, statusData) => {
  const response = await api.put(API_URL + `${formId}/teacher-approve`, statusData);
  return response.data;
};

const formService = {
  createForm,
  getUserForms,
  getAllForms,
  updateFormStatus,
  getFormById,
  getTeacherApprovalForms,
  teacherApproveForm,
};

export default formService;