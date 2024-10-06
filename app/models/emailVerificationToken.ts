import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface EmailVerificationTokenDocument extends Document {
  user: mongoose.Types.ObjectId;
  token: string;
  createdAt: Date;
  compareToken(candidateToken: string): Promise<boolean>;
}

const emailVerificationTokenSchema = new Schema<EmailVerificationTokenDocument>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Replace 'User' with the actual name of your user model
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 86400, // Token expires after 24 hours (86400 seconds)
  },
});

// Pre-save hook to hash the token before saving
emailVerificationTokenSchema.pre<EmailVerificationTokenDocument>('save', async function (next) {
  if (this.isModified('token')) {
    const salt = await bcrypt.genSalt(10);
    this.token = await bcrypt.hash(this.token, salt);
  }
  next();
});

// Method to compare the provided token with the hashed token
emailVerificationTokenSchema.methods.compareToken = async function (candidateToken: string): Promise<boolean> {
  return bcrypt.compare(candidateToken, this.token);
};

// Check if the model already exists, otherwise create a new one
const EmailVerificationToken = mongoose.models.EmailVerificationToken || mongoose.model<EmailVerificationTokenDocument>(
  'EmailVerificationToken',
  emailVerificationTokenSchema
);

export default EmailVerificationToken;
