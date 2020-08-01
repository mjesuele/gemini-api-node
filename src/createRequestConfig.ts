import { AxiosRequestConfig } from "axios";
import crypto from "crypto";

interface AuthedRequestParams {
  key: string;
  secret: string;
  payload: any;
}

export default ({
  key,
  secret,
  payload,
}: AuthedRequestParams): AxiosRequestConfig => {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    `base64`
  );

  const signature = crypto
    .createHmac(`sha384`, secret)
    .update(encodedPayload)
    .digest(`hex`);

  console.log({ key, payload, encodedPayload, signature });

  return {
    headers: {
      "Content-Length": 0,
      "Conent-Type": "text/plain",
      "X-GEMINI-APIKEY": key,
      "X-GEMINI-PAYLOAD": encodedPayload,
      "X-GEMINI-SIGNATURE": signature,
      "Cache-Control": "no-cache",
    },
  };
};
