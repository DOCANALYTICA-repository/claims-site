import axios from 'axios';

const API_URL = 'http://localhost:5001/api/forms/';

// Create new form
const createForm = async (formData, token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await axios.post(API_URL, formData, config);
  return response.data;
};

// Get a single user's forms
const getUserForms = async (token) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // THE FIX: Ensure the unique timestamp is here
  const response = await axios.get(API_URL + `?timestamp=${new Date().getTime()}`, config);

  return response.data;
};

// Get all forms (for admin)
const getAllForms = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'all', config);
  return response.data;
};

// Update form status (for admin)
const updateFormStatus = async (formId, statusData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(API_URL + `${formId}/status`, statusData, config);
  return response.data;
};

const getTeacherApprovalForms = async (token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.get(API_URL + 'approvals/teacher', config);
  return response.data;
};

const teacherApproveForm = async (formId, statusData, token) => {
  const config = { headers: { Authorization: `Bearer ${token}` } };
  const response = await axios.put(API_URL + `${formId}/teacher-approve`, statusData, config);
  return response.data;
};

const formService = {
  createForm,
  getUserForms,
  getAllForms,
  updateFormStatus,
  getTeacherApprovalForms,
  teacherApproveForm,
};

export default formService;