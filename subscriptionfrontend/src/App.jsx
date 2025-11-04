import React from 'react'
import Signup from './components/auth/sign-up'
import LoginPage from './components/auth/sign-in'
import Dashboard from './components/Dashboard'
import { Routes,Route } from 'react-router-dom'
import AddSubscription from './components/subscription/Add-subscription'
import UpdateSubscription from './components/subscription/Update-subscription'
import UserSubscriptions from './components/subscription/ShowAllsubscriptions'
import NotFound from './components/Pagenotfound'
const App = () => {
  return (

    <Routes>
      <Route path='/' element={<LoginPage/>}/>
      <Route path='/signup' element={<Signup/>}/>
      <Route path='/dashboard' element={<Dashboard/>}/>
      <Route path='/add-subscription' element={<AddSubscription/>}/>
      <Route path='/update-subscription/:id' element={<UpdateSubscription/>}/>
      <Route path='/show-all-subscriptions' element={<UserSubscriptions/>}/>
      <Route  path='*' element={<NotFound/>}/>

    </Routes>
    
  )
}

export default App