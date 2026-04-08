import mongoose from 'mongoose';

const enquirySchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please add a name']
  },

  phone: {
    type: String,
    required: [true, 'Please add a phone number']
  },

  email: {
    type: String,
    default: null
  },

  city: {
    type: String,
    default: null
  },

  businessType: {
    type: String,
    required: true,
    enum: ['Gym', 'Retail', 'Wholesale', 'Distributor', 'Other']
  },

  otherBusinessType: {
    type: String,
    default: null
  },

  message: {
    type: String,
    default: ""
  }

}, {
  timestamps: true
});

const Enquiry = mongoose.model('Enquiry', enquirySchema);
export default Enquiry;