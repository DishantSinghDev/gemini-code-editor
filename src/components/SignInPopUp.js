import { useState, useEffect } from "react";
import { auth, signInWithGooglePopup } from "../utils/firebase.utils";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Popover, Avatar, Spinner } from "flowbite-react";
import { LogOut, Settings, User } from "lucide-react";
import Cookies from "js-cookie";

export default function SignIn({ userAuthenticated }) {
    const [user, setUser] = useState(null);
    const [signInClicked, setSignInClicked] = useState(false);
    const [image, setImage] = useState(""); // Add state for image
    const [email, setEmail] = useState(""); // Add state for email


    const logGoogleUser = async () => {
        setSignInClicked(true);
        try {
            const { accessToken, user } = await signInWithGooglePopup();
            console.log(user);
            setUser(user.user);
            setImage(user.user.photoURL);
            setEmail(user.user.email);

            if (accessToken) {
                // Store the access token in a cookie
                const expiresIn = 3200; // Token validity in seconds (1 hour)
                const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

                Cookies.set('accessToken', accessToken, { expires: expirationDate });
                userAuthenticated(true)
            }

        } catch (error) {
            userAuthenticated(false)
            console.error("Error signing in:", error);
        } finally {
            setSignInClicked(false);
        }
    };

    const logOutUser = async () => {
        await signOut(auth);
        setUser(null);
        setImage("");
        setEmail("");
        userAuthenticated(false)
        Cookies.remove('accessToken'); // Remove the token on logout
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            if (currentUser) {
                setUser(currentUser);
                setImage(currentUser.photoURL);
                setEmail(currentUser.email);
            } else {
                setUser(null);
                setImage("");
                setEmail("");
            }
        });

        return () => unsubscribe(); // Cleanup subscription on unmount
    }, []);

    return (
        <div className="absolute right-2 top-5">
            {user ? (
                <Popover
                    trigger="click"
                    placement="bottom-end"
                    content={
                        <div className="w-full rounded-md bg-white p-2 md:w-56">
                            <a
                                className={`relative flex w-full items-center justify-center md:justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100`}
                                href="/my-account"
                            >
                                <User className="h-4 w-4" />
                                <p className="text-sm">My Account</p>
                            </a>
                            <a
                                className={`relative flex w-full items-center justify-center md:justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100`}
                                href="/settings"
                            >
                                <Settings className="h-4 w-4" />
                                <p className="text-sm">Settings</p>
                            </a>
                            <button
                                className="relative flex w-full items-center justify-center md:justify-start space-x-2 rounded-md p-2 text-left text-sm transition-all duration-75 hover:bg-gray-100"
                                onClick={logOutUser}
                            >
                                {signInClicked ? (
                                    <div className="relative flex items-center justify-center">
                                        <Spinner size="sm" />
                                    </div>
                                ) : (
                                    <>
                                        <LogOut className="h-4 w-4" />
                                        <p className="text-sm">Logout</p>
                                    </>
                                )}
                            </button>
                        </div>
                    }
                >
                    <button
                        className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full border border-gray-300 transition-all duration-75 focus:outline-none active:scale-95 sm:h-9 sm:w-9"
                    >
                        <Avatar
                            img={image || `https://avatars.dicebear.com/api/micah/${email}.svg`}
                            rounded
                            alt={email}
                        />
                    </button>
                </Popover>
            ) : (
                <button
                    onClick={logGoogleUser}
                    type="button"
                    className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-full text-sm px-5 py-2.5 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
                    aria-label="SignIn"
                >
                    Sign In
                </button>
            )}
        </div>
    );
}
