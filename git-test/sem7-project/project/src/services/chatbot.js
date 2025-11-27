import axios from 'axios';

// Mistral API configuration
const MISTRAL_API_URL = process.env.REACT_APP_MISTRAL_API_URL || 'https://api.mistral.ai/v1/chat/completions';
const MISTRAL_API_KEY = process.env.REACT_APP_MISTRAL_API_KEY;
const MISTRAL_MODEL = process.env.REACT_APP_MISTRAL_MODEL || 'mistral-7b-instruct';

// System prompt for your fine-tuned model
const SYSTEM_PROMPT = `You are a helpful assistant for Nexora, a subscription platform created for UiT SE ADBMS Course (CS-7313). You provide accurate information about Nexora's features including:

- Premium membership and subscription system
- Creator and reader dashboards  
- Content creation with rich editor
- Billing and payment processing
- Admin analytics and moderation
- Platform navigation and features
- Technical details about the Next.js/React/Tailwind stack

Always provide accurate, helpful answers based on your training about Nexora. If you don't know something specific, say so clearly.`;

/**
 * Chat with the fine-tuned Mistral model
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages for context (optional)
 * @returns {Promise<string>} - The bot's response
 */
export const chatWithMistral = async (userMessage, conversationHistory = []) => {
    try {
        // Prepare the messages array for the API call
        const messages = [
            {
                role: 'system',
                content: SYSTEM_PROMPT
            },
            // Add conversation history if provided
            ...conversationHistory.map(msg => ({
                role: msg.sender === 'user' ? 'user' : 'assistant',
                content: msg.text
            })),
            // Add the current user message
            {
                role: 'user',
                content: userMessage
            }
        ];

        // Check if API key is configured
        if (!MISTRAL_API_KEY) {
            throw new Error('Mistral API key not configured. Please set REACT_APP_MISTRAL_API_KEY in your environment.');
        }

        console.log('🤖 Sending request to Mistral API...');

        const response = await axios.post(
            MISTRAL_API_URL,
            {
                model: MISTRAL_MODEL,
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
                top_p: 0.9,
                stream: false
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${MISTRAL_API_KEY}`,
                },
                timeout: 30000 // 30 seconds timeout
            }
        );

        console.log('✅ Received response from Mistral API');

        // Extract the response text
        const botResponse = response.data.choices?.[0]?.message?.content;

        if (!botResponse) {
            throw new Error('No response received from Mistral API');
        }

        return botResponse;

    } catch (error) {
        console.error('❌ Mistral API error:', error);

        // Handle different types of errors
        if (error.response) {
            // API returned an error response
            const status = error.response.status;
            const message = error.response.data?.error?.message || error.response.data?.message || 'API Error';

            switch (status) {
                case 401:
                    throw new Error('Invalid API key. Please check your Mistral API configuration.');
                case 429:
                    throw new Error('Rate limit exceeded. Please try again in a moment.');
                case 500:
                    throw new Error('Mistral API server error. Please try again later.');
                default:
                    throw new Error(`API Error (${status}): ${message}`);
            }
        } else if (error.request) {
            // Network error
            throw new Error('Network error. Please check your internet connection and try again.');
        } else if (error.code === 'ECONNABORTED') {
            // Timeout error
            throw new Error('Request timed out. Please try again.');
        } else {
            // Other error
            throw new Error(error.message || 'An unexpected error occurred.');
        }
    }
};

/**
 * Alternative implementation for local Mistral API or custom endpoint
 * @param {string} userMessage 
 * @param {Array} conversationHistory 
 * @returns {Promise<string>}
 */
export const chatWithLocalMistral = async (userMessage, conversationHistory = []) => {
    try {
        // For local Mistral deployment (e.g., using Ollama, vLLM, etc.)
        const LOCAL_API_URL = process.env.REACT_APP_LOCAL_MISTRAL_URL || 'http://localhost:11434/api/chat';

        const response = await axios.post(LOCAL_API_URL, {
            model: MISTRAL_MODEL,
            messages: [
                { role: 'system', content: SYSTEM_PROMPT },
                ...conversationHistory.map(msg => ({
                    role: msg.sender === 'user' ? 'user' : 'assistant',
                    content: msg.text
                })),
                { role: 'user', content: userMessage }
            ],
            stream: false
        });

        return response.data.message?.content || response.data.response;

    } catch (error) {
        console.error('❌ Local Mistral error:', error);
        throw new Error('Failed to connect to local Mistral instance. Please check if the service is running.');
    }
};

/**
 * Mock chatbot response for development/testing - matches your Nexora training data
 * @param {string} userMessage 
 * @returns {Promise<string>}
 */
export const chatWithMockBot = async (userMessage) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = {
        'nexora': 'Nexora is a subscription platform created for UiT SE ADBMS Course (CS-7313). Project created by Wint War Shwe Yee, Naw Lal Yee Than Han, Chaw Su Han, Kaung Myat Thu, Kaung Kyaw Han. It provides dashboards for readers, creators, and admins with monthly membership, premium content gating, bookmarks, and a rich content editor.',

        'premium': 'Premium stories show a preview and then display a blur gate with an Upgrade prompt. Premium members can view the full content immediately. To upgrade to Premium, click Upgrade to Premium from the reader dashboard. This starts checkout for the monthly membership.',

        'billing': 'Use the Manage Billing button in the Membership tab of your reader dashboard. It opens the billing portal to update payment methods or cancel your plan. You can cancel Nexora membership anytime - access continues until the end of the billing period.',

        'creator': 'From the Creator Dashboard, click Write New Post. You will be taken to the rich content editor where you can compose and publish. Creators have an active membership and can browse and read other creators\' premium content like any member.',

        'dashboard': 'Nexora provides different dashboards:\n\n• **Reader Dashboard** - Access premium content, manage subscriptions, bookmarks\n• **Creator Dashboard** - Write posts, manage content, view analytics\n• **Admin Dashboard** - Platform stats, content moderation, user management',

        'bookmarks': 'Open your reader dashboard and go to the Bookmarks tab. All saved articles appear there with quick actions.',

        'theme': 'Yes. The site uses a theme provider and adapts to your system preference. You can also toggle the theme from the dashboard header using the Theme Toggle.',

        'tech': 'Nexora uses Next.js with React, Tailwind, and a component system for the UI.',

        'default': `I'd be happy to help you with Nexora! Here are some things I can assist you with:

**About Nexora:**
• What is Nexora and who created it
• Platform features and capabilities
• Technical stack information

**For Users:**
• How to upgrade to Premium
• Managing billing and subscriptions
• Using bookmarks and navigation

**For Creators:**
• How to write and publish posts
• Creator dashboard features
• Content management

**For Admins:**
• Platform analytics and moderation
• User management tools
• Admin dashboard features

What would you like to know about Nexora? 😊`
    };

    // Simple keyword matching for mock responses based on your training data
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('nexora') || lowerMessage.includes('what is')) {
        return responses.nexora;
    } else if (lowerMessage.includes('premium') || lowerMessage.includes('upgrade')) {
        return responses.premium;
    } else if (lowerMessage.includes('billing') || lowerMessage.includes('payment') || lowerMessage.includes('cancel')) {
        return responses.billing;
    } else if (lowerMessage.includes('creator') || lowerMessage.includes('write') || lowerMessage.includes('post')) {
        return responses.creator;
    } else if (lowerMessage.includes('dashboard')) {
        return responses.dashboard;
    } else if (lowerMessage.includes('bookmark')) {
        return responses.bookmarks;
    } else if (lowerMessage.includes('theme') || lowerMessage.includes('dark')) {
        return responses.theme;
    } else if (lowerMessage.includes('tech') || lowerMessage.includes('stack')) {
        return responses.tech;
    } else {
        return responses.default;
    }
};

// Export the main chat function - you can switch between implementations
// Uses real Mistral API when REACT_APP_MISTRAL_API_KEY is provided, otherwise uses mock bot
export const chatBot = (process.env.REACT_APP_MISTRAL_API_KEY && process.env.REACT_APP_USE_MOCK_BOT !== 'true')
    ? chatWithMistral
    : chatWithMockBot;
