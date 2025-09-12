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
  Button,
  Stack,
  Skeleton,
  Link,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Textarea,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';
import formService from '../services/formService.js';

function TeacherDashboard() {
  const { user } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure(); // Hook for the modal

  // State for handling the rejection reason
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedFormId, setSelectedFormId] = useState(null);

  const fetchTeacherForms = async () => {
    setIsLoading(true);
    try {
      const data = await formService.getTeacherApprovalForms();
      setForms(data);
    } catch (error) {
      console.error('Failed to fetch forms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTeacherForms();
    }
  }, [user]);

  const handleApprove = async (formId) => {
    try {
      await formService.teacherApproveForm(formId, { status: 'Approved' });
      toast({ title: 'Form Approved.', status: 'success' });
      fetchTeacherForms(); // Refresh the list
    } catch (error) {
      toast({ title: 'Update Failed.', description: error.message, status: 'error' });
    }
  };

  const handleRejectClick = (formId) => {
    setSelectedFormId(formId);
    onOpen(); // Open the rejection reason modal
  };

  const submitRejection = async () => {
    if (!rejectionReason) {
      toast({ title: 'Please provide a reason for rejection.', status: 'warning' });
      return;
    }
    try {
      await formService.teacherApproveForm(selectedFormId, { status: 'Rejected', reason: rejectionReason });
      toast({ title: 'Form Rejected.', status: 'success' });
      onClose(); // Close the modal
      setRejectionReason('');
      fetchTeacherForms(); // Refresh the list
    } catch (error) {
      toast({ title: 'Update Failed.', description: error.message, status: 'error' });
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
      <Heading as="h1" size="lg" mb={8}>Teacher Approval Queue</Heading>
      {forms && forms.length > 0 ? (
        <Table variant="striped" colorScheme="brand">
          <Thead>
            <Tr>
              <Th>Student</Th>
              <Th>Form Type</Th>
              <Th>Submitted</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {forms.map((form) => (
              <Tr key={form._id}>
                <Td>
                  <Link as={RouterLink} to={`/form/${form._id}`} fontWeight="bold">
                    {form.submittedBy ? form.submittedBy.name : 'N/A'}
                  </Link>
                </Td>
                <Td>{form.formType}</Td>
                <Td>{new Date(form.createdAt).toLocaleString()}</Td>
                <Td>
                  <Button size="sm" colorScheme="green" onClick={() => handleApprove(form._id)}>Approve</Button>
                  <Button size="sm" colorScheme="red" ml={2} onClick={() => handleRejectClick(form._id)}>Reject</Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Text>You have no forms waiting for your approval.</Text>
      )}

      {/* Rejection Reason Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reason for Rejection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea
              placeholder="Please provide a clear reason for rejecting this claim..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" mr={3} onClick={submitRejection}>Submit Rejection</Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}

export default TeacherDashboard;