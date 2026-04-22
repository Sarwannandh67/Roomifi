import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { useAuth } from '@/context/AuthContext';

interface Message {
  id: string;
  content: string;
  sender: string;
  room_id: string;
  created_at: string;
}

const GroupChat: React.FC = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [rooms, setRooms] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  // Fetch available rooms
  useEffect(() => {
    const fetchRooms = async () => {
      const { data, error } = await supabase
        .from('rooms')
        .select('id, name')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching rooms:', error);
      } else if (data && data.length > 0) {
        setRooms(data);
        // Select the first room by default
        if (!selectedRoom) {
          setSelectedRoom(data[0].id);
        }
      }
    };

    fetchRooms();
  }, [selectedRoom]);

  // Fetch messages for the selected room
  useEffect(() => {
    if (!selectedRoom) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', selectedRoom)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
      } else {
        setMessages(data || []);
      }
      setLoading(false);
    };

    fetchMessages();

    // Set up real-time subscription for the selected room
    const subscription = supabase
      .channel(`room:${selectedRoom}`)
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'messages',
        filter: `room_id=eq.${selectedRoom}`
      }, (payload) => {
        setMessages(prevMessages => [...prevMessages, payload.new as Message]);
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [selectedRoom]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user || !selectedRoom) return;

    const newMsg = {
      content: newMessage,
      sender: user.email || user.id,
      room_id: selectedRoom,
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase.from('messages').insert([newMsg]);

    if (error) {
      console.error('Error sending message:', error);
    } else {
      setNewMessage('');
    }
  };

  const handleRoomChange = (roomId: string) => {
    setSelectedRoom(roomId);
    setLoading(true);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-indigo-600">Roommate Group Chat</h1>
        
        {/* Room selector */}
        <div className="mt-2 flex flex-wrap gap-2">
          {rooms.map(room => (
            <button
              key={room.id}
              onClick={() => handleRoomChange(room.id)}
              className={`px-3 py-1 text-sm rounded-full transition ${selectedRoom === room.id 
                ? 'bg-indigo-600 text-white' 
                : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            >
              {room.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 my-8">
            No messages yet. Be the first to say hello!
          </div>
        ) : (
          messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === (user?.email || user?.id) ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${message.sender === (user?.email || user?.id) 
                  ? 'bg-indigo-500 text-white rounded-br-none' 
                  : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}
              >
                <div className="font-semibold text-sm">
                  {message.sender === (user?.email || user?.id) ? 'You' : message.sender}
                </div>
                <div>{message.content}</div>
                <div className="text-xs opacity-70 text-right">
                  {new Date(message.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
          <button 
            type="submit" 
            disabled={!newMessage.trim()}
            className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default GroupChat;
