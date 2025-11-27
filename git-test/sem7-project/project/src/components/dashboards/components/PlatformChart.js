import React from 'react';

const PlatformChart = ({ data, isDarkMode }) => {
    // Find the maximum values to scale the chart
    const maxUsers = Math.max(...data.map(item => item.users));
    const maxRevenue = Math.max(...data.map(item => item.revenue));

    return (
        <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Platform Growth
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Users and revenue over time
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                    }`}>
                    6 Months
                </div>
            </div>

            {/* Chart Container */}
            <div className="relative h-64">
                {/* Dual Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between">
                    <div className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>Users</div>
                    {[4, 3, 2, 1, 0].map(i => (
                        <div key={i} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {Math.round((maxUsers * i) / 4)}
                        </div>
                    ))}
                </div>

                <div className="absolute right-0 top-0 bottom-8 flex flex-col justify-between">
                    <div className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>Revenue</div>
                    {[4, 3, 2, 1, 0].map(i => (
                        <div key={i} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ${Math.round((maxRevenue * i) / 4)}
                        </div>
                    ))}
                </div>

                {/* Chart area */}
                <div className="mx-12 h-full">
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

                        {/* Line chart for users and revenue */}
                        <div className="absolute inset-0">
                            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                                {/* Users line */}
                                <polyline
                                    fill="none"
                                    stroke={isDarkMode ? '#60a5fa' : '#3b82f6'}
                                    strokeWidth="2"
                                    points={data.map((item, index) =>
                                        `${(index / (data.length - 1)) * 100},${100 - (item.users / maxUsers) * 100}`
                                    ).join(' ')}
                                />

                                {/* Revenue line */}
                                <polyline
                                    fill="none"
                                    stroke={isDarkMode ? '#34d399' : '#10b981'}
                                    strokeWidth="2"
                                    strokeDasharray="5,5"
                                    points={data.map((item, index) =>
                                        `${(index / (data.length - 1)) * 100},${100 - (item.revenue / maxRevenue) * 100}`
                                    ).join(' ')}
                                />

                                {/* Data points for users */}
                                {data.map((item, index) => (
                                    <circle
                                        key={`user-${index}`}
                                        cx={(index / (data.length - 1)) * 100}
                                        cy={100 - (item.users / maxUsers) * 100}
                                        r="2"
                                        fill={isDarkMode ? '#60a5fa' : '#3b82f6'}
                                        className="hover:r-3 transition-all cursor-pointer"
                                    >
                                        <title>{`${item.month}: ${item.users} users`}</title>
                                    </circle>
                                ))}

                                {/* Data points for revenue */}
                                {data.map((item, index) => (
                                    <circle
                                        key={`revenue-${index}`}
                                        cx={(index / (data.length - 1)) * 100}
                                        cy={100 - (item.revenue / maxRevenue) * 100}
                                        r="2"
                                        fill={isDarkMode ? '#34d399' : '#10b981'}
                                        className="hover:r-3 transition-all cursor-pointer"
                                    >
                                        <title>{`${item.month}: $${item.revenue} revenue`}</title>
                                    </circle>
                                ))}
                            </svg>
                        </div>

                        {/* Month labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-between items-end h-8">
                            {data.map((item, index) => (
                                <div key={index} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                    {item.month}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart legend and stats */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Users</span>
                    </div>
                    <div className="flex items-center">
                        <div className={`w-3 h-1 mr-2 ${isDarkMode ? 'bg-green-500' : 'bg-green-600'}`} style={{ borderStyle: 'dashed', borderWidth: '1px 0' }}></div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</span>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Growth: <span className="text-green-600 font-medium">+23%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlatformChart;
