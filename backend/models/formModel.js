import mongoose from 'mongoose';

const formSchema = new mongoose.Schema(
  { // This is the correct opening brace for the schema definition
    applicationNumber: {
      type: String,
      unique: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    formType: {
      type: String,
      required: true,
      enum: ['Blue', 'Yellow', 'Pink'],
    },
    status: {
      type: String,
      required: true,
      default: 'Pending',
    },
    rejectionReason: {
      type: String,
    },
    formData: {
      type: Object,
      required: true,
    },
    approvalChain: [
      {
        approverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
        details: { type: String },
        approvedAt: { type: Date },
      },
    ],
  }, // This is the correct closing brace for the schema definition
  {
    timestamps: true,
  }
);

const Form = mongoose.model('Form', formSchema);

export default Form;