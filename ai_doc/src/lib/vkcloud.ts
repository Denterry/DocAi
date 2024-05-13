import AWS, { Endpoint } from 'aws-sdk'

export async function uploadToVk(file: File) {
    try {
        AWS.config.update ({
            accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY,
        });
        const s3 = new AWS.S3({
            params: {
                Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAM,
                Endpoint: process.env.NEXT_PUBLIC_VK_CLOUD_ENDPOINT
            },
            region: 'ru-msk',
            endpoint: process.env.NEXT_PUBLIC_VK_CLOUD_ENDPOINT,
        });

        const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-');

        const params = {
            Bucket: process.env.NEXT_PUBLIC_AWS_BUCKET_NAME!,
            Key: file_key,
            Body: file,
            ACL: 'public-read'
        }
        console.log('we are here')
        const upload = s3.putObject(params).on('httpUploadProgress', evt => {
            console.log('uploading to s3...', parseInt(((evt.loaded*100)/evt.total).toString())) + '%'
        }).promise();

        const url = await s3.getSignedUrl('putObject', params);

        console.log('we are here')

        await upload.then(data => {
            console.log('successfully uploaded to S3!', file_key);
        });

        console.log('we are here')

        return Promise.resolve({
            file_key,
            file_name: file.name,
            url,
        });
    } catch (error) {}
}

export function getVkUrl(file_key: string) {
    const url = `https://${process.env.NEXT_PUBLIC_AWS_BUCKET_NAME}.hb.ru-msk.vkcs.cloud/uploads/${file_key}`;
    return url;
}