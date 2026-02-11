// src/infrastructure/cloudinary/CloudinaryService.js
export class CloudinaryService {
    constructor() {
        this.cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
        this.uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
        this.uploadUrl = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
    }

    async uploadFile(file, folder = 'orders') {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset);
        formData.append('folder', folder);

        try {
            const response = await fetch(this.uploadUrl, {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            return {
                url: data.secure_url,
                publicId: data.public_id,
                format: data.format
            };
        } catch (error) {
            throw new Error(`Upload failed: ${error.message}`);
        }
    }

    async uploadMultiple(files, folder = 'orders') {
        const uploads = files.map(file => this.uploadFile(file, folder));
        return Promise.all(uploads);
    }

    async deleteFile(publicId) {
        try {
            const response = await fetch(this.uploadUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    upload_preset: this.uploadPreset,
                    public_id: publicId,
                    invalidate: true
                })
            });

            const data = await response.json();
            return data;
        } catch (error) {
            throw new Error(`Delete failed: ${error.message}`);
        }
    }
}
