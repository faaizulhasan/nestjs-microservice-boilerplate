import { text } from "stream/consumers";

export class PagesResource {
    static toResponse(record, request) {
        return {
            id: record.id,
            title: record.title,
            slug: record.slug,
            content: record.content,
            url: record.url,
            created_at: record.createdAt
        };
    }
}
