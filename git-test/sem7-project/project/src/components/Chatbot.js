import React, { useState, useRef, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { chatBot } from '../services/chatbot';

const Chatbot = ({ isDarkMode, toggleTheme }) => {
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hi! I'm your Nexora assistant. I can help answer questions about our platform, premium memberships, content creation, dashboards, and more. What would you like to know?",
            sender: 'bot',
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatBotResponse = (rawText) => {
        // Clean up the raw response from Mistral
        let formatted = rawText.trim();

        // Remove any unwanted prefixes or suffixes
        formatted = formatted.replace(/^(Assistant:|Bot:|AI:)\s*/i, '');
        formatted = formatted.replace(/\s*(Human:|User:).*$/i, '');

        // Fix common formatting issues
        formatted = formatted.replace(/\n\n+/g, '\n\n'); // Multiple newlines to double
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold text
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>'); // Italic text

        // Convert numbered lists
        formatted = formatted.replace(/(\d+\.\s)/g, '\n$1');

        // Convert bullet points
        formatted = formatted.replace(/([•\-\*]\s)/g, '\n• ');

        // Clean up extra whitespace
        formatted = formatted.replace(/^\s+/gm, ''); // Remove leading spaces
        formatted = formatted.trim();

        return formatted;
    };

    const handleSend = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage = {
            id: Date.now(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const response = await chatBot(inputValue);
            const formattedResponse = formatBotResponse(response);

            const botMessage = {
                id: Date.now() + 1,
                text: formattedResponse,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                id: Date.now() + 1,
                text: "I apologize, but I'm having trouble processing your request right now. Please try again in a moment.",
                sender: 'bot',
                timestamp: new Date(),
                isError: true
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
        }
    };

    useEffect(() => {
        adjustTextareaHeight();
    }, [inputValue]);

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                text: "Hi! I'm your Nexora assistant. I can help answer questions about our platform, premium memberships, content creation, dashboards, and more. What would you like to know?",
                sender: 'bot',
                timestamp: new Date()
            }
        ]);
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />

            <div className="pt-20 pb-4 px-4 max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex justify-center items-center mb-4">
                        <div className={`p-3 rounded-full ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                            <svg className={`w-8 h-8 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                            </svg>
                        </div>
                    </div>
                    <h1 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Nexora Assistant
                    </h1>
                    <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-600'} mt-2`}>
                        Get instant answers about Nexora platform
                    </p>
                    <button
                        onClick={clearChat}
                        className={`mt-4 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isDarkMode
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Clear Chat
                    </button>
                </div>

                {/* Chat Container */}
                <div className={`rounded-2xl shadow-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'} overflow-hidden`}>
                    {/* Messages */}
                    <div className="h-96 overflow-y-auto p-4 space-y-4">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-2xl ${message.sender === 'user'
                                        ? 'bg-blue-600 text-white'
                                        : message.isError
                                            ? isDarkMode ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-800'
                                            : isDarkMode ? 'bg-gray-700 text-gray-100' : 'bg-gray-100 text-gray-900'
                                        }`}
                                >
                                    {message.sender === 'bot' ? (
                                        <div
                                            className="whitespace-pre-wrap"
                                            dangerouslySetInnerHTML={{ __html: message.text }}
                                        />
                                    ) : (
                                        <p className="whitespace-pre-wrap">{message.text}</p>
                                    )}
                                    <div className={`text-xs mt-1 opacity-70`}>
                                        {message.timestamp.toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading indicator */}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}>
                                    <div className="flex items-center space-x-2">
                                        <div className={`flex space-x-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                            <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                        </div>
                                        <span className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                                            Thinking...
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className={`border-t p-4 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex items-end space-x-3">
                            <div className="flex-1 relative">
                                <textarea
                                    ref={textareaRef}
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything about SubHub..."
                                    className={`w-full px-4 py-3 pr-12 rounded-xl border resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${isDarkMode
                                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                        }`}
                                    rows="1"
                                    style={{ minHeight: '52px' }}
                                    disabled={isLoading}
                                />
                            </div>
                            <button
                                onClick={handleSend}
                                disabled={!inputValue.trim() || isLoading}
                                className={`p-3 rounded-xl font-medium transition-all transform ${!inputValue.trim() || isLoading
                                    ? isDarkMode
                                        ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
                                    }`}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>

                        {/* Quick Suggestions */}
                        <div className="mt-3 flex flex-wrap gap-2">
                            {[
                                "What is Nexora?",
                                "How do I upgrade to Premium?",
                                "How do I write a new post?",
                                "How do I manage billing?"
                            ].map((suggestion, index) => (
                                <button
                                    key={index}
                                    onClick={() => setInputValue(suggestion)}
                                    disabled={isLoading}
                                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${isDarkMode
                                        ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                                        : 'border-gray-300 text-gray-600 hover:bg-gray-100'
                                        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}`}
                                >
                                    {suggestion}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Info Section */}
                <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-gray-800 border border-gray-700' : 'bg-blue-50 border border-blue-200'}`}>
                    <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-blue-900' : 'bg-blue-100'}`}>
                            <svg className={`w-5 h-5 ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                About Nexora Assistant
                            </h3>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                I'm powered by a fine-tuned Mistral 7B model specifically trained on Nexora platform information.
                                I can help with premium memberships, content creation, billing, dashboards, and general platform features.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer isDarkMode={isDarkMode} />
        </div>
    );
};

export default Chatbot;
