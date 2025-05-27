import { text } from "stream/consumers";

export class SettingResource {
    static toResponse(record, request) {
        return {
            id: record.id,
            title: record.title,
            text: record.text,
            created_at: record.createdAt
        };
    }
}
