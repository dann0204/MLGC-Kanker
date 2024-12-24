const crypto = require('crypto');
const predictClassification = require('../services/inferenceService');
const storeData = require('../services/storeData');
const { Firestore } = require('@google-cloud/firestore');

async function postPredictHandler(request, h) {
    const { image } = request.payload;
    if (image.hapi.headers['content-length'] > 1000000) {
        return h.response({
            status: 'fail',
            message: 'Payload content length greater than maximum allowed: 1000000'
        }).code(413);
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const model = request.server.app.model;

    try {
        const { confidence, label, suggestion } = await predictClassification(model, image._data);
        const data = { id, result: label, suggestion, createdAt };
        await storeData(id, data);

        return h.response({
            status: 'success',
            message: 'Model is predicted successfully',
            data
        }).code(201);
    } catch (error) {
        return h.response({
            status: 'fail',
            message: 'Terjadi kesalahan dalam melakukan prediksi'
        }).code(400);
    }
}

async function getPredictionHistoriesHandler(request, h) {
    const db = new Firestore({ databaseId: 'cancer-prediction' });
    const predictionCollection = db.collection('predictions');

    try {
        const predictionsSnapshot = await predictionCollection.get();

        const histories = predictionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            history: {
                id: doc.id,
                result: doc.data().result,
                suggestion: doc.data().suggestion,
                createdAt: doc.data().createdAt,
            },
        }));

        return h.response({
            status: 'success',
            data: histories,
        }).code(200);
    } catch (error) {
        console.error('Error fetching prediction histories:', error);
        return h.response({
            status: 'fail',
            message: 'Gagal mengambil data riwayat prediksi.',
        }).code(500);
    }
}

module.exports = { postPredictHandler, getPredictionHistoriesHandler };
