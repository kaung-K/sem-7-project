const EngagementChart = ({ data = [], isDarkMode }) => {
  const safe = Array.isArray(data) ? data : [];
  const likesArr = safe.map(it => Number(it.likes) || 0);
  const commentsArr = safe.map(it => Number(it.comments) || 0);
  const sharesArr = safe.map(it => Number(it.shares) || 0);

  // avoid divide-by-zero and NaN ticks
  const maxLikes = likesArr.length ? Math.max(...likesArr) : 0;
  const maxComments = commentsArr.length ? Math.max(...commentsArr) : 0;
  const maxShares = sharesArr.length ? Math.max(...sharesArr) : 0;
  const maxValue = Math.max(1, maxLikes, maxComments, maxShares); // at least 1

    return (
        <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Weekly Engagement
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Likes, comments, and shares
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-purple-900 text-purple-300' : 'bg-purple-100 text-purple-700'
                    }`}>
                    This Week
                </div>
            </div>

            {/* Chart Container */}
            <div className="relative h-64">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between">
                    {[4, 3, 2, 1, 0].map(i => (
                        <div key={i} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {Math.round((maxValue * i) / 4)}
                        </div>
                    ))}
                </div>

                {/* Chart area */}
                <div className="ml-8 mr-4 h-full">
                    {/* Grid lines */}
                    <div className="relative h-full">
                        {[0, 1, 2, 3, 4].map(i => (
                            <div
                                key={i}
                                className={`absolute w-full border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'
                                    }`}
                                style={{ top: `${(i * 100) / 4}%` }}
                            />
                        ))}

                        {/* Engagement bars */}
                        <div className="absolute inset-0 flex items-end justify-between px-1">
                            {data.map((item, index) => {
                                const likesHeight = (item.likes / maxValue) * 100;
                                const commentsHeight = (item.comments / maxValue) * 100;
                                const sharesHeight = (item.shares / maxValue) * 100;

                                return (
                                    <div key={item.day} className="flex flex-col items-center">
                                        {/* Grouped bars */}
                                        <div className="flex items-end space-x-1 mb-2">
                                            {/* Likes bar */}
                                            <div
                                                className={`w-3 rounded-t-sm transition-all duration-500 ${isDarkMode ? 'bg-red-500' : 'bg-red-500'
                                                    } hover:opacity-80 cursor-pointer relative group`}
                                                style={{ height: `${likesHeight * 0.8}px` }}
                                                title={`${item.likes} likes`}
                                            >
                                                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'bg-gray-900 text-white border border-gray-600' : 'bg-gray-800 text-white'
                                                    }`}>
                                                    {item.likes} ❤️
                                                </div>
                                            </div>

                                            {/* Comments bar */}
                                            <div
                                                className={`w-3 rounded-t-sm transition-all duration-500 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-500'
                                                    } hover:opacity-80 cursor-pointer relative group`}
                                                style={{ height: `${commentsHeight * 0.8}px` }}
                                                title={`${item.comments} comments`}
                                            >
                                                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'bg-gray-900 text-white border border-gray-600' : 'bg-gray-800 text-white'
                                                    }`}>
                                                    {item.comments} 💬
                                                </div>
                                            </div>

                                            {/* Shares bar */}
                                            {/* <div
                                                className={`w-3 rounded-t-sm transition-all duration-500 ${isDarkMode ? 'bg-green-500' : 'bg-green-500'
                                                    } hover:opacity-80 cursor-pointer relative group`}
                                                style={{ height: `${sharesHeight * 0.8}px` }}
                                                title={`${item.shares} shares`}
                                            >
                                                <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'bg-gray-900 text-white border border-gray-600' : 'bg-gray-800 text-white'
                                                    }`}>
                                                    {item.shares} 🔄
                                                </div>
                                            </div> */}
                                        </div>

                                        {/* Day label */}
                                        <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {item.day}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart legend */}
            <div className="flex items-center justify-center space-x-6 mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Likes</span>
                </div>
                <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Comments</span>
                </div>
                {/* <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Shares</span>
                </div> */}
            </div>
        </div>
    );
};

export default EngagementChart;
