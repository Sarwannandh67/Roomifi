import React, { useEffect } from 'react';
import GroupChat from './GroupChat';
import { useNavigate } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';

const GroupChatPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);

  // Add a 2-second delay for page transition with loading screen
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen message="Loading group chat..." />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <GroupChat />
    </div>
  );
};

export default GroupChatPage;
