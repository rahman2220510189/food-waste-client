import { useContext, useState } from "react";
import { MdEmail, MdLock } from 'react-icons/md';
import { FcGoogle } from 'react-icons/fc';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../firebase/Provider/AuthProviders";


const LogIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const { signIn, googleSignIn } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    console.log(email, password);

    if (!isStrongPassword(password)) {
      setErrorMessage('Invalid password. Please try again.');
      return;
    }
    signIn(email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
        setErrorMessage(' ')
        navigate('/')
      });

  };
  const handleGoogleLogin = () => {
    googleSignIn()
      .then(result => {
        const loggedUser = result.user;
        console.log("Google user:", loggedUser);
        navigate('/');
      })

  }

  const isStrongPassword = (pass) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pass);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-200 via-blue-100 to-blue-200 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl px-10 py-12">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">Login</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
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

          {/* Password */}
          <div className="relative">
            <MdLock className="absolute top-3.5 left-4 text-gray-400 text-xl" />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none text-gray-700"
            />
            <div
              className="absolute top-3.5 right-4 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
            </div>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <p className="text-red-500 text-sm text-center">{errorMessage}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition duration-300 font-semibold"
          >
            Login
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center justify-center my-4">
          <div className="border-b border-gray-300 w-full"></div>
          <span className="mx-3 text-gray-400 text-sm">OR</span>
          <div className="border-b border-gray-300 w-full"></div>
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full py-3 flex items-center justify-center border border-gray-300 rounded-xl hover:bg-gray-100 transition duration-200"
        >
          <FcGoogle className="text-2xl mr-2" />
          Continue with Google
        </button>

        {/* Sign Up Link */}
        <p className="text-center text-sm text-gray-600 mt-6">
          You have no account?{' '}
          <Link to="/signup" className="text-blue-600 hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LogIn;