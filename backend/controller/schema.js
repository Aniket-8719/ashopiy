const EmployeeSchema = new mongoose.Schema({
    employeeId: { type: String, unique: true, required: true }, // EMP-{mobileNumber}
    name: { type: String, required: true },
    mobile: { type: String, unique: true, required: true }, // Mobile number for linking
    additionalDetails: { type: Object }, // Any extra details added by shopkeeper
    user_Id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // shopkeeper 
    // All the details of employee
    // All the details of shopkeeper
  });

//   const AttendanceSchema = new mongoose.Schema({
//     EmployeeSchema_id: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeSchema', required: true }, // shopkeeper 
    // employeeId: { type: String, required: true }, // Link to employee
//     // shopkeeperId: { type: String, required: true }, // Link to shopkeeper
//     attendance: [
//       {
//         date: { type: String, required: true }, // Date of attendance
//         status: { type: String, enum: ["Present", "Absent", "Leave", "Other"], required: true },
//         reason: { type: String }, // Optional reason for leave/other
//       },
//     ],

//   });

  const staffSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,
    role: String,
    department: String,
    joiningDate: Date,
    isActive: { type: Boolean, default: true },
  });

  const attendanceSchema = new mongoose.Schema({
    EmployeeSchema_id: { type: mongoose.Schema.Types.ObjectId, ref: 'EmployeeSchema', required: true }, // shopkeeper 
    date: { type: String, required: true },
    status: { type: String, enum: ['Present', 'Absent', 'Leave', 'Other'], required: true },
    reason: { type: String }, // Optional for 'Other' status
  });

  