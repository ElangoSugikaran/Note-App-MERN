import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/ContextProvider';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                { email, password }
            );
            if (response.data.success) {
                login(response.data.user);
                localStorage.setItem("token", response.data.token);
                toast.success("Login successful! Redirecting...");
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                toast.error(response.data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during login. Please try again later.");
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='border shadow p-6 w-80 bg-white'>
                <h2 className='text-2xl font-bold mb-4'>Login</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Email</label>
                        <input
                            type="email"
                            onChange={(e) => setEmail(e.target.value)}
                            name='email'
                            className='w-full px-3 py-2 border'
                            placeholder='Enter the Email'
                        />
                    </div>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Password</label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            name='password'
                            className='w-full px-3 py-2 border'
                            placeholder='Enter the Password'
                        />
                    </div>
                    <div className='mb-4'>
                        <button type='submit' className='w-full bg-teal-600 text-white py-2'>Login</button>
                        <p className='text-center'>Don't Have Account? <Link to="/register">Signup</Link></p>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default Login;
