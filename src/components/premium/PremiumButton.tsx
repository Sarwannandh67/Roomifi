import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface PremiumButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
}

export const PremiumButton: React.FC<PremiumButtonProps> = ({ 
  variant = 'default',
  size = 'default',
  className = ''
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isPremium, setIsPremium] = React.useState<boolean>(false);
  
  React.useEffect(() => {
    const checkPremiumStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_premium')
          .eq('id', user.id)
          .single();
          
        if (error) {
          console.error('Error checking premium status:', error);
          return;
        }
        
        setIsPremium(data?.is_premium || false);
      } catch (err) {
        console.error('Unexpected error checking premium status:', err);
      }
    };
    
    checkPremiumStatus();
  }, [user]);
  
  const handleClick = () => {
    if (isPremium) {
      toast.info('You already have premium access!');
      return;
    }
    
    navigate('/subscription');
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`group ${isPremium ? 'bg-gradient-to-r from-amber-500 to-purple-600 hover:from-amber-600 hover:to-purple-700' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'} text-white ${className}`}
    >
      <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
      <span>{isPremium ? 'Premium Active' : 'Upgrade to Premium'}</span>
    </Button>
  );
};

export default PremiumButton;
