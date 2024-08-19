import { checkAndRefreshToken } from '../../../utils/accessToken';
import createFolder from '../useFolders/createFolder'; // Adjust the path as necessary
import createOrUpdateFile from './createFiles';

const updateFileName = async (folderName, currentFileName, newFileName, fileNameChanged = () => { }, fileNameChanging = () => { }) => {
    const accessToken = await checkAndRefreshToken();
    
    if (!accessToken || !folderName || !currentFileName || !newFileName) {
        console.error('Access token, folder name, current file name, and new file name are required. Refresh the Page.');
        return null; // or handle it as needed
    }

    try {
        fileNameChanging(true);
        // Get the folder ID using the fetchFolder function
        const folderId = await createFolder(folderName);

        if (!folderId) {
            console.log(`Folder '${folderName}' not found.`);
            return null; // Folder not found
        }

        // Search for the file by name within the specific folder
        const fileId = await createOrUpdateFile(false, folderName, currentFileName);

        // Update the file name
        const updateResponse = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: newFileName,
            }),
        });

        if (!updateResponse.ok) {
            const errorText = await updateResponse.text();
            throw new Error(`Error updating file name: ${updateResponse.status} ${updateResponse.statusText}. ${errorText}`);
        }

        const updateData = await updateResponse.json();
        console.log(`File name updated successfully from '${currentFileName}' to '${updateData.name}'!`);
        fileNameChanged(true);
        fileNameChanging(false);
        return updateData.name; // Return the updated file name
    } catch (error) {
        fileNameChanged(false);
        fileNameChanging(false);
        console.error('Error:', error.message);
        console.log('Failed to update file name.');
        return null; // or handle it as needed
    }
};

export default updateFileName;
