import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Papa from 'papaparse';
import {
  Box, Button, FormControl, FormLabel, Input, VStack, HStack, Heading, Text, useToast, Grid, NumberInput, NumberInputField
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';
import formService from '../services/formService.js';

function YellowFormPage() {
  const { user } = useContext(AuthContext);
  const toast = useToast();
  const [eventName, setEventName] = useState('');
  const [students, setStudents] = useState([{ 
    regNo: '', 
    studentName: '', 
    className: '', 
    attendanceWithClaims: '', 
    attendanceWithoutClaims: '' 
  }]);
  const [file, setFile] = useState(null);

  const handleStudentTextChange = (index, event) => {
    const values = [...students];
    values[index][event.target.name] = event.target.value;
    setStudents(values);
  };
  
  const handleStudentNumberChange = (index, name, value) => {
    const values = [...students];
    values[index][name] = value;
    setStudents(values);
  };

  const addStudentRow = () => {
    setStudents([...students, { regNo: '', studentName: '', className: '', attendanceWithClaims: '', attendanceWithoutClaims: '' }]);
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
        const parsedStudents = results.data.map(student => ({...student, attendanceWithClaims: '', attendanceWithoutClaims: ''}));
        setStudents(parsedStudents);
        toast({ title: 'File Parsed', description: `${results.data.length} students loaded.`, status: 'success' });
      },
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFormData = { formType: 'Yellow', formData: { eventName, students } };
      await formService.createForm(newFormData);
      toast({ title: 'Form Submitted', status: 'success' });
      window.location.href = '/club';
    } catch (error) {
      toast({ title: 'Submission Failed', description: error.message, status: 'error' });
    }
  };

  return (
    <Box as="form" onSubmit={onSubmit} p={8} borderWidth="1px" borderRadius="md" boxShadow="xl" maxW="1200px" mx="auto" bg="yellow.50">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center" fontFamily="serif">
          Yellow Form: Co-Curricular / Extra Curricular
        </Heading>
        <FormControl isRequired>
          <FormLabel>Event Name:</FormLabel>
          <Input variant="flushed" type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} />
        </FormControl>
        <Box pt={4}>
          <FormLabel>Upload Student List (CSV)</FormLabel>
          <HStack>
            <Input type="file" accept=".csv" p={1.5} onChange={handleFileChange} />
            <Button onClick={parseFile} disabled={!file} colorScheme="brand">Parse File</Button>
          </HStack>
          <Text fontSize="xs" color="gray.500" mt={1}>Headers: regNo, studentName, className</Text>
        </Box>
        <VStack spacing={4} align="stretch">
          <Heading as="h3" size="md" mt={4} borderBottomWidth="1px" pb={2}>Student List</Heading>
          <Grid templateColumns="1fr 2fr 1fr 1fr 1fr 1fr" gap={4} fontWeight="bold" fontSize="sm" px={2}>
            <GridItem>Reg No</GridItem>
            <GridItem>Student Name</GridItem>
            <GridItem>Class</GridItem>
            <GridItem>% With Claims</GridItem>
            <GridItem>% Without Claims</GridItem>
            <GridItem>Action</GridItem>
          </Grid>
          {students.map((student, index) => (
            <Grid key={index} templateColumns="1fr 2fr 1fr 1fr 1fr 1fr" gap={4} alignItems="center">
                <Input variant="flushed" placeholder="Reg No" name="regNo" value={student.regNo} onChange={(e) => handleStudentTextChange(index, e)} />
                <Input variant="flushed" placeholder="Student Name" name="studentName" value={student.studentName} onChange={(e) => handleStudentTextChange(index, e)} />
                <Input variant="flushed" placeholder="Class Name" name="className" value={student.className} onChange={(e) => handleStudentTextChange(index, e)} />
                <NumberInput size="sm" min={0} max={100} value={student.attendanceWithClaims} onChange={(valStr, valNum) => handleStudentNumberChange(index, 'attendanceWithClaims', valNum)}>
                  <NumberInputField variant="flushed" placeholder="e.g., 85" />
                </NumberInput>
                <NumberInput size="sm" min={0} max={100} value={student.attendanceWithoutClaims} onChange={(valStr, valNum) => handleStudentNumberChange(index, 'attendanceWithoutClaims', valNum)}>
                  <NumberInputField variant="flushed" placeholder="e.g., 75" />
                </NumberInput>
                <Button size="sm" colorScheme="red" variant="ghost" onClick={() => removeStudentRow(index)}>Remove</Button>
            </Grid>
          ))}
          <Button size="sm" onClick={addStudentRow} alignSelf="flex-start" mt={2}>Add Student</Button>
        </VStack>
        <Button type="submit" colorScheme="brand" mt={6} size="lg">Submit Form</Button>
      </VStack>
    </Box>
  );
}
export default YellowFormPage;