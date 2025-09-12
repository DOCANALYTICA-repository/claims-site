import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Select from 'react-select';
import {
  Box, Button, FormControl, FormLabel, Input, Textarea, VStack, Heading, Grid, GridItem, useToast
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';
import formService from '../services/formService.js';

const periodOptions = [
  { value: 'Period7_00AM', label: 'Period 7:00 AM' },
  { value: 'Period8_00AM', label: 'Period 8:00 AM' },
  { value: 'Period9_45AM', label: 'Period 9:45 AM' },
  { value: 'Period10_45AM', label: 'Period 10:45 AM' },
  { value: 'Period11_45AM', label: 'Period 11:45 AM' },
  { value: 'Period1_45PM', label: 'Period 1:45 PM' },
  { value: 'Period2_45PM', label: 'Period 2:45 PM' },
];

function CreateFormPage() {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [parentEmail, setParentEmail] = useState('');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [reason, setReason] = useState('');
  const [document, setDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [periodsMissed, setPeriodsMissed] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let documentPath = '';

    if (document) {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('document', document);
      try {
        const { data } = await api.post('/upload', uploadFormData);
        documentPath = data.path;
        setUploading(false);
      } catch (error) {
        toast({ title: 'File Upload Failed', status: 'error' });
        setUploading(false);
        setIsSubmitting(false);
        return;
      }
    }

    try {
      const newFormData = {
        formType: 'Blue',
        formData: {
          leaveFrom,
          leaveTo,
          reason,
          documentPath,
          parentEmail,
          periodsMissed: periodsMissed.map(p => p.value)
        },
      };
      await formService.createForm(newFormData);
      toast({ title: 'Form Submitted', status: 'success' });
      window.location.href = '/';
    } catch (error) {
      toast({ title: 'Submission Failed', status: 'error' });
      setIsSubmitting(false);
    }
  };

  return (
    <Box as="form" onSubmit={onSubmit} p={8} borderWidth="1px" borderRadius="md" boxShadow="xl" maxW="800px" mx="auto" bg="blue.50">
        {/* The JSX for the form remains the same as the last correct version */}
    </Box>
  );
}

export default CreateFormPage;