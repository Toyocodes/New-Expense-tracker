"use client";

import { useEffect, useState } from 'react';
import toast from "react-hot-toast";
import { useGetUserInfo } from "./hooks/useGetUserInfo";
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { SignInButton, useUser } from '@clerk/nextjs';

const Home = () => {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { name, profilePhoto, userID } = useGetUserInfo();
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    if (isSignedIn) {
      const authInfo = {
        userID,
        name,
        profilePhoto,
        isSignedIn: true,
      };
      localStorage.setItem('auth', JSON.stringify(authInfo));
      router.push('/expense-tracker');
      toast.success('Signed in successfully');
    } else {
      setIsLoading(false); 
    }
  }, [isSignedIn, name, profilePhoto, userID, router]);

  const handleSignInClick = () => {
    setIsLoading(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-blue-500">
        <p className="text-white text-xl">Loading...</p>
      </div>
    ); 
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-blue-500">
      <div className="flex flex-col items-center">
        <Image
          src="/hero.png"
          alt="hero image"
          width={100}
          height={100}
          unoptimized
          priority={true}
          className="w-full max-w-xs md:max-w-lg"
        />
        <div className="text-center mb-8">
          <p className="text-xl md:text-2xl 2xl:text-3xl mb-3 text-white">
            Want to track your finance? 😊
          </p>
          <div className='bg-white text-black rounded-2xl p-2 text-lg hover:bg-purple-300 cursor-pointer'>
            <SignInButton onClick={handleSignInClick} >
              {isLoading ? 'Signing in...' : 'Sign In With Google'}
            </SignInButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
