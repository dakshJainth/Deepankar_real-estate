import { GoogleAuthProvider, getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInFailure, signInSuccess } from "../redux/user/userSlice";
import {useNavigate} from "react-router-dom";

const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async (e) => {
    e.preventDefault();
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);

      const result = await signInWithPopup(auth, provider);
      console.log(result);

      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });

      const data = await res.json();

      if(data.success === false){
        console.log(data.message);
      }
      dispatch(signInSuccess(data));
      navigate('/');
    } catch (error) {
      console.log("could not signnin with google", error);
    }
  };
  return (
    <button
      onClick={handleGoogleClick}
      className="bg-red-700 p-3 text-white rounded-lg hover:opacity-90"
    >
      CONTINUE WITH GOOGLE
    </button>
  );
};

export default OAuth;
