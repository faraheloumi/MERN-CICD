import mongoose from 'mongoose'
import { UserSchemaType } from './user'

export interface ConversationSchemaType {
  name: string
  collaborators: mongoose.Schema.Types.ObjectId[] & UserSchemaType[]
  description: string
  isSelf: boolean
  organisation: mongoose.Schema.Types.ObjectId
  createdBy: mongoose.Schema.Types.ObjectId
  hasNotOpen: mongoose.Schema.Types.ObjectId[]
  isConversation: boolean
  isOnline: boolean
  createdAt: Date
  updatedAt: Date
}
const conversationSchema = new mongoose.Schema<ConversationSchemaType>(
  {
    name: {
      type: String,
      default: '', // Ne pas essayer d'accéder à username ici
    },
    collaborators: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    description: {
      type: String,
      default: function () {
        return `This conversation is just between ${this.name} and you`;
      },
    },
    isSelf: {
      type: Boolean,
      default: false,
    },
    isConversation: {
      type: Boolean,
      default: true,
    },
    organisation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Organisation',
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true, // Si `createdBy` est obligatoire
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    hasNotOpen: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Define a compound index on the collaborators field
conversationSchema.index({ collaborators: 1 });

// Méthode pour obtenir le `username` après avoir peuplé `createdBy`
conversationSchema.methods.getUsername = async function () {
  await this.populate('createdBy');
  return this.createdBy.username; // Après avoir peuplé, accéder à `username`
};

export default mongoose.model('Conversation', conversationSchema);