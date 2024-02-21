import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { randomUUID } from 'crypto';

@Injectable()
export class S3Service {
  async upload(file: Express.Multer.File) {
    const fileExtension = file.originalname.split('.')[1];
    const albumBucketName = process.env.AWS_BUCKET_NAME; // S3의 버킷 이름
    const region = process.env.AWS_REGION; // 서울
    const accessKeyId = process.env.AWS_ACCESS_KEY; // IAM에서 생성한 사용자의 accessKeyId
    const secretAccessKey = process.env.AWS_SECRET_KEY; // IAM에서 생성한 사용자의 secretAccessKey
    AWS.config.update({
      region,
      accessKeyId,
      secretAccessKey,
    });
    const fileContent = file.buffer;
    const upload = new AWS.S3.ManagedUpload({
      params: {
        Bucket: albumBucketName,
        Key: randomUUID() + `.${fileExtension}`,
        Body: fileContent,
        ContentType: file.mimetype,
        ContentEncoding: file.encoding,
      },
    });

    const data = await upload.promise();
    return data.Location;
  }

  async delete(url: string) {
    const albumBucketName = process.env.AWS_BUCKET_NAME; // S3의 버킷 이름
    const region = process.env.AWS_REGION; // 서울
    const accessKeyId = process.env.AWS_ACCESS_KEY; // IAM에서 생성한 사용자의 accessKeyId
    const secretAccessKey = process.env.AWS_SECRET_KEY; // IAM에서 생성한 사용자의 secretAccessKey
    AWS.config.update({
      region,
      accessKeyId,
      secretAccessKey,
    });
    const s3 = new AWS.S3();
    let key = url;
    const lastSlashIndex = url.lastIndexOf('/');
    if (lastSlashIndex !== -1) {
      key = url.substring(lastSlashIndex + 1);
    }
    await s3
      .deleteObject({
        Bucket: albumBucketName,
        Key: key,
      })
      .promise();
  }
}
