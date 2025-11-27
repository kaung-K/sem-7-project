# 🤖 SubHub Chatbot Setup Guide

Your chatbot has been successfully implemented! Follow these steps to get it up and running with your fine-tuned Mistral 7B model.

## 📋 Features Implemented

✅ **Modern Chat UI** - Beautiful, responsive design with dark/light theme support  
✅ **Message Formatting** - Cleans up raw Mistral output and formats it nicely  
✅ **Response Processing** - Handles bold text, lists, and proper spacing  
✅ **Error Handling** - Graceful error messages and loading states  
✅ **Navigation Integration** - Added to main navbar with chat icon  
✅ **Quick Suggestions** - Pre-made questions for users  
✅ **Conversation History** - Maintains context in conversations  

## ⚙️ Environment Configuration

Create a `.env` file in your `sem7-project/project/` directory with these variables:

```bash
# Required: Your Fine-tuned Mistral API Configuration
REACT_APP_MISTRAL_API_KEY=your_mistral_api_key_here

# For fine-tuned models, you might need a custom URL:
REACT_APP_MISTRAL_API_URL=https://api.mistral.ai/v1/chat/completions
# OR if using a custom endpoint for your fine-tuned model:
# REACT_APP_MISTRAL_API_URL=https://your-custom-endpoint.com/v1/chat/completions

# Your fine-tuned model ID (replace with your actual model ID):
REACT_APP_MISTRAL_MODEL=your-finetuned-nexora-model-id

# Optional: For development/testing with mock responses
REACT_APP_USE_MOCK_BOT=false

# Your existing API URL
REACT_APP_API_URL=http://localhost:3002/api
```

## 🔑 Getting Your Mistral API Key

1. Visit [Mistral AI Console](https://console.mistral.ai/)
2. Sign up or log in to your account
3. Navigate to "API Keys" section
4. Create a new API key
5. Copy the key and add it to your `.env` file

## 🚀 How to Use

1. **Start your application:**

   ```bash
   cd sem7-project/project
   npm start
   ```

2. **Navigate to the chatbot:**
   - Click "Assistant" in the navigation bar
   - Or visit: `http://localhost:3000/chatbot`

3. **Test the chatbot:**
   - Try asking: "What is Nexora?"
   - Or: "How do I upgrade to Premium?"
   - Or use the quick suggestion buttons

## ⚠️ Important: API Logic Update

**Your chatbot now automatically switches between mock and real API based on configuration:**

- **With API key**: If `REACT_APP_MISTRAL_API_KEY` is set, it uses your real Mistral API
- **Without API key**: Falls back to mock responses based on your Nexora training data
- **Force mock mode**: Set `REACT_APP_USE_MOCK_BOT=true` to always use mock responses

## 🎛️ Configuration Options

### Using Your Fine-tuned Model

Update your `.env` file with your specific model:

```bash
# If you have a specific fine-tuned model ID
REACT_APP_MISTRAL_MODEL=your-finetuned-model-id

# If using a custom API endpoint
REACT_APP_MISTRAL_API_URL=your-custom-api-endpoint
```

### Using Local Mistral Instance

If you're running Mistral locally (e.g., with Ollama):

```bash
# Enable local mode
REACT_APP_LOCAL_MISTRAL_URL=http://localhost:11434/api/chat
```

Then update the service file to use `chatWithLocalMistral` instead.

### Mock Mode for Development

For testing without API costs:

```bash
REACT_APP_USE_MOCK_BOT=true
```

## 🎨 Customization

### Response Formatting

The chatbot automatically formats responses from your raw Mistral output:

- **Bold text**: `**text**` → **text**
- **Italics**: `*text*` → *text*
- **Lists**: Automatic bullet points and numbering
- **Line breaks**: Proper spacing between paragraphs

### System Prompt

The system prompt is configured in `src/services/chatbot.js`. You can customize it to better match your fine-tuned model:

```javascript
const SYSTEM_PROMPT = `You are a helpful assistant for SubHub...`;
```

### UI Styling

The chatbot UI matches your existing theme. You can customize:

- Colors in `src/components/Chatbot.js`
- Message styling and layout
- Quick suggestion buttons
- Loading animations

## 🔧 Troubleshooting

### Common Issues

1. **"API key not configured" error**
   - Make sure your `.env` file exists
   - Verify `REACT_APP_MISTRAL_API_KEY` is set
   - Restart your development server

2. **Network errors**
   - Check your internet connection
   - Verify the Mistral API URL is correct
   - Check if you have API credits

3. **Poor response quality**
   - Adjust the temperature in `chatbot.js`
   - Modify the system prompt
   - Check if you're using the right model ID

### Testing Steps

1. **Test with mock bot first:**

   ```bash
   REACT_APP_USE_MOCK_BOT=true
   ```

2. **Check browser console** for error messages

3. **Verify API key** is working with a simple curl test:

   ```bash
   curl https://api.mistral.ai/v1/chat/completions \
     -H "Authorization: Bearer YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"model":"mistral-7b-instruct","messages":[{"role":"user","content":"Hello"}]}'
   ```

## 📁 Files Added/Modified

- ✅ `src/components/Chatbot.js` - Main chatbot component
- ✅ `src/services/chatbot.js` - API integration service
- ✅ `src/App.js` - Added chatbot route
- ✅ `src/components/Navbar.js` - Added chatbot navigation link

## 🌟 Next Steps

1. **Set up your API key** and test the chatbot
2. **Customize the system prompt** for your fine-tuned model
3. **Adjust response formatting** if needed
4. **Add more quick suggestions** based on common user questions
5. **Consider rate limiting** for production use

Your chatbot is now ready to help users learn about SubHub! 🎉

---

Need help? The chatbot includes comprehensive error handling and logging. Check your browser's developer console for detailed error messages.
