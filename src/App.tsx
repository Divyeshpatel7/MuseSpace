import { Routes, Route, Navigate } from 'react-router-dom';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from './_root/pages';
import RootLayout from './_root/RootLayout';
import AuthLayout from './_auth/AuthLayout';
import './globals.css';

import { Toaster } from "@/components/ui/toaster"
import { useUserContext } from './context/AuthContext';


const App = () => {
  const authContext = useUserContext();
  const Redirect = <Navigate to="/sign-in"/>
  return (
    <main className='flex h-screen'>
      <Routes>
          {/* public routes */}
          <Route element={<AuthLayout />}>
            <Route path='/sign-in' element={<SigninForm />} />
            <Route path='/sign-up' element={!authContext.user.id ? <SignupForm/> : Redirect} />
          </Route>
          
          {/* Private routes */}
          <Route element={<RootLayout />}>
            <Route index element={authContext.user.id ? <Home /> : Redirect} /> 
            <Route path='/explore' element={authContext.user.id ? <Explore /> : Redirect} />
            <Route path='/saved' element={authContext.user.id ? <Saved /> : Redirect} />
            <Route path='/all-users' element={authContext.user.id ? <AllUsers /> : Redirect} />
            <Route path='/create-post' element={authContext.user.id ? <CreatePost /> : Redirect} />
            <Route path='/update-post/:id' element={authContext.user.id ?<EditPost /> : Redirect} />
            <Route path='/post/:id' element={authContext.user.id ? <PostDetails /> : Redirect} />
            <Route path='/profile/:id/*' element={authContext.user.id ? <Profile />: Redirect} />
            <Route path='/update-profile/:id' element={authContext.user.id ? <UpdateProfile /> : Redirect} />
          </Route>
      </Routes>
      <Toaster />
    </main>
  )
}

export default App