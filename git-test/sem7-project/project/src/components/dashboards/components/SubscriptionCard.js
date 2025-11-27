import React from 'react';
import { Link } from 'react-router-dom';

const SubscriptionCard = ({ subscription, isDarkMode }) => {
    const creatorName = subscription.username || subscription.name || 'Unknown Creator';
    const creatorBio = subscription.bio || subscription.description || 'No description available';
    const creatorId = subscription._id || subscription.id;
    const profilePic = subscription.profilePic?.url || subscription.profilePic || '/images/creator.jpg';
    const category = subscription.category || 'General';
    const fee = subscription.fee || '15';

    return (
        <div className={`flex items-center p-4 rounded-lg border transition-all duration-300 hover:shadow-md ${isDarkMode ? 'bg-gray-700 border-gray-600 hover:border-gray-500' : 'bg-gray-50 border-gray-200 hover:border-gray-300'
            }`}>
            {/* Creator Avatar */}
            <div className="flex-shrink-0">
                <img
                    src={profilePic}
                    alt={creatorName}
                    className="w-12 h-12 rounded-full object-cover"
                    onError={(e) => {
                        e.target.src = '/images/default-avatar.svg';
                    }}
                />
            </div>

            {/* Creator Info */}
            <div className="ml-4 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h4 className={`text-sm font-semibold truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {creatorName}
                    </h4>
                    <div className="flex items-center ml-2">
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                            }`}>
                            Active
                        </span>
                    </div>
                </div>

                <div className="flex items-center mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-blue-900 text-blue-300' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {category}
                    </span>
                    <span className={`text-xs ml-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        ${fee}/month
                    </span>
                </div>

                <p className={`text-xs mt-2 line-clamp-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {creatorBio}
                </p>
            </div>

            {/* Action Button */}
            <div className="ml-4 flex-shrink-0">
                <Link
                    to={`/creator/${creatorId}`}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${isDarkMode
                            ? 'bg-blue-600 hover:bg-blue-700 text-white'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                >
                    View Profile
                </Link>
            </div>
        </div>
    );
};

export default SubscriptionCard;
