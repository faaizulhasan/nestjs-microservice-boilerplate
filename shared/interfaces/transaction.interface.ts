export interface TransactionInterface {
    user_id: number;
    task_id?: number;
    gateway_transaction_id: string;
    transaction_type: string;
    previous_amount: number;
    new_amount: number;
    platform_fee: number;
    transaction_amount: number;
    total_amount: number;
    status: string;
    description?: string;
} 