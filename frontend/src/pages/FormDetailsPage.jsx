import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Heading, Text, Spinner } from '@chakra-ui/react';
import AuthContext from '../context/AuthContext';
import formService from '../services/formService';

function FormDetailsPage() {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // Gets the form ID from the URL
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const data = await formService.getFormById(id, user.token);
        setForm(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchForm();
  }, [id, user.token]);

  if (isLoading) {
    return <Spinner />;
  }

  if (!form) {
    return <Heading>Form not found.</Heading>;
  }

  return (
    <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
      <Heading mb={4}>Form Details</Heading>
      <Text><strong>Application #:</strong> {form.applicationNumber}</Text>
      <Text><strong>Status:</strong> {form.status}</Text>
      <Text><strong>Submitted By:</strong> {form.submittedBy.name}</Text>
      <Text><strong>Form Type:</strong> {form.formType}</Text>
      {/* Displaying formData requires careful formatting */}
      <pre>{JSON.stringify(form.formData, null, 2)}</pre>
    </Box>
  );
}

export default FormDetailsPage;