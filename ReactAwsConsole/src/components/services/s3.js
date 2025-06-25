import axios from 'axios';

class AwsS3ConsoleServices {
    state = {
        server: "http://localhost:8042",
        baseUrl: "/api/s3"
    }
    getBuckets = () => {
        return axios.get (`${this.state.server}${this.state.baseUrl}/listBuckets`);
    }

    getFiles = (bucketName,prefix) => {
        const request = { bucketName , prefix };
        return axios.post (`${this.state.server}${this.state.baseUrl}/listFiles`,request);
    }

    downloadFile = (bucketName,key) => {
        const request={bucketName,key};
        return axios.post (`${this.state.server}${this.state.baseUrl}/downloadFile`,request);
    }

    deleteFile = (bucketName,key) => {
        const request={bucketName,key};
        return axios.post (`${this.state.server}${this.state.baseUrl}/deleteFile`,request);
    }

    createBucket = (bucketName, region, enableVersioning, enableEventBridge, enableServerSideEncryption) => {
        const request={ bucketName, region, enableVersioning, enableEventBridge, enableServerSideEncryption};
        return axios.post (`${this.state.server}${this.state.baseUrl}/createBucket`,request);
    }

    deleteBucket = (bucketName) => {
        const request={bucketName};
        return axios.post (`${this.state.server}${this.state.baseUrl}/deleteBucket`,request)
    }
}
export default new AwsS3ConsoleServices();