import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, User, CheckCheck, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { io } from 'socket.io-client';
import api from '../lib/api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001';

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
        <p className="text-[10px] font-semibold text-emerald-600 uppercase tracking-wider mb-1.5">{message.sender_name}</p>
      )}
      <p className="text-sm font-medium leading-relaxed">{message.text}</p>
      <div className={`flex items-center gap-1.5 mt-2 ${isOwn ? 'text-white/60' : 'text-gray-500'}`}>
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
      <p className="text-xs text-emerald-700 truncate font-bold">{chat.role} {chat.specialization ? `- ${chat.specialization}` : ''}</p>
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
  const [activeTab, setActiveTab] = useState(user?.role === 'Admin' ? 'Doctor' : (user?.role === 'Doctor' ? 'Direct' : 'Patient'));
  const messagesEndRef = useRef(null);
  const activeContactIdRef = useRef(null);

  // Sync active contact ref to prevent stale closure in socket listener
  useEffect(() => {
    activeContactIdRef.current = activeContactId;
  }, [activeContactId]);

  // Initialize Socket and Fetch Contacts
  useEffect(() => {
    if (!user) return;

    // Connect to Socket.io
    const newSocket = io(SOCKET_URL);
    // Register user room with role context
    newSocket.emit('join', { userId: user.id, role: user.role });
    setSocket(newSocket);

    // Listen for incoming messages
    newSocket.on('receiveMessage', (newMessage) => {
      const activeContactId = activeContactIdRef.current;
      
      // Check if this message belongs to the currently active chat
      const isGroupMsg = Number(newMessage.receiver_id) === 0;
      const isForActiveChat = isGroupMsg 
        ? (activeContactId === 0)
        : (
            (Number(newMessage.sender_id) === Number(activeContactId) && Number(newMessage.receiver_id) === Number(user.id)) ||
            (Number(newMessage.sender_id) === Number(user.id) && Number(newMessage.receiver_id) === Number(activeContactId))
          );
        
      if (isForActiveChat) {
        setMessages(prev => {
          // Avoid duplicate messages if already present
          if (prev.some(m => m.id === newMessage.id)) return prev;
          
          return [...prev, {
            id: newMessage.id,
            text: newMessage.message,
            time: new Date(newMessage.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: newMessage.sender_id === user.id,
            sender_id: newMessage.sender_id,
            receiver_id: newMessage.receiver_id,
            status: newMessage.status || 'unread',
            sender_name: newMessage.Sender?.full_name
          }];
        });
      }
    });

    // Fetch contacts
    api.get('/api/messages/contacts')
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
            if (user?.role === 'Admin') {
              const defaultTabDocs = list.filter(c => c.role === 'Doctor');
              if (defaultTabDocs.length > 0) {
                setActiveContactId(defaultTabDocs[0].id);
              } else {
                setActiveContactId(list[0].id);
              }
            } else if (user?.role === 'Doctor') {
              const defaultTabDirects = list.filter(c => c.role === 'Patient' || c.role === 'Admin');
              if (defaultTabDirects.length > 0) {
                setActiveContactId(defaultTabDirects[0].id);
              } else {
                setActiveContactId(list[0].id);
              }
            } else {
              setActiveContactId(list[0].id);
            }
          }
        }
      });

    return () => newSocket.disconnect();
  }, [user, token]);

  // Fetch Message History when Active Contact Changes
  useEffect(() => {
    if (!user || !token || !activeContactId) return;

    // Clear messages state immediately to prevent visual flash of previous chat
    setMessages([]);

    api.get(`/api/messages/history/${activeContactId}`)
      .then(data => {
        if (data.success) {
          const formatted = data.data.map(m => ({
            id: m.id,
            text: m.message,
            time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isOwn: m.sender_id === user.id,
            sender_id: m.sender_id,
            receiver_id: m.receiver_id,
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
      receiver_id: activeContactId,
      status: 'unread'
    }]);

    // Send to backend API
    try {
      await api.post('/api/messages', {
        receiver_id: activeContactId,
        message: text
      });
    } catch (err) {
      console.error("Failed to send message", err);
    }
  };

  const activeContact = contacts.find(c => c.id === activeContactId);
  const [mobileShowChat, setMobileShowChat] = useState(false);

  const handleSelectContact = (id) => {
    setActiveContactId(id);
    setMobileShowChat(true);
  };

  return (
    <div className="h-[calc(100vh-160px)] flex gap-4 md:gap-8">
      {/* Chat Sidebar */}
      <div className={`${mobileShowChat ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden`}>
        <div className="p-8 border-b border-gray-50">
           <h2 className="text-xl font-black text-gray-900 mb-6 tracking-tight">Messages</h2>
           <div className="relative group mb-6">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-emerald-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Search contacts..." 
                className="w-full bg-gray-50 border border-gray-100 pl-12 pr-4 py-3 rounded-2xl text-sm font-medium focus:ring-2 focus:ring-emerald-500/10 outline-none transition-all"
              />
           </div>

            {user?.role === 'Admin' && (
             <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
               <button
                 onClick={() => {
                   setActiveTab('Doctor');
                   const docs = contacts.filter(c => c.role === 'Doctor');
                   if (docs.length > 0) setActiveContactId(docs[0].id);
                 }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'Doctor' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
               >
                 Doctors
               </button>
               <button
                 onClick={() => {
                   setActiveTab('Patient');
                   const pats = contacts.filter(c => c.role === 'Patient');
                   if (pats.length > 0) setActiveContactId(pats[0].id);
                 }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'Patient' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
               >
                 Patients
               </button>
             </div>
           )}

           {user?.role === 'Doctor' && (
             <div className="flex gap-2 bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
               <button
                 onClick={() => {
                   setActiveTab('Direct');
                   const directs = contacts.filter(c => c.role === 'Patient' || c.role === 'Admin');
                   if (directs.length > 0) setActiveContactId(directs[0].id);
                 }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'Direct' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
               >
                 Direct Chats
               </button>
               <button
                 onClick={() => {
                   setActiveTab('Staff Group');
                   const groups = contacts.filter(c => c.role === 'Staff Group');
                   if (groups.length > 0) setActiveContactId(groups[0].id);
                 }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'Staff Group' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
               >
                 Clinical Groups
               </button>
             </div>
           )}
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 no-scrollbar">
           {(() => {
             const filtered = contacts.filter(c => {
               if (user?.role === 'Patient') return true;
               if (user?.role === 'Admin') return c.role === activeTab;
               if (user?.role === 'Doctor') {
                 if (activeTab === 'Direct') return c.role === 'Patient' || c.role === 'Admin';
                 return c.role === activeTab;
               }
               return true;
             });
             
             if (filtered.length === 0) {
               return <div className="text-center text-gray-500 p-4 text-sm font-medium">No contacts found.</div>;
             }
             
              return filtered.map((contact) => (
                <ChatSidebarItem 
                   key={contact.id} 
                   chat={contact} 
                   isActive={activeContactId === contact.id}
                   onClick={() => handleSelectContact(contact.id)}
                />
              ));
           })()}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className={`${!mobileShowChat ? 'hidden md:flex' : 'flex'} flex-1 flex-col bg-white rounded-[40px] border border-gray-100 shadow-sm overflow-hidden relative`}>
         {/* Chat Header */}
         {activeContact ? (
           <div className="p-4 md:p-6 border-b border-gray-50 flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-3 md:gap-4">
                 <button 
                   onClick={() => setMobileShowChat(false)} 
                   className="p-2 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors md:hidden focus:outline-none focus:ring-2 focus:ring-emerald-500"
                   aria-label="Back to contacts"
                 >
                   &larr;
                 </button>
                 <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center font-bold">
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
                   <button className="p-3 text-gray-500 hover:bg-gray-50 hover:text-emerald-600 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1" aria-label="Voice call">
                     <Phone size={20} aria-hidden="true" />
                  </button>
                   <button className="p-3 text-gray-500 hover:bg-gray-50 hover:text-emerald-600 rounded-2xl transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1" aria-label="Video call">
                     <Video size={20} aria-hidden="true" />
                  </button>
               </div>
           </div>
         ) : (
            <div className="p-6 border-b border-gray-50 text-center text-gray-500 font-medium">Select a contact to start messaging</div>
         )}

         {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30 no-scrollbar" aria-live="polite" aria-label="Message history">
            {(() => {
                const displayMessages = messages.filter(msg => {
                   if (Number(activeContactId) === 0) {
                     return Number(msg.receiver_id) === 0;
                   } else {
                     return (
                       (Number(msg.sender_id) === Number(user.id) && Number(msg.receiver_id) === Number(activeContactId)) ||
                       (Number(msg.sender_id) === Number(activeContactId) && Number(msg.receiver_id) === Number(user.id))
                     );
                   }
                });
                return (
                  <>
                    {displayMessages.map((msg) => (
                      <MessageBubble key={msg.id} message={msg} isOwn={msg.isOwn} />
                    ))}
                    {displayMessages.length === 0 && activeContact && (
                       <div className="text-center text-gray-500 mt-10 font-medium">No messages yet. Send a message to start the conversation!</div>
                    )}
                  </>
                );
             })()}
            <div ref={messagesEndRef} />
         </div>

         {/* Chat Input */}
         <div className="p-8 border-t border-gray-50 bg-white">
             <form onSubmit={handleSend} className="flex items-center gap-2 md:gap-4 bg-gray-50 p-2 rounded-[24px] border border-gray-100 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                 <button type="button" className="p-3 text-gray-500 hover:text-emerald-600 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1 rounded-xl" aria-label="Attach file">
                   <Paperclip size={20} aria-hidden="true" />
                </button>
                <input 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={!activeContactId}
                  placeholder={activeContactId ? `Type your message...` : "Select a contact first"}
                  className="flex-1 bg-transparent border-none outline-none px-2 text-sm font-medium disabled:opacity-50"
                  aria-label="Type your message"
                />
                <button 
                  type="submit" 
                  disabled={!input.trim() || !activeContactId}
                  className="w-12 h-12 bg-emerald-600 text-white rounded-2xl shadow-lg shadow-emerald-600/20 disabled:opacity-50 hover:scale-105 transition-transform flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  aria-label="Send message"
                >
                   <Send size={20} aria-hidden="true" />
                </button>
             </form>
         </div>
      </div>
    </div>
  );
};

export default MessagesPage;
