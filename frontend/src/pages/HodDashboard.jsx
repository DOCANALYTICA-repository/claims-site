import { useEffect, useState, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box, Heading, Text, Table, Thead, Tbody, Tr, Th, Td, Badge, Button, Stack, Skeleton, Link, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Textarea, useDisclosure, useToast
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';
import formService from '../services/formService.js';

function HodDashboard() {
  const { user } = useContext(AuthContext);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedFormId, setSelectedFormId] = useState(null);

  const fetchAllForms = async () => {
    setIsLoading(true);
    try {
      if (user) {
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

  const handleApprove = async (formId) => {
    try {
      // Use the general updateFormStatus for HOD approval
      await formService.updateFormStatus(formId, { status: 'Approved' });
      toast({ title: 'Form Approved.', status: 'success' });
      fetchAllForms();
    } catch (error) {
      toast({ title: 'Update Failed.', description: error.message, status: 'error' });
    }
  };

  const handleRejectClick = (formId) => {
    setSelectedFormId(formId);
    onOpen();
  };

  const submitRejection = async () => {
    if (!rejectionReason) {
      toast({ title: 'Please provide a reason for rejection.', status: 'warning' });
      return;
    }
    try {
      // Use the general updateFormStatus for HOD rejection
      await formService.updateFormStatus(selectedFormId, { status: 'Rejected - Resubmit', reason: rejectionReason });
      toast({ title: 'Form Rejected.', status: 'success' });
      onClose();
      setRejectionReason('');
      fetchAllForms();
    } catch (error) {
      toast({ title: 'Update Failed.', description: error.message, status: 'error' });
    }
  };

  if (isLoading) {
    return ( <Stack><Skeleton height="40px" /><Skeleton height="40px" /><Skeleton height="40px" /></Stack> );
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
                  <Link as={RouterLink} to={`/form/${form._id}`} fontWeight="bold">
                    {form.submittedBy ? form.submittedBy.name : 'N/A'}
                  </Link>
                </Td>
                <Td>{form.formType}</Td>
                <Td>
                  <Badge colorScheme={form.status === 'Approved' ? 'green' : form.status.includes('Rejected') ? 'red' : 'yellow'}>
                    {form.status}
                  </Badge>
                </Td>
                <Td>{new Date(form.createdAt).toLocaleString()}</Td>
                <Td>
                  {form.status.includes('Pending') && (
                    <>
                      <Button size="sm" colorScheme="green" onClick={() => handleApprove(form._id)}>Approve</Button>
                      <Button size="sm" colorScheme="red" ml={2} onClick={() => handleRejectClick(form._id)}>Reject</Button>
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

      {/* Rejection Reason Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Reason for Rejection</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Textarea placeholder="Please provide a clear reason for rejecting this claim..." value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)} />
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

export default HodDashboard;