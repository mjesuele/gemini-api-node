import { AxiosRequestConfig } from "axios";
interface AuthedRequestParams {
    key: string;
    secret: string;
    payload: any;
}
declare const _default: ({ key, secret, payload, }: AuthedRequestParams) => AxiosRequestConfig;
export default _default;
