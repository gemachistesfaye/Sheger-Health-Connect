import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, User, CheckCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const MessageBubble = ({ message, isOwn }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 10 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-4`}
  >
    <div className={`max-w-[70%] p-4 rounded-[24px] ${
      isOwn 
        ? 'bg-emerald-600 text-white rounded-tr-none shadow-lg shadow-emerald-600/10' 
        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100 shadow-sm'
    }`}>
      {!isOwn && message.sender_name && (
        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">{message.sender_name}</p>
      )}
      <p className="text-sm font-medium leading-relaxed">{message.text}</p>
      <div className={`flex items-center gap-1.5 mt-2 ${isOwn ? 'text-white/60' : 'text-gray-400'}`}>
        <span className="text-[10px] font-bold uppercase">{message.time}</span>
        {isOwn && (
          message.status === 'read'
            ? <CheckCheck size={14} className="text-sky-300" /> // Telegram-style double tick for read
            : <Check size={14} className="text-white/60" /> // Single tick for unread/sent
        )}
      </div>
    </div>
  </motion.div>
);

const ChatSidebarItem = ({ chat, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full p-4 rounded-[24px] flex items-center gap-4 transition-all duration-300
      ${isActive ? 'bg-emerald-50 border border-emerald-100' : 'hover:bg-gray-50'}
    `}
  >
    <div className="relative">
      <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-lg">
        {chat.full_name.charAt(0)}
      </div>
    </div>
    <div className="flex-1 text-left overflow-hidden">
      <div className="flex justify-between items-center mb-1">
        <h4 className="font-bold text-gray-900 text-sm truncate">{chat.full_name}</h4>
      </div>
      <p className="text-xs text-emerald-600 truncate font-bold">{chat.role} {chat.specialization ? `- ${chat.specialization}` : ''}</p>
    </div>
  </button>
);

const MessagesPage = () => {
  const { user, token } = useAuth();
  const [contacts, setContacts] = useState([]);
  const [activeContactId, setActiveContactId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  // Initialize Socket and Fetch Contacts
  useEffect(() => {
    if (!user) return;

    // Connect to Socket.io
    const newSocket = io(API_URL);
    // Register user room with role context
    newSocket.emit('join', { userId: user.id, role: user.role });
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on('receiveMessage', (newMessage) => {
      // If the message is from the currently active contact, append it
      setMessages(prev => {
        // We only append if it's relevant to the current chat room we have open.
        // Actually, let's just re-fetch or append directly if it matches.
        return [...prev, {
          id: newMessage.id,
          text: newMessage.message,
          time: new Date(newMessage.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          isOwn: newMessage.sender_id === user.id,
          sender_id: newMessage.sender_id,
          status: newMessage.status || 'unread',
          sender_name: newMessage.Sender?.full_name
        }];
      });
    });

    // Fetch contacts
    fetch(`${API_URL}/api/messages/contacts`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          let list = data.data;
          if (user?.role === 'Doctor') {
            const staffChat = {
              id: 0,
              full_name: 'Clinical Staff Room (Group)',
              role: 'Staff Group',
              specialization: 'Doctors Only'
            };
            list = [staffChat, ...list];
          }
          setContacts(list);
          if (list.length > 0 && !activeContactId) {
            setActiveContactId(list[0].id);
          }
        }
      });

    return () => newSocket.disconnect();
  }, [user, token]);

  // Fetch Message History when Active Contact Changes
  useEffect(() => {
    if (!user || !token || !activeContactId) return;

    fetch(`${API_URL}/api/messages/history/${activeContactId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          const formatted = data.data.map(m => ({
            id: m.id,
            text: m.message,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: m.sender_id === user.id,
            sender_id: m.sender_id,
            status: m.status,
            sender_name: m.Sender?.full_name
          }));
          setMessages(formatted);
        }
      });
  }, [activeContactId, user, token]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || !activeContactId) return;
    
    const text = input;
    setInput('');

    // Optimistically add to UI
    const tempId = Date.now();
    setMessages(prev => [...prev, {
      id: tempId,
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
      sender_id: user.id,
      status: 'unread'
    }]);

    // Send to backend API
    try {
      await fetch(`${API_URL}/api/messages`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          receiver_id: activeContactId,
          message: text
        })
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const activeContact = contacts.find(c => c.id === activeContactId);

  return (
    <div className="h-[calc(100vh-160px)] flex gap-8">
      {/* Chat Sidebar */}
      <div className="w-80 flex flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-gray-50">
           <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Messages</h2>
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                className="w-full bg-gray-50 border border-gray-100 pl-12 pr-4 py-3 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
              />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
           {contacts.length === 0 ? (
             <div className="text-center text-gray-400 p-4 text-sm font-medium">No contacts found.</div>
           ) : (
             contacts.map((contact) => (
               <ChatSidebarItem 
                  key={contact.id} 
                  chat={contact} 
                  isActive={activeContactId === contact.id}
                  onClick={() => setActiveContactId(contact.id)}
               />
             ))
           )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden relative">
         {/* Chat Header */}
         {activeContact ? (
           <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
                    {activeContact.full_name.charAt(0)}
                 </div>
                 <div>
                    <h3 className="font-black text-gray-900 leading-none mb-1">{activeContact.full_name}</h3>
                    <div className="flex items-center gap-1.5">
                       <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                         {activeContact.role}
                       </span>
                    </div>
                 </div>
              </div>
              <div className="flex items-center gap-2">
                 <button className="p-3 text-gray-400 hover:bg-gray-50 hover:text-emerald-600 rounded-2xl transition-all">
                    <Phone size={20} />
                 </button>
                 <button className="p-3 text-gray-400 hover:bg-gray-50 hover:text-emerald-600 rounded-2xl transition-all">
                    <Video size={20} />
                 </button>
              </div>
           </div>
         ) : (
           <div className="p-6 border-b border-gray-50 text-center text-gray-400 font-medium">Select a contact to start messaging</div>
         )}

         {/* Messages Area */}
         <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 no-scrollbar">
            {messages.filter(m => m.isOwn || m.sender_id === activeContactId).map((msg) => (
              <MessageBubble key={msg.id} message={msg} isOwn={msg.isOwn} />
            ))}
            {messages.length === 0 && activeContact && (
              <div className="text-center text-gray-400 mt-10 font-medium">No messages yet. Send a message to start the conversation!</div>
            )}
            <div ref={messagesEndRef} />
         </div>

         {/* Chat Input */}
         <div className="p-8 border-t border-gray-50 bg-white">
            <form onSubmit={handleSend} className="flex items-center gap-4 bg-gray-50 p-2 rounded-[24px] border border-gray-100 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
               <button type="button" className="p-3 text-gray-400 hover:text-emerald-600 transition-colors">
                  <Paperclip size={20} />
               </button>
               <input 
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 disabled={!activeContactId}
                 placeholder={activeContactId ? `Type your message to ${activeContact?.full_name}...` : "Select a contact first"}
                 className="flex-1 bg-transparent border-none outline-none px-2 text-sm font-medium disabled:opacity-50"
               />
               <button 
                 type="submit" 
                 disabled={!input.trim() || !activeContactId}
                 className="w-12 h-12 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 hover:scale-105 transition-transform flex items-center justify-center"
               >
                  <Send size={20} />
               </button>
            </form>
         </div>
      </div>
    </div>
  );
};

export default MessagesPage;
