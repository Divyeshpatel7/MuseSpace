import { getCurrentUser } from '@/lib/appwrite/api'
import { LocalStorageKeys } from '@/lib/react-query/QueryProvider'
import { IUser, IContextType, INITIAL_USER } from '@/types'
import { createContext, useContext, useState, useEffect, SetStateAction } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setuser: () => {},
  signOut: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
}

export const AuthContext = createContext<IContextType>(INITIAL_STATE);

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(INITIAL_USER)
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const navigate = useNavigate();
  const pathname = useLocation().pathname;

  const setuser = (user: SetStateAction<IUser>) => {
    localStorage.setItem(LocalStorageKeys.USER, JSON.stringify(user));
    setUser(user)
  }

  const signOut = () => {
    localStorage.removeItem(LocalStorageKeys.USER);
    setUser(INITIAL_USER);
    navigate('/sign-in');
  }

  useEffect(() => {
    const str = JSON.parse(localStorage.getItem(LocalStorageKeys.USER) ?? '') || INITIAL_USER;
    if (str.id) {
      setUser(str)
    }
    if (!str.id) {
      navigate('/sign-in')
    }
  }, []);

  useEffect(() => {
    if(pathname === '/sign-in' && isAuthenticated) {
      navigate('/')
    }
    if(!isAuthenticated) {
      return;
    }
    checkAuthUser();
  }, [pathname]);

  const checkAuthUser = async () => {
    // setIsLoading(true);
    try {
      const currentAccount = await getCurrentUser()

      if (currentAccount) {
        setUser({
          id: currentAccount.$id,
          name: currentAccount.name,
          username: currentAccount.username,
          email: currentAccount.email,
          imageUrl: currentAccount.imageUrl,
          bio: currentAccount.bio,
        });

        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (error) {
      console.log(error)
      return false
    } finally {
      setIsLoading(false)
    }
  };

  const value = {
    user,
    setuser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    signOut
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider;

export const useUserContext = () => useContext(AuthContext);