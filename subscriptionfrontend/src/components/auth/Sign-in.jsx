import axios from "axios";
import React, { useState } from "react";
import BASE_URL from "../../config/Apiconfig";
import { Link, useNavigate } from "react-router-dom";
export default function LoginPage() {
  let navigate=useNavigate()
  const [formdata, setformdata] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setformdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handlesubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/auth/sign-in`, formdata, 
         
  {withCredentials: true,}
      );

      // ✅ Access data correctly
      if (response.status === 200 && response.data.success) {
        // ✅ Always access .data first
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user)); // store as string

        alert(`Successfully Logged In! Welcome ${response.data.user.name || ""}`);
       navigate('/dashboard')
      }
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-900 text-white">
      {/* Left Side - Image */}
      <div className="md:w-1/2 w-full flex items-center justify-center bg-gray-800">
        <img
          src="https://images.unsplash.com/photo-1605902711622-cfb43c4437b5?q=80&w=1920"
          alt="Login illustration"
          className="w-full h-full object-cover opacity-80"
        />
      </div>

      {/* Right Side - Form */}
      <div className="md:w-1/2 w-full flex items-center justify-center p-8">
        <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-semibold text-center mb-6">Welcome Back</h2>
          <p className="text-gray-400 text-center mb-6">
            Log in to manage your subscriptions
          </p>

          <form onSubmit={handlesubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formdata.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={formdata.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="accent-purple-600" />
                <span>Remember me</span>
              </label>
              <a href="#" className="text-purple-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
          
              type="submit"
              className="w-full mt-4 bg-purple-600 hover:bg-purple-700 transition-colors duration-300 text-white py-2 rounded-lg font-semibold"
            >
              Log In
            </button>
          </form>

          <p className="text-center text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-purple-400 hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
