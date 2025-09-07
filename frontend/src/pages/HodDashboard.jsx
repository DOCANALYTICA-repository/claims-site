import { useEffect, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom'; // <-- IMPORT RouterLink
import {
  Box,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Button,
  Stack,
  Skeleton,
  Link, // <-- IMPORT Chakra's Link
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';
import formService from '../services/formService.js';

function HodDashboard() {
  const { user } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllForms = async () => {
    try {
      if (user && user.token) {
        const data = await formService.getAllForms();
        setForms(data);
      }
    } catch (error) {
      console.error('Failed to fetch forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllForms();
  }, [user]);

  const handleStatusUpdate = async (formId, newStatus) => {
    try {
      await formService.updateFormStatus(formId, { status: newStatus });
      fetchAllForms();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  if (isLoading) {
    return (
      <Stack>
        <Skeleton height="40px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
      </Stack>
    );
  }

  return (
    <Box>
      <Heading as="h1" size="lg" mb={8}>HOD Dashboard</Heading>
      {forms && forms.length > 0 ? (
        <Table variant="striped" colorScheme="brand">
          <Thead>
            <Tr>
              <Th>Student</Th>
              <Th>Form Type</Th>
              <Th>Status</Th>
              <Th>Submitted</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {forms.map((form) => (
              <Tr key={form._id}>
                <Td>
                  {/* Make the name a clickable link */}
                  <Link as={RouterLink} to={`/form/${form._id}`} fontWeight="bold">
                    {form.submittedBy ? form.submittedBy.name : 'N/A'}
                  </Link>
                </Td>
                <Td>{form.formType}</Td>
                <Td>
                  <Badge colorScheme={form.status === 'Approved' ? 'green' : form.status === 'Rejected' ? 'red' : 'gray'}>
                    {form.status}
                  </Badge>
                </Td>
                <Td>{new Date(form.createdAt).toLocaleString()}</Td>
                <Td>
                  {form.status.startsWith('Pending') && ( // Show buttons for any pending status
                    <>
                      <Button size="sm" colorScheme="green" onClick={() => handleStatusUpdate(form._id, 'Approved')}>Approve</Button>
                      <Button size="sm" colorScheme="red" ml={2} onClick={() => handleStatusUpdate(form._id, 'Rejected')}>Reject</Button>
                    </>
                  )}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>No forms have been submitted yet.</Text>
      )}
    </Box>
  );
}

export default HodDashboard;