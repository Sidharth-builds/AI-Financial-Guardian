import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";

function Accounts() {

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      console.log("Google user:", user);
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div>
      <button onClick={handleGoogleLogin}>
        Continue with Google
      </button>
    </div>
  );
}

export default Accounts;