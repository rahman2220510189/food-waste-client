import { useContext, useState } from "react";
import { MdEmail, MdLock } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/Provider/AuthProviders";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // State for handling Firebase/Validation errors
    const navigate = useNavigate();
    const { createUser, googleSignIn } = useContext(AuthContext);

    // Regex for strong password: at least 8 chars, 1 uppercase, 1 lowercase, 1 digit
    const isStrongPassword = (pass) => {
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass);
    }

    // Function to handle sending user data to your backend
    const storeUserInDB = async (user, providerId) => {
        const userData = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'N/A', // Display name might be null/undefined for email/password sign-ups
            photoURL: user.photoURL || 'N/A',
            providerId: providerId
        };

        try {
            await fetch('http://localhost:5000/api/users/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });
            console.log('User data sent to backend successfully');
        } catch (dbError) {
            console.error('Error storing user data in backend:', dbError);
        }
    };

    // 1. Handle Email/Password Sign Up
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(''); // Clear previous errors

        const email = e.target.email.value;
        const inputPassword = e.target.password.value; // Use inputPassword for immediate validation

        // Pre-registration password validation
        if (!isStrongPassword(inputPassword)) {
            setError('Password must be 8+ characters, contain at least one uppercase letter, one lowercase letter, and one number.');
            return;
        }

        // Firebase Registration
        createUser(email, inputPassword)
            .then(async result => {
                const loggedUser = result.user;
                console.log('Registered User:', loggedUser);

                // Store user in database after successful Firebase registration
                await storeUserInDB(loggedUser, 'password');

                // Navigate to home
                navigate('/');
            })
            .catch(firebaseError => {
                // Handle specific Firebase registration errors (e.g., email-already-in-use)
                console.error('Firebase Registration Error:', firebaseError);
                setError(firebaseError.message.replace('Firebase: Error (', '').replace(').', ''));
            });
    };

    // 2. Handle Google Sign In/Sign Up
    const handleGoogleLogin = () => {
        setError('');
        googleSignIn()
            .then(async result => {
                const loggedUser = result.user;
                console.log("Google user:", loggedUser);

                // Store user in database
                await storeUserInDB(loggedUser, 'google');

                // Navigate to home
                navigate('/');
            })
            .catch(firebaseError => {
                console.error('Google Sign-In Error:', firebaseError);
                setError(firebaseError.message.replace('Firebase: Error (', '').replace(').', ''));
            });
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-indigo-200 via-blue-100 to-blue-200 flex items-center justify-center">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-10 py-12">
                <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Sign Up</h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Email Input */}
                    <div className="relative">
                        <MdEmail className="absolute top-3.5 left-4 text-gray-400 text-xl" />
                        <input
                            type="email"
                            name="email"
                            required
                            placeholder="Email"
                            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-blue-500 text-gray-700"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="relative">
                        <MdLock className="absolute top-3.5 left-4 text-gray-400 text-xl" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                            className={`w-full pl-12 pr-12 py-3 border ${password.length > 0 ? (isStrongPassword(password) ? 'border-green-500' : 'border-red-400') : 'border-gray-300'} rounded-xl focus:outline-none text-gray-700`}
                        />
                        <div
                            className="absolute top-3.5 right-4 text-gray-500 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
                        </div>
                    </div>

                    {/* Password Strength/Hint Message */}
                    {password.length > 0 && (
                        <p className={`text-sm ${isStrongPassword(password) ? 'text-green-600' : 'text-red-500'}`}>
                            {isStrongPassword(password)
                                ? 'Strong password ✅'
                                : 'Password must be 8+ chars, contain upper/lowercase & number ❌'}
                        </p>
                    )}
                    
                    {/* General Error Message */}
                    {error && (
                        <p className="text-red-500 text-center text-sm">{error}</p>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300 font-semibold"
                    >
                        Sign Up
                    </button>
                </form>

                {/* Divider */}
                <div className="flex items-center justify-center my-4">
                    <div className="border-b border-gray-300 w-full"></div>
                    <span className="mx-3 text-gray-400 text-sm">OR</span>
                    <div className="border-b border-gray-300 w-full"></div>
                </div>

                {/* Google Login Button */}
                <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="w-full py-3 flex items-center justify-center border border-gray-300 rounded-xl hover:bg-gray-100 transition duration-200"
                >
                    <FcGoogle className="text-2xl mr-2" />
                    Continue with Google
                </button>

                {/* Log In Link */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    You have already account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-medium">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
}

export default SignUp;