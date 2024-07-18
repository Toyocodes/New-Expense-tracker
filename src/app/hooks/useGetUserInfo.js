// export const useGetUserInfo = () => {
//     const { name, profilePhoto, userID, isAuth } =
//       JSON.parse(localStorage.getItem("auth")) || {};
  
//     return { name, profilePhoto, userID, isAuth };
//   };


  import { useEffect, useState } from 'react';

export const useGetUserInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: null,
    profilePhoto: null,
    userID: null,
    isAuth: false,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const auth = JSON.parse(localStorage.getItem("auth")) || {};
      setUserInfo(auth);
    }
  }, []);

  return userInfo;
};
