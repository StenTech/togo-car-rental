import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

@Injectable()
export class StorageService {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  private readonly logger = new Logger(StorageService.name);

  constructor(private readonly configService: ConfigService) {
    this.bucketName =
      this.configService.getOrThrow<string>('MINIO_BUCKET_NAME');

    this.s3Client = new S3Client({
      region: 'us-east-1', // MinIO requiert une region, même bidon
      endpoint: this.configService.getOrThrow<string>('MINIO_ENDPOINT'),
      forcePathStyle: true, // Nécessaire pour MinIO
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('MINIO_ROOT_USER'),
        secretAccessKey: this.configService.getOrThrow<string>(
          'MINIO_ROOT_PASSWORD',
        ),
      },
    });
  }

  /**
   * Upload a file to MinIO (S3 compatible storage)
   * @param file The file buffer and metadata validation
   * @param folder The target folder inside the bucket (optional)
   * @returns The public URL of the uploaded file
   */
  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'uploads',
  ): Promise<string> {
    const fileExtension = extname(file.originalname);
    const fileName = `${uuidv4()}${fileExtension}`;
    const key = `${folder}/${fileName}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
          // ACL: ObjectCannedACL.public_read, // Dépend de la config MinIO, souvent géré par policy
        }),
      );

      // Construction de l'URL publique
      // Note: Dans un environnement local Docker, l'endpoint http://minio:9000 n'est pas accessible par le navigateur hôte.
      // On utilise souvent localhost:9000 pour le dev, ou un domaine configuré.
      // Ici, on retourne le chemin relatif ou une URL construite selon la conf.
      // Pour cet exercice, on va supposer que MINIO_ENDPOINT est accessible,
      // ou on retourne une URL relative que le front saura préfixer.

      // Approche simple: retourner le chemin complet supposé accessible
      const endpoint =
        this.configService.get<string>('MINIO_ENDPOINT_PUBLIC') ||
        'http://localhost:9000';
      return `${endpoint}/${this.bucketName}/${key}`;
    } catch (error) {
      if (error instanceof Error) {
        this.logger.error(
          `Failed to upload file to MinIO: ${error.message}`,
          error.stack,
        );
      }
      throw error;
    }
  }
}
