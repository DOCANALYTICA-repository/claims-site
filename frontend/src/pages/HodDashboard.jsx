import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import formService from '../services/formService';
import { Link } from 'react-router-dom';
import { Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Stack, Skeleton } from '@chakra-ui/react';

function HodDashboard() {
  const { user } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAllForms = async () => {
    try {
      const data = await formService.getAllForms(user.token);
      setForms(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch forms:', error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.token) {
      fetchAllForms();
    }
  }, [user]);

  const handleStatusUpdate = async (formId, newStatus) => {
    try {
      await formService.updateFormStatus(formId, { status: newStatus }, user.token);
      fetchAllForms();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  // The Skeleton Loader UI
  if (isLoading) {
    return (
      <Stack>
        <Skeleton height='40px' />
        <Skeleton height='40px' />
        <Skeleton height='40px' />
      </Stack>
    );
  }

  // The final UI with a styled table and badges
  return (
    <div>
      {/* ... Heading and Link */}
      {forms && forms.length > 0 ? (
        <Table variant='striped' colorScheme='brand'>
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
                  <Link as={RouterLink} to={`/form/${form._id}`}>{form.formType}</Link>
                </Td>
                <Td>{form.submittedBy ? form.submittedBy.name : 'N/A'}</Td>
                <Td>{form.formType}</Td>
                <Td>
                  <Badge colorScheme={form.status === 'Approved' ? 'green' : form.status === 'Rejected' ? 'red' : 'yellow'}>
                    {form.status}
                  </Badge>
                </Td>
                <Td>{new Date(form.createdAt).toLocaleString()}</Td>
                <Td>
                  {form.status === 'Pending' && (
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
        <p>No forms have been submitted yet.</p>
      )}
    </div>
  );
}

export default HodDashboard;