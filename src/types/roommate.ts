export interface Roommate {
  id: string;
  name: string;
  initials: string;
  email?: string;
  phone?: string;
  preferences?: {
    notificationTime?: string;
    preferredTone?: string;
    aiSuggestions?: boolean;
  };
} 