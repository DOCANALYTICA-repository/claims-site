import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';
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
  const { id: formId } = useParams();

  const [parentEmail, setParentEmail] = useState('');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [reason, setReason] = useState('');
  const [document, setDocument] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [periodsMissed, setPeriodsMissed] = useState([]);

  useEffect(() => {
    if (formId) {
      const fetchOldFormData = async () => {
        try {
          const oldForm = await formService.getFormById(formId);
          setParentEmail(oldForm.formData.parentEmail);
          setLeaveFrom(oldForm.formData.leaveFrom.split('T')[0]);
          setLeaveTo(oldForm.formData.leaveTo.split('T')[0]);
          setReason(oldForm.formData.reason);
          const oldPeriods = periodOptions.filter(option => 
            oldForm.formData.periodsMissed.includes(option.value)
          );
          setPeriodsMissed(oldPeriods);
        } catch (error) {
          toast({ title: 'Could not load form data', status: 'error' });
        }
      };
      fetchOldFormData();
    }
  }, [formId, toast]);

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
    <Box as="form" onSubmit={onSubmit} p={10} borderWidth="1px" borderRadius="md" boxShadow="xl" maxW="800px" mx="auto" bg="blue.50">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center" fontFamily="serif">
          {formId ? 'Re-apply for Leave' : 'Application for Leave of Absence'}
        </Heading>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem><FormControl isRequired><FormLabel fontSize="sm">Student Name:</FormLabel><Input variant="flushed" value={user?.name || ''} isReadOnly /></FormControl></GridItem>
            <GridItem><FormControl isRequired><FormLabel fontSize="sm">Registration No:</FormLabel><Input variant="flushed" value={user?.regNo || ''} isReadOnly /></FormControl></GridItem>
            <GridItem><FormControl isRequired><FormLabel fontSize="sm">Leave From:</FormLabel><Input variant="flushed" type="date" value={leaveFrom} onChange={(e) => setLeaveFrom(e.target.value)} /></FormControl></GridItem>
            <GridItem><FormControl isRequired><FormLabel fontSize="sm">Leave To:</FormLabel><Input variant="flushed" type="date" value={leaveTo} onChange={(e) => setLeaveTo(e.target.value)} /></FormControl></GridItem>
        </Grid>

        <FormControl isRequired><FormLabel fontSize="sm">Reason for Leave:</FormLabel><Textarea variant="flushed" value={reason} onChange={(e) => setReason(e.target.value)} /></FormControl>
        <FormControl isRequired><FormLabel fontSize="sm">Parent's Email:</FormLabel><Input variant="flushed" type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} /></FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="sm">Periods Missed:</FormLabel>
          <Select
            isMulti
            name="periods"
            options={periodOptions}
            value={periodsMissed} // The state will be pre-filled on re-apply
            className="basic-multi-select"
            classNamePrefix="select"
            onChange={setPeriodsMissed}
          />
        </FormControl>

        <FormControl>
          <FormLabel fontSize="sm">Medical Certificate:</FormLabel>
          <Input type="file" p={1.5} onChange={(e) => setDocument(e.target.files[0])} />
        </FormControl>
        
        <Button
          type="submit"
          colorScheme="brand"
          isLoading={isSubmitting || uploading}
          loadingText="Submitting..."
          disabled={uploading || uploading}
          mt={6}
        >
          Submit Application
        </Button>
      </VStack>
    </Box>
  );
}

export default CreateFormPage;