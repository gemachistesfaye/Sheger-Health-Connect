import React from 'react';
import { 
  Shield, 
  Lock, 
  Bell, 
  Globe, 
  CreditCard, 
  Database,
  Smartphone,
  ChevronRight
} from 'lucide-react';

const AdminSettings = () => {
  const sections = [
    { title: "Security & Access", desc: "Two-factor authentication, IP whitelisting", icon: Shield, color: "text-red-500", bg: "bg-red-50" },
    { title: "Platform Branding", desc: "Logo, colors, and legal documentation", icon: Globe, color: "text-emerald-500", bg: "bg-emerald-50" },
    { title: "System Integrations", desc: "API keys for OpenAI, SMS, and Email", icon: Database, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "Billing & Subscriptions", desc: "Manage SaaS tiers and commission rates", icon: CreditCard, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "Notification Center", desc: "Broadcast alerts and system emails", icon: Bell, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-gray-500 font-medium">Configure global platform parameters and security protocols.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {sections.map((s, i) => (
          <div key={i} className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-emerald-600/5 transition-all group cursor-pointer flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className={`w-16 h-16 ${s.bg} ${s.color} rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <s.icon size={28} />
              </div>
              <div>
                <h3 className="text-lg font-black text-gray-900">{s.title}</h3>
                <p className="text-sm text-gray-400 font-medium">{s.desc}</p>
              </div>
            </div>
            <ChevronRight className="text-gray-200 group-hover:text-emerald-600 group-hover:translate-x-1 transition-all" />
          </div>
        ))}
      </div>

      {/* Danger Zone */}
      <div className="mt-12 bg-red-50/50 border border-red-100 rounded-[40px] p-10">
        <div className="flex items-center gap-4 mb-6">
           <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center text-white">
             <Lock size={20} />
           </div>
           <h3 className="text-xl font-black text-red-900">Advanced Control</h3>
        </div>
        <p className="text-red-700/70 text-sm mb-8 font-medium">Be careful. These actions are permanent and affect all users on the platform. Access requires highest clearance level.</p>
        <div className="flex flex-wrap gap-4">
           <button className="px-8 py-4 bg-white border border-red-200 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm">Maintenance Mode</button>
           <button className="px-8 py-4 bg-white border border-red-200 text-red-600 rounded-2xl font-bold hover:bg-red-600 hover:text-white transition-all shadow-sm">Export All Data</button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
