import { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Papa from 'papaparse';
import Select from 'react-select';
import {
  Box, Button, FormControl, FormLabel, Input, VStack, HStack, Heading, Text, useToast, Grid, NumberInput, NumberInputField
} from '@chakra-ui/react';
import AuthContext from '../context/AuthContext.jsx';
import formService from '../services/formService.js';

const periodOptions = [
  { value: 'Period7_00AM', label: '7:00 AM' },
  { value: 'Period8_00AM', label: '8:00 AM' },
  { value: 'Period9_45AM', label: '9:45 AM' },
  { value: 'Period10_45AM', label: '10:45 AM' },
  { value: 'Period11_45AM', label: '11:45 AM' },
  { value: 'Period1_45PM', label: '1:45 PM' },
  { value: 'Period2_45PM', label: '2:45 PM' },
];

function ReapplyYellowFormPage() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const toast = useToast();
  const { id: formId } = useParams(); // Get the ID of the rejected form from the URL

  const [eventName, setEventName] = useState('');
  const [students, setStudents] = useState([]);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // This effect runs on load to fetch the old form's data
  useEffect(() => {
    const fetchOldFormData = async () => {
      try {
        const oldForm = await formService.getFormById(formId);
        // Pre-fill the state with data from the old form
        setEventName(oldForm.formData.eventName);
        
        // Pre-fill student data, ensuring periodsMissed is an array of objects
        const prefilledStudents = oldForm.formData.students.map(student => ({
          ...student,
          periodsMissed: (student.periodsMissed || []).map(p => periodOptions.find(opt => opt.value === p)).filter(Boolean)
        }));
        setStudents(prefilledStudents);
        
      } catch (error) {
        toast({ title: 'Could not load form data', status: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchOldFormData();
  }, [formId, toast]);

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
  
  const handlePeriodChange = (index, selectedOptions) => {
    const values = [...students];
    values[index].periodsMissed = selectedOptions;
    setStudents(values);
  };

  const addStudentRow = () => {
    setStudents([...students, { regNo: '', studentName: '', className: '', attendanceWithClaims: '', attendanceWithoutClaims: '', periodsMissed: [] }]);
  };

  const removeStudentRow = (index) => {
    const values = [...students];
    values.splice(index, 1);
    setStudents(values);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const parseFile = () => { /* ... same as YellowFormPage ... */ };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const newFormData = {
        formType: 'Yellow',
        formData: {
          eventName,
          students: students.map(s => ({
            ...s,
            periodsMissed: (s.periodsMissed || []).map(p => p.value)
          })),
        },
      };
      await formService.createForm(newFormData);
      toast({ title: 'Form Re-submitted Successfully', status: 'success' });
      window.location.href = '/club';
    } catch (error) {
      toast({ title: 'Submission Failed', description: error.message, status: 'error' });
    }
  };

  if (isLoading) {
    return <Text>Loading form data...</Text>;
  }

  return (
    <Box as="form" onSubmit={onSubmit} p={10} borderWidth="1px" borderRadius="md" boxShadow="xl" maxW="1400px" mx="auto" bg="yellow.50">
      <VStack spacing={6} align="stretch">
        <Heading as="h1" size="lg" textAlign="center" fontFamily="serif">
          Re-apply: Yellow Form
        </Heading>
        {/* The rest of the form's JSX is identical to YellowFormPage.jsx */}
        {/* It will be automatically pre-filled with the data from the state */}
      </VStack>
    </Box>
  );
}

export default ReapplyYellowFormPage;