import { useEffect, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, Stack, Skeleton, Button, HStack } from '@chakra-ui/react';
import AuthContext from '../context/AuthContext';
import formService from '../services/formService';

function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      if (user && user.token) {
        try {
          const data = await formService.getUserForms(user.token);
          setForms(data);
        } catch (error) {
          console.error('Failed to fetch forms:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchForms();
  }, [user]);

  if (isLoading) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="40px" />
        <Skeleton height="40px" />
      </Stack>
    );
  }

  return (
    <Box>
      <Heading as="h1" size="lg" mb={4}>Welcome, {user.name}</Heading>

      <HStack spacing={4} mb={8}>
        <Button as={RouterLink} to="/create-form" colorScheme="blue">
          Create New Blue Form
        </Button>
        <Button as={RouterLink} to="/pink-form" colorScheme="pink">
          Submit Pink Form
        </Button>
      </HStack>

      <Heading as="h2" size="md" mb={4}>
        Your Submitted Forms
      </Heading>

      {forms && forms.length > 0 ? (
        <Table variant="striped" colorScheme="brand">
          <Thead>
            <Tr>
              <Th>Form Type</Th>
              <Th>Status</Th>
              <Th>Submitted On</Th>
            </Tr>
          </Thead>
          <Tbody>
            {forms.map((form) => (
              <Tr key={form._id}>
                <Td>{form.formType}</Td>
                <Td>
                  <Badge colorScheme={form.status === 'Approved' ? 'green' : form.status === 'Rejected' ? 'red' : 'yellow'}>
                    {form.status}
                  </Badge>
                </Td>
                <Td>{new Date(form.createdAt).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>You have not submitted any forms yet.</Text>
      )}
    </Box>
  );
}

export default StudentDashboard;