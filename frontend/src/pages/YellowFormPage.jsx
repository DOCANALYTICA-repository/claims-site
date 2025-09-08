import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import {
  Box, Button, FormControl, FormLabel, Input, VStack, HStack, Heading, Text, useToast, Grid, GridItem, NumberInput, NumberInputField
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';
import formService from '../services/formService.js';

function YellowFormPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();

  const [eventName, setEventName] = useState('');
  // NEW: State for attendance fields
  const [attendanceWithClaims, setAttendanceWithClaims] = useState('');
  const [attendanceWithoutClaims, setAttendanceWithoutClaims] = useState('');

  const [students, setStudents] = useState([{ regNo: '', studentName: '', className: '' }]);
  const [file, setFile] = useState(null);

  // ... (existing handler functions: handleStudentChange, addStudentRow, etc.)

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFormData = {
        formType: 'Yellow',
        formData: {
          eventName,
          students,
          attendanceWithClaims,     // <-- ADD
          attendanceWithoutClaims,  // <-- ADD
        },
      };
      await formService.createForm(newFormData);
      toast({ title: 'Form Submitted', status: 'success', duration: 3000, isClosable: true });
      window.location.href = '/club'; // Redirect to club dashboard
    } catch (error) {
      toast({ title: 'Submission Failed', description: error.message, status: 'error', duration: 5000, isClosable: true });
    }
  };

  return (
    <Box as="form" onSubmit={onSubmit} p={10} borderWidth="1px" borderRadius="md" boxShadow="xl" maxW="800px" mx="auto" bg="yellow.50">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center" fontFamily="serif">
          Yellow Form: Co-Curricular / Extra Curricular
        </Heading>

        <FormControl isRequired>
          <FormLabel>Event Name:</FormLabel>
          <Input variant="flushed" type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </FormControl>

        {/* NEW: Attendance Percentage Inputs */}
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Attendance % (With Claims):</FormLabel>
              <NumberInput min={0} max={100} value={attendanceWithClaims} onChange={(val) => setAttendanceWithClaims(val)}>
                <NumberInputField variant="flushed" placeholder="e.g., 85" />
              </NumberInput>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Attendance % (Without Claims):</FormLabel>
              <NumberInput min={0} max={100} value={attendanceWithoutClaims} onChange={(val) => setAttendanceWithoutClaims(val)}>
                <NumberInputField variant="flushed" placeholder="e.g., 75" />
              </NumberInput>
            </FormControl>
          </GridItem>
        </Grid>
        
        {/* ... rest of the form for student list and CSV upload ... */}

        <Button type="submit" colorScheme="brand" mt={6}>Submit Form</Button>
      </VStack>
    </Box>
  );
}

export default YellowFormPage;