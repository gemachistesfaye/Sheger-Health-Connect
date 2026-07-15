import React, { memo } from 'react';
import { motion } from 'framer-motion';

const colorMap = {
  'bg-emerald-500': { iconBg: 'bg-emerald-50 text-emerald-600', bar: 'bg-emerald-500' },
  'bg-blue-500': { iconBg: 'bg-blue-50 text-blue-600', bar: 'bg-blue-500' },
  'bg-purple-500': { iconBg: 'bg-purple-50 text-purple-600', bar: 'bg-purple-500' },
  'bg-orange-500': { iconBg: 'bg-orange-50 text-orange-600', bar: 'bg-orange-500' },
  'bg-primary': { iconBg: 'bg-primary/10 text-primary', bar: 'bg-primary' },
  'bg-red-500': { iconBg: 'bg-red-50 text-red-600', bar: 'bg-red-500' },
};

const StatCard = memo(({ title, value, subtext, icon: Icon, color, trend }) => {
  const mapped = colorMap[color] || { iconBg: 'bg-gray-50 text-gray-600', bar: 'bg-gray-500' };
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all"
      role="article"
      aria-label={`${title}: ${value}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-2xl ${mapped.iconBg}`}>
          <Icon size={24} />
        </div>
        {trend && (
          <span className={`text-xs font-bold px-2 py-1 rounded-full ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
        )}
      </div>
      <div className="flex flex-col">
        <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-gray-900">{value}</span>
          {subtext && <span className="text-xs text-gray-500 font-medium">{subtext}</span>}
        </div>
      </div>
      <div className="mt-4 h-1 bg-gray-50 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: '70%' }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${mapped.bar}`}
        />
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
