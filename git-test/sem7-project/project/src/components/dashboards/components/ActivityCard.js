import React from 'react';

const ActivityCard = ({ title, activities, isDarkMode }) => {
    return (
        <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
            <h3 className={`text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {title}
            </h3>

            <div className="space-y-4">
                {activities && activities.length > 0 ? (
                    activities.map((activity, index) => (
                        <div key={index} className={`flex items-start p-3 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                            <div className="flex-shrink-0">
                                <span className="text-xl">{activity.icon}</span>
                            </div>
                            <div className="ml-3 flex-1 min-w-0">
                                <p className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {activity.action}
                                </p>
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {activity.time}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6">
                        <div className="text-4xl mb-2">🔄</div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            No recent activity
                        </p>
                    </div>
                )}
            </div>

            {activities && activities.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button className={`text-sm font-medium w-full text-center py-2 rounded-lg transition-colors ${isDarkMode
                            ? 'text-blue-400 hover:text-blue-300 hover:bg-gray-700'
                            : 'text-blue-600 hover:text-blue-500 hover:bg-gray-50'
                        }`}>
                        View All Activity →
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivityCard;
