import { checkAndRefreshToken } from "../../../utils/accessToken";
import createOrUpdateFile from "./createFiles";
import createFolder from "../useFolders/createFolder";

const fetchFileContent = async (folderName, fileName, contentFetched = () => {}, contentFetching = () => {}) => {
    const accessToken = await checkAndRefreshToken();
    if (!accessToken || !folderName) {
        console.error('Access token, file Name and folder name are required. Refresh the Page.');
        return null; // or handle it as needed
    }

    try {
        contentFetching(true);

        // Fetch folder ID based on folder name
        const folderID = await createFolder(folderName);

        console.log(`Found folder: ${folderID}`);

        // Fetch file ID based on file name within the folder
        const fileId = await createOrUpdateFile(false, folderName, fileName);


        // Request file content
        const fileContentResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Accept': 'text/plain', // Specify that we expect plain text
            },
        });

        if (!fileContentResponse.ok) {
            const errorData = await fileContentResponse.json().catch(() => ({}));
            throw new Error(`Error fetching file content: ${fileContentResponse.status} ${fileContentResponse.statusText} - ${errorData.error?.message || 'Unknown error'}`);
        }

        const content = await fileContentResponse.text(); // Directly fetch as text
        console.log('File content fetched successfully!', content);

        contentFetched(true);
        contentFetching(false);

        return content;
    } catch (error) {
        console.error('Error:', error);
        contentFetched(false);
        contentFetching(false);
        console.log('Failed to fetch file content.');
    }
};

export default fetchFileContent;
