// Assuming fetchFolder is already implemented and returns the folder ID based on the folder name
import { checkAndRefreshToken } from '../../../utils/accessToken';
import createOrUpdateFile from './createFiles';
import createFolder from '../useFolders/createFolder'; // Adjust the path as necessary

const fetchAllFileNames = async (folderName="GeminiIDE", fileFetched= () => {}, fileFetching= () => {}) => {
    const accessToken = await checkAndRefreshToken();
    if (!accessToken || !folderName) {
        console.error('Access token and folder name are required. Refresh the Page.');
        return null; // or handle it as needed
    }

    try {
        fileFetching(true);
        // Get the folder ID using the fetchFolder function
        const folderId = await createFolder(folderName);

        if (!folderId) {
            console.log(`Folder '${folderName}' not found.`);
            return null; // Folder not found
        }

        // Search for all files within the specific folder
        const searchResponse = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&fields=files(name)`,
            {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
            }
        );

        if (!searchResponse.ok) {
            const errorText = await searchResponse.text();
            throw new Error(`Error fetching files: ${searchResponse.status} ${searchResponse.statusText}. ${errorText}`);
        }

        const searchData = await searchResponse.json();

        if (searchData.files.length === 0) {
            console.log(`No files found in folder '${folderId}'.searchData`,searchData);
            const fileId = await createOrUpdateFile(false, folderName, "index.js");
            console.log(`File ID: ${fileId}`);
            if(fileId){
                fileFetched(true);
                fileFetching(false);
                
                return ["index.js"]; // No files found
            } else {
                fileFetched(false);
                fileFetching(false);
                return null;
            }
        }

        // Extract file names from the response
        const fileNames = searchData.files.map(file => file.name);
        console.log(`Files in folder '${folderName}':`, fileNames);
        fileFetched(true);
        fileFetching(false);
        return fileNames; // Return the array of file names
    } catch (error) {
        console.error('Error:', error.message);
        fileFetching(false);
        fileFetched(false);
        console.log('Failed to fetch file names.');
        return null; // or handle it as needed
    }
};

export default fetchAllFileNames;
