export interface User {
    id: string;
    name: string;
    email: string;
    image: string; // URL or path to the user's image
    token: string; // JWT or session token
    role: string; // e.g., "student", "teacher", etc.
    // Add other user fields here
  }
  
  export interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
  }
  