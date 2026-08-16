# VaultOfCourse AI Chatbot

This project is an AI Website Support Chatbot built for the VaultOfCourse platform. It acts as a first-level support and inquiry assistant for students and website visitors.

## Features

- **Responsive Chat Interface**: Modern, premium UI (glassmorphism) tailored for both desktop and mobile.
- **Smart Routing & Intent Detection**: Built-in instructions using prompt engineering to categorize queries (course_inquiry, internship_inquiry, etc.).
- **Knowledge Base Integration**: Retrieves information strictly from the configured `src/lib/knowledge-base.json`. No hallucination.
- **WhatsApp Escalation**: Automatically detects queries requiring human intervention (e.g., payment issues, missing offer letters) and provides a WhatsApp escalation link.
- **Contextual Memory**: Remembers previous questions to handle follow-up pronouns (e.g., "Tell me about Python", then "What's its duration?").

## Tech Stack

- Next.js (App Router)
- React
- Vanilla CSS (CSS Modules)
- Google Gen AI SDK (`@google/genai`)

## Setup Instructions

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Configure Environment Variables**
   Create a `.env.local` file in the root of the project and add your Google Gemini API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key_here
   ```
   *Note: If you do not provide an API key, the chatbot will run in "mock mode" for basic testing.*

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Testing

A test dataset covering 10+ edge cases and intents is provided in `tests/test-queries.json`. You can use these queries to manually verify the chatbot's response accuracy, escalation triggers, and intent detection.

## Structure

- `src/components/Chatbot/`: The UI components and styles for the Chatbot.
- `src/app/api/chat/route.js`: The Next.js API route that handles communication with the Google Gemini API.
- `src/lib/prompts.js`: The system instruction and prompt architecture.
- `src/lib/knowledge-base.json`: The structured data source for VaultOfCourse.
