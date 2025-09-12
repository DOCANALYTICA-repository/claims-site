import { useEffect, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  Stack,
  Skeleton,
  Button,
  HStack,
  Link,
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';
import formService from '../services/formService.js';

function StudentDashboard() {
  const { user } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchForms = async () => {
      // Safety check to ensure user and token exist before fetching
      if (user && user.token) {
        try {
          const data = await formService.getUserForms();
          setForms(data);
        } catch (error) {
          console.error('Failed to fetch forms:', error);
        } finally {
          // This will run whether the fetch succeeded or failed
          setIsLoading(false);
        }
      }
    };

    fetchForms();
  }, [user]); // Dependency array is correct

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
      {/* Added optional chaining `?` as a safety check */}
      <Heading as="h1" size="lg" mb={4}>Welcome, {user?.name}</Heading>
      
      <HStack spacing={4} mb={8}>
        <Button as={RouterLink} to="/create-form" colorScheme="blue">
          Create New Blue Form
        </Button>
        <Button as={RouterLink} to="/pink-form" colorScheme="pink">
          Submit Pink Form
        </Button>
      </HStack>

      <Heading as="h2" size="md" mt={8} mb={4}>
        Your Submitted Forms
      </Heading>

      {forms && forms.length > 0 ? (
        <Table variant="striped" colorScheme="brand">
          <Thead>
            <Tr>
              <Th>App #</Th>
              <Th>Form Type</Th>
              <Th>Status</Th>
              <Th>Submitted On</Th>
              <Th>Actions / Reason</Th>
            </Tr>
          </Thead>
          <Tbody>
            {forms.map((form) => (
              <Tr key={form._id}>
                <Td>{form.applicationNumber}</Td>
                <Td>
                  <Link as={RouterLink} to={`/form/${form._id}`} fontWeight="bold">
                    {form.formType}
                  </Link>
                </Td>
                <Td>
                  <Badge colorScheme={form.status === 'Approved' ? 'green' : form.status === 'Rejected' ? 'red' : 'yellow'}>
                    {form.status}
                  </Badge>
                </Td>
                <Td>{new Date(form.createdAt).toLocaleDateString()}</Td>
                <Td>
                  {form.status === 'Rejected - Resubmit' ? (
                    <>
                      <Text color="red.500" fontSize="sm">{form.rejectionReason}</Text>
                      <Button as={RouterLink} to={`/re-apply/${form._id}`} size="xs" mt={2} colorScheme="orange">Re-apply</Button>
                    </>
                  ) : (
                    <Badge colorScheme={...}>{form.status}</Badge>
                  )}
                </Td>
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