import React, { useState } from 'react';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/register",
                { name, email, password }
            );
            if (response.data.success) {
                toast.success("Signup successful! Redirecting to login...");
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                toast.error(response.data.message || "Signup failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            toast.error("An error occurred during signup. Please try again later.");
        }
    };

    return (
        <div className='flex justify-center items-center min-h-screen bg-gray-100'>
            <div className='border shadow p-6 w-80 bg-white'>
                <h2 className='text-2xl font-bold mb-4'>Sign-up</h2>
                <form onSubmit={handleSubmit}>
                    <div className='mb-4'>
                        <label className='block text-gray-700'>Name</label>
                        <input
                            type="text"
                            onChange={(e) => setName(e.target.value)}
                            name='name'
                            className='w-full px-3 py-2 border'
                            placeholder='Enter the Name'
                        />
                    </div>
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
                        <button type='submit' className='w-full bg-teal-600 text-white py-2'>Signup</button>
                        <p className='text-center'>Already Have Account? <Link to="/login">Login</Link></p>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Signup;
