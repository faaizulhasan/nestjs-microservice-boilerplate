export interface NotificationInterface {
    user_id: number;
    type: string;
    title: string;
    message: string;
    badge?: number;
    mutable_content?: number;
    content_available?: number;
    image_url?: string | null;
    payload: string;
    is_read?: number;
  }