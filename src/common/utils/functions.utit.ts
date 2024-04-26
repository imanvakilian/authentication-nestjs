import { randomInt } from "crypto";

export function generateOtp() {
    const code = randomInt(10000, 99999).toString();
    const expires_in = new Date(Date.now() + (1000 * 60 * 2));
    return {
        code,
        expires_in,
    };
}

export const randomId = randomInt(1000, 9999).toString;