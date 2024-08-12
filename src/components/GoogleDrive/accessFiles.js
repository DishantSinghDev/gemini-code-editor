import axios from 'axios';

const listDriveFiles = async (accessToken) => {
  try {
    const response = await axios.get('https://www.googleapis.com/drive/v3/files', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // List of files from the user's Google Drive
    console.log('Files:', response.data.files);

    return response.data.files;  // Return the files to use in your app
  } catch (error) {
    console.error('Error fetching files:', error);
  }
};

export default listDriveFiles;