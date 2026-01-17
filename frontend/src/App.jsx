import React, { useContext } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'

import LeadsList from './pages/LeadsList'
import LeadDetails from './pages/LeadDetails'
import { UserDataContext } from './context/UserContext'



const App = () => {
  const  {userData, setUserData,loading} = useContext(UserDataContext);

   if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/leads" />} />

      <Route path="/signup" element={ userData ? <Navigate to="/leads" /> : <Signup />} />
      <Route path="/login" element={ userData ? <Navigate to="/leads" /> : <Login />} />
      <Route path="/leads" element={userData ? <LeadsList /> : <Navigate to="/login" />} />
      <Route path="/leads/:id" element={userData ? <LeadDetails /> : <Navigate to="/login" />} />
    </Routes>
  )
}

export default App