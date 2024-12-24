const { Firestore } = require('@google-cloud/firestore');

async function storeData(id, data) {
    const db = new Firestore({databaseId: "cancer-prediction"});
    const predictionCollection = db.collection('predictions');
    return predictionCollection.doc(id).set(data);
}
module.exports = storeData;