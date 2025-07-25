import axios from 'axios';

class AwsEC2ConsoleServices {
    state = {
        server: "http://localhost:8042",
        baseUrl: "/api/ec2"
    }

    fetchInstances = (region) => {
        const res = axios.get(`${this.state.server}${this.state.baseUrl}/list/${region}`);
        return res;
    };

    createInstance = (form) => {
        return axios.post(`${this.state.server}${this.state.baseUrl}/create`, form);
    };

    stopInstance = async (region,id) => {
        return axios.post(`${this.state.server}${this.state.baseUrl}/stop/${region}/${id}`);
    };

    startInstance = async (region,id) => {
        return axios.post(`${this.state.server}${this.state.baseUrl}/start/${region}/${id}`);
    };

    terminateInstance = async (region,id) => {
        return axios.delete(`${this.state.server}${this.state.baseUrl}/terminate/${region}/${id}`);
    };
}
export default new AwsEC2ConsoleServices();