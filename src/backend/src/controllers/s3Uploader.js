const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

// Configura tus credenciales de AWS

AWS.config.update({
    accessKeyId: 'AKIAW3MECZWZTIQCD7EP',
    secretAccessKey: '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',
    region: 'sa-east-1'
});

const s3 = new AWS.S3();

const uploadImageToS3 = async (imageBuffer, imageName) => {
    const fileExtension = path.extname(imageName);
    const s3Key = `${uuidv4()}${fileExtension}`;

    const params = {
        Bucket: 'iblog-archivos',
        Key: s3Key,
        Body: imageBuffer,
        ACL: 'public-read',
        ContentType: `image/${fileExtension.substring(1)}`
    };

    try {
        const data = await s3.upload(params).promise();
        return data.Location;  // URL de la imagen en S3
    } catch (error) {
        console.error('Error uploading image to S3:', error);
        throw new Error('Error uploading image');
    }
};

module.exports = { uploadImageToS3 };
