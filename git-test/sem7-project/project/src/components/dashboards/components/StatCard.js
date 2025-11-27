import React from 'react';

const StatCard = ({ title, value, icon, trend, isDarkMode, highlight = false }) => {
    return (
        <div className={`rounded-xl border shadow-sm p-6 transition-all duration-300 hover:shadow-md ${highlight
                ? isDarkMode
                    ? 'bg-gradient-to-br from-blue-900 to-purple-900 border-blue-700'
                    : 'bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200'
                : isDarkMode
                    ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                    : 'bg-white border-gray-200 hover:border-gray-300'
            }`}>
            <div className="flex items-center justify-between mb-4">
                <div className={`text-2xl ${highlight ? 'opacity-90' : ''}`}>{icon}</div>
                {highlight && (
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-800 text-blue-100' : 'bg-blue-100 text-blue-800'
                        }`}>
                        Featured
                    </div>
                )}
            </div>

            <div className="space-y-1">
                <p className={`text-sm font-medium ${highlight
                        ? isDarkMode ? 'text-blue-100' : 'text-blue-900'
                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                    {title}
                </p>

                <p className={`text-2xl font-bold ${highlight
                        ? isDarkMode ? 'text-white' : 'text-gray-900'
                        : isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    {value}
                </p>

                {trend && (
                    <div className="flex items-center">
                        <span className={`text-xs ${trend.includes('+') ? 'text-green-600' :
                                trend.includes('-') ? 'text-red-600' :
                                    highlight
                                        ? isDarkMode ? 'text-blue-200' : 'text-blue-700'
                                        : isDarkMode ? 'text-gray-400' : 'text-gray-500'
                            }`}>
                            {trend.includes('+') && '↗️ '}
                            {trend.includes('-') && '↘️ '}
                            {trend}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
