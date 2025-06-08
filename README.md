# AI Recruiter Voice Agent

A modern web application that uses Vapi.AI to conduct AI-powered voice interviews with real-time transcription and comprehensive candidate management.

## Features

- **AI Voice Interviews**: Real phone calls powered by Vapi.AI
- **Live Transcription**: Real-time speech-to-text during interviews
- **Candidate Management**: Complete dashboard for managing interviews
- **Conversation History**: Detailed transcripts and analytics
- **Real-time Updates**: WebSocket integration for live updates

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- React Router for navigation
- Socket.IO client for real-time communication
- Lucide React for icons

### Backend
- Node.js with Express
- Socket.IO for real-time communication
- MongoDB with Mongoose
- Vapi.AI integration for voice calls
- Axios for HTTP requests

## Setup Instructions

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or MongoDB Atlas account
- Vapi.AI account with API key

### 1. Environment Setup

Create a `.env` file in the root directory:

```env
# Vapi.AI Configuration
VAPI_API_KEY=your_vapi_api_key_here
VAPI_PHONE_NUMBER_ID=your_vapi_phone_number_id_here

# Database
MONGODB_URI=mongodb://localhost:27017/ai-recruiter

# Server
PORT=3001
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Application

```bash
# Start both frontend and backend
npm run dev

# Or start them separately:
npm run dev:frontend  # Frontend on http://localhost:5173
npm run dev:backend   # Backend on http://localhost:3001
```

### 4. Vapi.AI Setup

1. Sign up at [Vapi.AI](https://vapi.ai)
2. Get your API key from the dashboard
3. Purchase a phone number or set up web calling
4. Configure your webhook URL: `http://your-domain.com/api/vapi/webhook`

## How It Works

### 1. Starting an Interview
- User clicks "Start New Interview" in the dashboard
- Fills out candidate information (name, phone, position)
- Backend calls Vapi.AI to initiate the phone call
- Candidate receives a call from the AI interviewer

### 2. Real-time Transcription
- Vapi.AI streams live transcription data to the webhook
- Backend receives transcript events and broadcasts via WebSocket
- Frontend displays live conversation bubbles
- Voice waveforms animate when speakers are talking

### 3. Interview Management
- All conversations stored in MongoDB
- Real-time status updates (starting, active, completed)
- Comprehensive transcript history
- Export functionality for transcripts

## API Endpoints

### Calls
- `POST /api/calls/start` - Start a new interview call
- `POST /api/calls/:callId/end` - End an active call
- `GET /api/calls/:callId/status` - Get call status

### Conversations
- `GET /api/conversations` - Get all conversations
- `GET /api/conversations/:id` - Get specific conversation with transcript

### Webhooks
- `POST /api/vapi/webhook` - Vapi.AI webhook for call events

## WebSocket Events

### Client → Server
- `join-call` - Join a specific call room

### Server → Client
- `transcript-update` - New transcript message
- `call-started` - Call has started
- `call-ended` - Call has ended
- `speech-started` - Speaker started talking
- `speech-ended` - Speaker stopped talking

## Database Schema

### Conversation Model
```javascript
{
  callId: String,           // Vapi.AI call ID
  candidateName: String,    // Candidate's name
  candidatePhone: String,   // Candidate's phone number
  position: String,         // Job position
  startTime: Date,          // Interview start time
  endTime: Date,           // Interview end time
  duration: Number,        // Duration in seconds
  status: String,          // 'starting', 'active', 'completed'
  transcript: [{           // Conversation transcript
    speaker: String,       // 'ai' or 'user'
    text: String,         // Spoken text
    timestamp: Date       // When it was said
  }],
  summary: String,         // Interview summary
  score: Number,          // Interview score (0-100)
  tags: [String]          // Skill tags
}
```

## Deployment

### Frontend (Netlify/Vercel)
1. Build the frontend: `npm run build`
2. Deploy the `dist` folder to your hosting provider
3. Update API URLs in production

### Backend (Railway/Heroku)
1. Set environment variables in your hosting platform
2. Ensure MongoDB is accessible
3. Configure Vapi.AI webhook URL to point to your backend

### Webhook Configuration
Make sure your Vapi.AI webhook points to:
`https://your-backend-domain.com/api/vapi/webhook`

## Troubleshooting

### Common Issues

1. **Calls not starting**: Check Vapi.AI API key and phone number ID
2. **Transcription not appearing**: Verify webhook URL is accessible
3. **WebSocket connection issues**: Ensure CORS is properly configured
4. **Database connection**: Check MongoDB URI and network access

### Debug Mode
Set `NODE_ENV=development` to see detailed logs in the backend.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details.