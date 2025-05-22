export class GeneralHelper {
    static generateOTP() {
        return `${Math.floor(100000 + Math.random() * 900000)}`
    }
}
