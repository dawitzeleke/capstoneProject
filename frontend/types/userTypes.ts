export interface User {
    id: string;
    name: string;
    email: string;
    // Add other user fields here
  }
  
  export interface UserState {
    user: User | null;
    loading: boolean;
    error: string | null;
  }
  