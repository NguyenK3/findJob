declare module 'file-upload' {
    interface FileUploadResponse {
        success: boolean;
        message: string;
        fileUrl?: string;
    }

    interface FileUploadOptions {
        endpoint: string;
        headers?: Record<string, string>;
        onProgress?: (progress: number) => void;
    }

    function uploadFile(file: File, options: FileUploadOptions): Promise<FileUploadResponse>;

    export { FileUploadResponse, FileUploadOptions, uploadFile };
}

declare module '*.mp4' {
    const src: string;
    export default src;
}

declare module '*.png' {
    const src: string;
    export default src;
}

declare module '*.xlsx' {
    const src: string;
    export default src;
}

declare module '*.xlsm' {
    const src: string;
    export default src;
}

declare module '*.csv' {
    const src: string;
    export default src;
}

declare module 'react-icons/*';

declare module 'uuid';

declare module 'lodash';

declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.scss' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.sass' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.less' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.module.styl' {
    const classes: { [key: string]: string };
    export default classes;
}