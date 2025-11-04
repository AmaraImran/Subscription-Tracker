import React from 'react'

import LoginPage from './components/auth/Sign-in'
import Dashboard from './components/Dashboard'
import { Routes,Route } from 'react-router-dom'
import AddSubscription from './components/subscription/Add-subscription'
import UpdateSubscription from './components/subscription/Update-subscription'
import UserSubscriptions from './components/subscription/ShowAllsubscriptions'
import NotFound from './components/Pagenotfound'
import SignupPage from './components/auth/Sign-up'
const App = () => {
  return (

    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/signup' element={<SignupPage/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/add-subscription' element={<AddSubscription/>}/>
      <Route path='/update-subscription/:id' element={<UpdateSubscription/>}/>
      <Route path='/show-all-subscriptions' element={<UserSubscriptions/>}/>
      <Route  path='*' element={<NotFound/>}/>

    </Routes>
    
  )
}

export default App