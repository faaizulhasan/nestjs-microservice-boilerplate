export class NotificationResource {
    static toResponse(record,request) {
        return {
            id: record.id,
            title: record.title,
            message: record.message,
            image_url: record.image_url,
            payload: record.payload,
            is_read: record.is_read,                
            created_at: record.createdAt
        };
    }
}
