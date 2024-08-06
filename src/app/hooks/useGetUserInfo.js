import { useUser } from '@clerk/nextjs';

export const useGetUserInfo = () => {
  const { user } = useUser();

  if (user) {
    const name = user.firstName || user.fullName;
    const userID = user.id;
    const isAuth = true;

    return { name, userID, isAuth };
  }

  return { name: null, profilePhoto: null, userID: null, isAuth: false };
};


//   import { useEffect, useState } from 'react';

// export const useGetUserInfo = () => {
//   const [userInfo, setUserInfo] = useState({
//     name: null,
//     profilePhoto: null,
//     userID: null,
//     isSignedIn: false,
//   });

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       const auth = JSON.parse(localStorage.getItem("auth")) || {};
//       setUserInfo(auth);
//     }
//   }, []);

//   return userInfo;
// };
