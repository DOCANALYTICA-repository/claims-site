import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Heading,
  Text,
  useToast,
  Grid,
  GridItem,
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext';
import formService from '../services/formService';

function CreateFormPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  // State for form fields
  const [parentEmail, setParentEmail] = useState('');
  const [leaveFrom, setLeaveFrom] = useState('');
  const [leaveTo, setLeaveTo] = useState('');
  const [reason, setReason] = useState('');
  const [subjects, setSubjects] = useState([{ subjectName: '', teacherName: '', periods: '' }]);
  const [document, setDocument] = useState(null);

  // State for loading indicators
  const [uploading, setUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ... (all handler functions like handleSubjectChange, onSubmit, etc. remain the same)
  const handleSubjectChange = (index, event) => {
    const values = [...subjects];
    values[index][event.target.name] = event.target.value;
    setSubjects(values);
  };
  const addSubjectRow = () => {
    setSubjects([...subjects, { subjectName: '', teacherName: '', periods: '' }]);
  };
  const removeSubjectRow = (index) => {
    const values = [...subjects];
    values.splice(index, 1);
    setSubjects(values);
  };
  const handleFileChange = (e) => {
    setDocument(e.target.files[0]);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    let documentPath = '';
    if (document) {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append('document', document);
      try {
        const { data } = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, uploadFormData);
        documentPath = data.path;
        setUploading(false);
      } catch (error) {
        toast({ title: 'File Upload Failed', description: error.message, status: 'error', duration: 5000, isClosable: true });
        setUploading(false);
        setIsSubmitting(false);
        return;
      }
    }
    try {
      const newFormData = {
        formType: 'Blue',
        formData: { leaveFrom, leaveTo, reason, subjects, documentPath, parentEmail },
      };
      await formService.createForm(newFormData, user.token);
      toast({ title: 'Form Submitted', status: 'success', duration: 3000, isClosable: true });
      window.location.href = '/';
    } catch (error) {
      toast({ title: 'Submission Failed', description: error.message, status: 'error', duration: 5000, isClosable: true });
      setIsSubmitting(false);
    }
  };


  return (
    <Box
      as="form"
      onSubmit={onSubmit}
      p={10}
      borderWidth="1px"
      borderRadius="md"
      boxShadow="xl"
      maxW="800px"
      mx="auto"
      bg="blue.50" // <-- ADD THIS LINE
    >
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center" fontFamily="serif">
          Application for Leave of Absence
        </Heading>

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Student Name:</FormLabel>
              <Input variant="flushed" value={user?.name || ''} isReadOnly />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Registration No:</FormLabel>
              <Input variant="flushed" value={user?.regNo || ''} isReadOnly />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Leave From:</FormLabel>
              <Input variant="flushed" type="date" value={leaveFrom} onChange={(e) => setLeaveFrom(e.target.value)} />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel fontSize="sm">Leave To:</FormLabel>
              <Input variant="flushed" type="date" value={leaveTo} onChange={(e) => setLeaveTo(e.target.value)} />
            </FormControl>
          </GridItem>
        </Grid>
        
        <FormControl isRequired>
          <FormLabel fontSize="sm">Reason for Leave:</FormLabel>
          <Textarea variant="flushed" value={reason} onChange={(e) => setReason(e.target.value)} />
        </FormControl>

        <FormControl isRequired>
          <FormLabel fontSize="sm">Parent's Email:</FormLabel>
          <Input variant="flushed" type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} />
        </FormControl>

        <VStack spacing={2} align="stretch">
          <Heading as="h3" size="md" mt={4} borderBottomWidth="1px" pb={2}>Subjects Missed</Heading>
          {subjects.map((subject, index) => (
            <Grid key={index} templateColumns="3fr 3fr 1fr 1fr" gap={4} alignItems="center">
              <Input variant="flushed" placeholder="Subject Name" name="subjectName" value={subject.subjectName} onChange={(e) => handleSubjectChange(index, e)} />
              <Input variant="flushed" placeholder="Teacher Name" name="teacherName" value={subject.teacherName} onChange={(e) => handleSubjectChange(index, e)} />
              <Input variant="flushed" type="number" placeholder="Periods" name="periods" value={subject.periods} onChange={(e) => handleSubjectChange(index, e)} />
              <Button size="sm" colorScheme="red" variant="ghost" onClick={() => removeSubjectRow(index)}>Remove</Button>
            </Grid>
          ))}
          <Button size="sm" onClick={addSubjectRow} alignSelf="flex-start" mt={2}>Add Subject</Button>
        </VStack>

        <FormControl>
          <FormLabel fontSize="sm">Medical Certificate:</FormLabel>
          <Input type="file" p={1.5} onChange={handleFileChange} />
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          isLoading={isSubmitting || uploading}
          loadingText="Submitting..."
          disabled={uploading || isSubmitting}
          mt={6}
        >
          Submit Application
        </Button>
      </VStack>
    </Box>
  );
}

export default CreateFormPage;