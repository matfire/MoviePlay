import {
  Client,
  Account,
  Databases,
  Avatars,
  ID,
  Query,
  Role,
  Permission,
} from "appwrite";
import { PlaylistDocument } from "./types";
const client = new Client();

client
  .setEndpoint(import.meta.env.VITE_APPWRITE_URL)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT);

const account = new Account(client);
const databases = new Databases(client);
const avatars = new Avatars(client);

const getDocuments = (collectionId: string, queries: string[]) => {
  return databases.listDocuments(
    import.meta.env.VITE_APPWRITE_DB_ID,
    collectionId,
    queries
  );
};

const getDocument = (collectionId: string, documentId: string) => {
  return databases.getDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    collectionId,
    documentId
  );
};

const createDocument = (collectionId: string, data: any, roles: any) => {
  return databases.createDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    collectionId,
    ID.unique(),
    data,
    roles
  );
};

const updateDocument = (
  collectionId: string,
  documentId: string,
  data: any
) => {
  return databases.updateDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    collectionId,
    documentId,
    data
  );
};

const deleteDocument = (collectionId: string, documentId: string) => {
  return databases.deleteDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    collectionId,
    documentId
  );
};

const updateStatistic = async (documentId: string) => {
  const user = await account.get();
  const playlist = (await getDocument(
    import.meta.env.VITE_APPWRITE_PLAYLIST_COLLECTION_ID,
    documentId
  )) as PlaylistDocument;
  const doc = await getDocuments(import.meta.env.VITE_APPWRITE_STATISTICS_ID, [
    Query.equal("playlist_id", documentId),
    Query.limit(1),
  ]);
  if (doc.documents.length > 0) {
    await updateDocument(
      import.meta.env.VITE_APPWRITE_STATISTICS_ID,
      doc.documents[0].$id,
      { views: doc.documents[0].views + 1 }
    );
  } else {
    const permissions = [Permission.update(Role.any())];
    if (playlist.private) {
      permissions.push(Permission.read(Role.user(user.$id)));
    } else {
      permissions.push(Permission.read(Role.any()));
    }
    await createDocument(
      import.meta.env.VITE_APPWRITE_STATISTICS_ID,
      { playlist_id: documentId, views: 1 },
      permissions
    );
  }
};

export {
  client,
  account,
  databases,
  avatars,
  getDocuments,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument,
  updateStatistic,
};
