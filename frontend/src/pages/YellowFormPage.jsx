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
  const [attendanceWithClaims, setAttendanceWithClaims] = useState('');
  const [attendanceWithoutClaims, setAttendanceWithoutClaims] = useState('');
  const [students, setStudents] = useState([{ regNo: '', studentName: '', className: '' }]);
  const [file, setFile] = useState(null);

  const handleStudentChange = (index, event) => {
    const values = [...students];
    values[index][event.target.name] = event.target.value;
    setStudents(values);
  };

  const addStudentRow = () => {
    setStudents([...students, { regNo: '', studentName: '', className: '' }]);
  };

  const removeStudentRow = (index) => {
    const values = [...students];
    values.splice(index, 1);
    setStudents(values);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const parseFile = () => {
    if (!file) return;
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setStudents(results.data);
        toast({ title: 'File Parsed', description: `${results.data.length} students loaded.`, status: 'success', duration: 3000, isClosable: true });
      },
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFormData = {
        formType: 'Yellow',
        formData: {
          eventName,
          students,
          attendanceWithClaims,
          attendanceWithoutClaims,
        },
      };
      await formService.createForm(newFormData);
      toast({ title: 'Form Submitted', status: 'success', duration: 3000, isClosable: true });
      window.location.href = '/club';
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

        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Attendance % (With Claims):</FormLabel>
              <NumberInput min={0} max={100} value={attendanceWithClaims} onChange={(valStr, valNum) => setAttendanceWithClaims(valNum)}>
                <NumberInputField variant="flushed" placeholder="e.g., 85" />
              </NumberInput>
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl isRequired>
              <FormLabel>Attendance % (Without Claims):</FormLabel>
              <NumberInput min={0} max={100} value={attendanceWithoutClaims} onChange={(valStr, valNum) => setAttendanceWithoutClaims(valNum)}>
                <NumberInputField variant="flushed" placeholder="e.g., 75" />
              </NumberInput>
            </FormControl>
          </GridItem>
        </Grid>
        
        <Box pt={4}>
          <FormLabel>Upload Student List (CSV)</FormLabel>
          <HStack>
            <Input type="file" accept=".csv" p={1.5} onChange={handleFileChange} />
            <Button onClick={parseFile} disabled={!file} colorScheme="brand">Parse File</Button>
          </HStack>
          <Text fontSize="xs" color="gray.500" mt={1}>CSV headers must be: regNo, studentName, className</Text>
        </Box>

        <VStack spacing={2} align="stretch">
          <Heading as="h3" size="md" mt={4} borderBottomWidth="1px" pb={2}>Or, Manually Enter Students</Heading>
          {students.map((student, index) => (
            <HStack key={index} spacing={2}>
              <Input variant="flushed" placeholder="Reg No" name="regNo" value={student.regNo} onChange={(e) => handleStudentChange(index, e)} />
              <Input variant="flushed" placeholder="Student Name" name="studentName" value={student.studentName} onChange={(e) => handleStudentChange(index, e)} />
              <Input variant="flushed" placeholder="Class Name" name="className" value={student.className} onChange={(e) => handleStudentChange(index, e)} />
              <Button size="sm" colorScheme="red" variant="ghost" onClick={() => removeStudentRow(index)}>Remove</Button>
            </HStack>
          ))}
          <Button size="sm" onClick={addStudentRow} alignSelf="flex-start" mt={2}>Add Student</Button>
        </VStack>

        <Button type="submit" colorScheme="brand" mt={6} size="lg">Submit Form</Button>
      </VStack>
    </Box>
  );
}

export default YellowFormPage;