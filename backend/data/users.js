// backend/data/users.js

const users = [
  {
    name: 'Shiva Student',
    email: 'shiva@student.com',
    regNo: 1234567,
    password: 'password123', // Plain text, will be hashed by the seeder
    role: 'Student',
  },
  {
    name: 'Placement Coordinator',
    email: 'placement@staff.com',
    empId: 'S001',
    password: 'password123', // Plain text
    role: 'Faculty/Staff',
    designation: 'Placement Coordinator',
  },
  {
    name: 'Head of Department',
    email: 'hod@staff.com',
    empId: 'S002',
    password: 'password123', // Plain text
    role: 'Faculty/Staff',
    designation: 'HOD',
  },
  {
    name: 'Debate Club',
    email: 'debate@club.com',
    empId: 'C001',
    password: 'password123', // Plain text
    role: 'Club',
  },
];

module.exports = users;