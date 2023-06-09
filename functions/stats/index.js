const sdk = require("node-appwrite");

module.exports = async (req, res) => {
  const client = new sdk.Client()
    .setEndpoint(req.variables.APPWRITE_ENDPOINT)
    .setProject(req.variables.APPWRITE_FUNCTION_PROJECT_ID)
    .setKey(req.variables.APPWRITE_FUNCTION_API_KEY);
  const database = new sdk.Databases(client);
  const data = JSON.parse(req.variables.APPWRITE_FUNCTION_DATA);
  try {
    const playlist = await database.getDocument(
      req.variables.APPWRITE_DATABASE,
      req.variables.APPWRITE_PLAYLIST_COLLECTION,
      data.id
    );
    if (playlist) {
      await database.updateDocument(
        req.variables.APPWRITE_DATABASE,
        req.variables.APPWRITE_PLAYLIST_COLLECTION,
        playlist.$id,
        { views: playlist.views + 1 }
      );
      res.json({
        playlist: true,
      });
    } else {
      res.json({
        playlist: false,
      });
    }
  } catch (error) {
    res.json({
      error: error,
    });
  }
};
