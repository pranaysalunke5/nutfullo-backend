import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Please add a name'] 
  },
  phone: { 
    type: String, 
    required: [true, 'Please add a phone number'] 
  },
  businessType: { 
    type: String, 
    required: true,
    // Restricts the input to only these specific options
    enum: ['Gym / Fitness Center', 'Retail / Grocery Shop', 'Wholesale / Distribution', 'Other']
  },
  message: { 
    type: String, 
    required: [true, 'Please add a message'] 
  }
}, {
  // Automatically manages 'createdAt' and 'updatedAt' for you
  timestamps: true 
});

// "export default" is the modern way to export the model
const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;