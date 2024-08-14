import Cookies from 'js-cookie';
import { signInWithGooglePopup } from '../utils/firebase.utils';

export const checkAndRefreshToken = async () => {
    const accessToken = Cookies.get('accessToken');

    if (!accessToken) {
        // If the access token is not found or has expired, re-authenticate
        return await reAuthenticateUser();
    }

    // If the access token is still valid (i.e., cookie hasn't expired)
    return true;
};

const reAuthenticateUser = async () => {
    try {
        const { accessToken } = await signInWithGooglePopup();

        if (accessToken) {
            console.log(accessToken);
            // Store the access token in a cookie
            const expiresIn = 3600; // Token validity in seconds (1 hour)
            const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);

            Cookies.set('accessToken', accessToken, { expires: expirationDate });
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error("Error during re-authentication:", error);
        return false;
    }
};
