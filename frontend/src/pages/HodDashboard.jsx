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
      // Use the 'updateFormStatus' endpoint, which also needs to be updated on the backend
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
      {/* ... Table and mapping logic ... */}
      <Tbody>
        {forms.map((form) => (
          <Tr key={form._id}>
            {/* ... other Td ... */}
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

      {/* ... Rejection Modal ... */}
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