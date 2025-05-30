import { text } from "stream/consumers";

export class SettingResource {
    static toResponse(record, request) {
        return {
            id: record.id,
            title: record.title,
            gst: record.gst,
            platform_fee: record.platform_fee,
            platform_commission: record.platform_commission
        };
    }
}
