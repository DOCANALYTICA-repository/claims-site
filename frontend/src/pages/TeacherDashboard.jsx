import { useEffect, useState, useContext } from 'react';
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Button, Stack, Skeleton, useToast } from '@chakra-ui/react';
import AuthContext from '../context/AuthContext';
import formService from '../services/formService';

function TeacherDashboard() {
  const { user } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  const fetchTeacherForms = async () => {
    setIsLoading(true);
    try {
      const data = await formService.getTeacherApprovalForms(user.token);
      setForms(data);
    } catch (error) {
      console.error('Failed to fetch forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchTeacherForms();
    }
  }, [user]);

  // NEW: Handler for approve/reject buttons
  const handleStatusUpdate = async (formId, newStatus) => {
    try {
      await formService.teacherApproveForm(formId, { status: newStatus }, user.token);
      toast({
        title: `Form ${newStatus}.`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      // Refresh the list after updating
      fetchTeacherForms();
    } catch (error) {
      toast({
        title: 'Update Failed.',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  if (isLoading) {
    return ( <Stack><Skeleton height='40px' /><Skeleton height='40px' /><Skeleton height='40px' /></Stack> );
  }

  return (
    <Box>
      <Heading as="h1" size="lg" mb={4}>Teacher Approval Queue</Heading>
      {forms && forms.length > 0 ? (
        <Table variant='striped' colorScheme='brand'>
          <Thead>
            <Tr><Th>Student</Th><Th>Form Type</Th><Th>Submitted</Th><Th>Actions</Th></Tr>
          </Thead>
          <Tbody>
            {forms.map((form) => (
              <Tr key={form._id}>
                <Td>
                  <Link as={RouterLink} to={`/form/${form._id}`}>{form.formType}</Link>
                </Td>
                <Td>{form.submittedBy ? form.submittedBy.name : 'N/A'}</Td>
                <Td>{form.formType}</Td>
                <Td>{new Date(form.createdAt).toLocaleString()}</Td>
                <Td>
                  <Button size="sm" colorScheme="green" onClick={() => handleStatusUpdate(form._id, 'Approved')}>Approve</Button>
                  <Button size="sm" colorScheme="red" ml={2} onClick={() => handleStatusUpdate(form._id, 'Rejected')}>Reject</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>You have no forms waiting for your approval.</Text>
      )}
    </Box>
  );
}

export default TeacherDashboard;