// Mock user type to match what we'd expect from a real auth service
export interface User {
  id: string;
  email: string;
  created_at: string;
}

class MockAuthService {
  private static instance: MockAuthService;
  private currentUser: User | null = null;
  private listeners: ((user: User | null) => void)[] = [];

  private constructor() {
    // Check for existing session in localStorage
    const savedUser = localStorage.getItem('mock_user');
    if (savedUser) {
      this.currentUser = JSON.parse(savedUser);
    }
  }

  public static getInstance(): MockAuthService {
    if (!MockAuthService.instance) {
      MockAuthService.instance = new MockAuthService();
    }
    return MockAuthService.instance;
  }

  async signIn(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Accept any non-empty email/password
    if (email && password) {
      const user: User = {
        id: 'mock-user-' + Math.random().toString(36).substr(2, 9),
        email,
        created_at: new Date().toISOString(),
      };
      
      this.currentUser = user;
      localStorage.setItem('mock_user', JSON.stringify(user));
      this.notifyListeners(user);
      
      return { user, error: null };
    }

    return {
      user: null,
      error: new Error('Invalid credentials'),
    };
  }

  async signUp(email: string, password: string): Promise<{ user: User | null; error: Error | null }> {
    return this.signIn(email, password);
  }

  async signOut(): Promise<{ error: Error | null }> {
    this.currentUser = null;
    localStorage.removeItem('mock_user');
    this.notifyListeners(null);
    return { error: null };
  }

  onAuthStateChange(callback: (user: User | null) => void): { unsubscribe: () => void } {
    this.listeners.push(callback);
    
    // Initial call with current state
    callback(this.currentUser);

    return {
      unsubscribe: () => {
        this.listeners = this.listeners.filter(listener => listener !== callback);
      }
    };
  }

  private notifyListeners(user: User | null) {
    this.listeners.forEach(listener => listener(user));
  }

  getUser(): User | null {
    return this.currentUser;
  }
}

export const auth = MockAuthService.getInstance();