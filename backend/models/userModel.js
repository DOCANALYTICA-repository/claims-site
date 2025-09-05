import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },

    regNo: {
      type: Number,
      min: [1000000, 'Registration Number must be 7 digits'],
      max: [9999999, 'Registration Number must be 7 digits'],
      required: function () {
        return this.role === 'Student';
      },
      unique: true,
      sparse: true,
    },

    empId: {
      type: String,
      required: function () {
        return this.role === 'Faculty/Staff' || this.role === 'Club';
      },
      unique: true,
      sparse: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ['Student', 'Club', 'Faculty/Staff'],
    },
    designation: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

export default User; // <-- Ensure this line is 'export default'