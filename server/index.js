import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import axios from 'axios';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-recruiter', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  callId: String,
  candidateName: String,
  candidatePhone: String,
  position: String,
  startTime: { type: Date, default: Date.now },
  endTime: Date,
  duration: Number,
  status: { type: String, default: 'active' },
  transcript: [{
    speaker: String, // 'ai' or 'user'
    text: String,
    timestamp: { type: Date, default: Date.now }
  }],
  summary: String,
  score: Number,
  tags: [String]
});

const Conversation = mongoose.model('Conversation', conversationSchema);

// Store active calls
const activeCalls = new Map();

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('Client connected:', socket.id);
  
  socket.on('join-call', (callId) => {
    socket.join(callId);
    console.log(`Socket ${socket.id} joined call ${callId}`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start a new call with Vapi.AI
app.post('/api/calls/start', async (req, res) => {
  try {
    const { candidateName, candidatePhone, position } = req.body;
    
    // Create conversation record
    const conversation = new Conversation({
      candidateName,
      candidatePhone,
      position,
      status: 'starting'
    });
    await conversation.save();

    // Start call with Vapi.AI
    const vapiResponse = await axios.post('https://api.vapi.ai/call', {
      phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
      customer: {
        number: candidatePhone,
        name: candidateName
      },
      assistant: {
        model: {
          provider: "openai",
          model: "gpt-4",
          messages: [
            {
              role: "system",
              content: `You are an AI recruiter conducting a voice interview for a ${position} position. Be professional, friendly, and ask relevant technical and behavioral questions. Keep responses concise and conversational. The candidate's name is ${candidateName}.`
            }
          ]
        },
        voice: {
          provider: "11labs",
          voiceId: "21m00Tcm4TlvDq8ikWAM"
        },
        firstMessage: `Hello ${candidateName}! Thank you for joining today's interview for the ${position} position. I'm your AI interviewer, and I'm excited to learn more about you. Could you please start by telling me a bit about yourself and your background?`
      }
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    // Update conversation with call ID
    conversation.callId = vapiResponse.data.id;
    conversation.status = 'active';
    await conversation.save();

    // Store active call
    activeCalls.set(vapiResponse.data.id, {
      conversationId: conversation._id,
      socketRoom: vapiResponse.data.id
    });

    res.json({
      success: true,
      callId: vapiResponse.data.id,
      conversationId: conversation._id
    });

  } catch (error) {
    console.error('Error starting call:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to start call',
      details: error.response?.data || error.message
    });
  }
});

// End a call
app.post('/api/calls/:callId/end', async (req, res) => {
  try {
    const { callId } = req.params;
    
    // End call with Vapi.AI
    await axios.post(`https://api.vapi.ai/call/${callId}/end`, {}, {
      headers: {
        'Authorization': `Bearer ${process.env.VAPI_API_KEY}`
      }
    });

    // Update conversation status
    const conversation = await Conversation.findOne({ callId });
    if (conversation) {
      conversation.status = 'completed';
      conversation.endTime = new Date();
      conversation.duration = Math.round((conversation.endTime - conversation.startTime) / 1000);
      await conversation.save();
    }

    // Clean up active call
    activeCalls.delete(callId);

    // Notify frontend
    io.to(callId).emit('call-ended', { callId });

    res.json({ success: true });
  } catch (error) {
    console.error('Error ending call:', error);
    res.status(500).json({ success: false, error: 'Failed to end call' });
  }
});

// Vapi.AI webhook endpoint
app.post('/api/vapi/webhook', async (req, res) => {
  try {
    const event = req.body;
    console.log('Vapi webhook event:', event.type);

    const callId = event.call?.id;
    if (!callId) {
      return res.status(200).send('OK');
    }

    const activeCall = activeCalls.get(callId);
    if (!activeCall) {
      return res.status(200).send('OK');
    }

    switch (event.type) {
      case 'transcript':
        // Handle live transcription
        const transcript = {
          speaker: event.transcript.role === 'assistant' ? 'ai' : 'user',
          text: event.transcript.text,
          timestamp: new Date()
        };

        // Save to database
        await Conversation.findByIdAndUpdate(activeCall.conversationId, {
          $push: { transcript: transcript }
        });

        // Broadcast to frontend
        io.to(callId).emit('transcript-update', transcript);
        break;

      case 'call-started':
        io.to(callId).emit('call-started', { callId });
        break;

      case 'call-ended':
        // Update conversation
        const conversation = await Conversation.findByIdAndUpdate(
          activeCall.conversationId,
          {
            status: 'completed',
            endTime: new Date(),
            summary: 'Interview completed successfully'
          },
          { new: true }
        );

        if (conversation) {
          conversation.duration = Math.round((conversation.endTime - conversation.startTime) / 1000);
          await conversation.save();
        }

        // Clean up and notify
        activeCalls.delete(callId);
        io.to(callId).emit('call-ended', { callId });
        break;

      case 'speech-started':
        io.to(callId).emit('speech-started', { 
          speaker: event.role === 'assistant' ? 'ai' : 'user' 
        });
        break;

      case 'speech-ended':
        io.to(callId).emit('speech-ended', { 
          speaker: event.role === 'assistant' ? 'ai' : 'user' 
        });
        break;
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).send('Error');
  }
});

// Get conversation history
app.get('/api/conversations', async (req, res) => {
  try {
    const conversations = await Conversation.find()
      .sort({ startTime: -1 })
      .select('-transcript'); // Exclude transcript for list view
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
});

// Get specific conversation with full transcript
app.get('/api/conversations/:id', async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(conversation);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ error: 'Failed to fetch conversation' });
  }
});

// Get call status
app.get('/api/calls/:callId/status', async (req, res) => {
  try {
    const { callId } = req.params;
    const conversation = await Conversation.findOne({ callId });
    
    res.json({
      status: conversation?.status || 'unknown',
      duration: conversation?.duration || 0,
      transcript: conversation?.transcript || []
    });
  } catch (error) {
    console.error('Error getting call status:', error);
    res.status(500).json({ error: 'Failed to get call status' });
  }
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('Make sure to set your environment variables:');
  console.log('- VAPI_API_KEY');
  console.log('- VAPI_PHONE_NUMBER_ID');
  console.log('- MONGODB_URI (optional, defaults to localhost)');
});