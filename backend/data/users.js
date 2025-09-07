const users = [
  {
    name: 'Shiva Student',
    email: 'shiva@student.com',
    regNo: 1234567,
    password: 'password123',
    role: 'Student',
  },
  {
    name: 'Placement Coordinator',
    email: 'placement@staff.com',
    empId: 'S001',
    password: 'password123',
    role: 'Faculty/Staff',
    designation: 'Placement Coordinator',
  },
  {
    name: 'Head of Department',
    email: 'hod@staff.com',
    empId: 'S002',
    password: 'password123',
    role: 'Faculty/Staff',
    designation: 'HOD', // Ensure this is correct
  },
  // --- NEW USER ---
  {
    name: 'Generic Teacher',
    email: 'teacher@staff.com',
    empId: 'S003',
    password: 'password123',
    role: 'Faculty/Staff',
    designation: 'Teacher',
  },
  // --- END NEW USER ---
  {
    name: 'Debate Club',
    email: 'debate@club.com',
    empId: 'C001',
    password: 'password123',
    role: 'Club',
  },
];

export default users;