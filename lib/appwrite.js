import { Account, Client, ID } from 'react-native-appwrite';

export const appwriteConfig = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.alepan.vidai',
    projectId: '67ad8ff100345ed9b828',
    databaseId: '67adb8fb0025ab866bf4',
    userCollectionId: '67adb9940005e9802876',
    videoCollectionId: '67aed8e000223ee009d0',
    storageId: '67aedc5a001ffb704ea3'
}


// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
    ;

// initialize Account instance
const account = new Account(client);

export const createUser = () => {
    // Register User
    account.create(ID.unique(), 'me@example.com', 'password', 'Jane Doe')
        .then(function (response) {
            console.log(response);
        }, function (error) {
            console.log(error);
        });
}