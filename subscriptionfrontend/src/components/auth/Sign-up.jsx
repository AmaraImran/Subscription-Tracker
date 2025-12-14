
import React, { useState } from "react";
import api from "../../config/AxiosInstance";
import { Link, useNavigate } from "react-router-dom";
export default function SignupPage() {
    const navigate=useNavigate()
const [formdata,setformdata]=useState({
    fullname:"",
    email:"",
    password:""
})

const handleChange=(e)=>{
    setformdata({...formdata,[e.target.name]:e.target.value})
}
const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
     const res =await api.post(`/auth/sign-up`,
        formdata,
     { withCredentials: true } )
console.log(res.data);
      alert(" successfuly Registered!");
      navigate("/")


    } catch (err) {
         console.error(err.response?.data || err.message);
      alert(`${err.message}`);
    }
}

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white">
      {/* Left Side - Image */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-800">
        <img
          src="https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170"
          alt="Signup illustration"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Create an Account
          </h2>

          <form className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2 ">Full Name</label>
              <input
                type="text"
                name="fullname"

                value={formdata.fullname}
                onChange={handleChange}
            
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formdata.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-full  bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
              value={formdata.password}
                type="password"
                onChange={handleChange}
                name="password"
                placeholder="Enter your password"
                className="w-full px-4 py-3 rounded-3xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
            onClick={handleSubmit}
              type="submit"
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 transition-colors duration-300 text-white py-3 rounded-3xl font-semibold"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Already have an account?{" "}
            <Link to="/" className="text-purple-400 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
