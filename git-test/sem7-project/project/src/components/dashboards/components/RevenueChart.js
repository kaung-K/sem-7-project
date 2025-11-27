import React from 'react';

const RevenueChart = ({ data, isDarkMode }) => {
    // Find the maximum revenue to scale the chart
    const safe = Array.isArray(data) ? data : [];
    const vals = safe.map(it => Number(it.revenue) || 0);
    const maxRevenue = Math.max(1, ...(vals.length ? vals : [1])); // avoid -Infinity/0

    return (
        <div className={`rounded-xl border shadow-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} p-6`}>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        Revenue Growth
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Monthly revenue over time
                    </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                    }`}>
                    +18% Growth
                </div>
            </div>

            {/* Chart Container */}
            <div className="relative h-64">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between">
                    {[4, 3, 2, 1, 0].map(i => (
                        <div key={i} className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            ${Math.round((maxRevenue * i) / 4)}
                        </div>
                    ))}
                </div>

                {/* Chart area */}
                <div className="ml-12 mr-4 h-full">
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

                        {/* Revenue bars */}
                        <div className="absolute inset-0 flex items-end justify-between px-2">
                            {safe.map((item) => {
                                const pct = ((Number(item.revenue) || 0) / maxRevenue) * 100;
                                return (
                                    <div key={item.month} className="flex flex-col items-center h-full">
                                        {/* Bar */}
                                        <div
                                            className={`w-8 rounded-t-lg transition-all duration-500 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
                                                } hover:opacity-80 cursor-pointer relative group`}
                                            style={{ height: `${pct}%` }}
                                        >
                                            {/* Tooltip */}
                                            <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 rounded text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity ${isDarkMode ? 'bg-gray-900 text-white border border-gray-600' : 'bg-gray-800 text-white'
                                                }`}>
                                                ${Number(item.revenue) || 0}
                                            </div>
                                        </div>

                                        {/* Month label */}
                                        <div className={`mt-2 text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {item.month}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart footer with key metrics */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                        <div className={`w-3 h-3 rounded-full mr-2 ${isDarkMode ? 'bg-blue-500' : 'bg-blue-600'}`}></div>
                        <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Monthly Revenue</span>
                    </div>
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    Current: ${safe.at(-1)?.revenue || 0}
                </div>
            </div>
        </div>
    );
};

export default RevenueChart;
