import { HttpStatus, BadRequestException } from "@nestjs/common";
import { PER_PAGE_LIMIT } from "../constants";
import { RpcException } from "@nestjs/microservices";
export abstract class BaseController {
    protected readonly resource;
    protected readonly service;
    protected collection: boolean = true;
    protected pagination: boolean = true;
    protected request;

    protected constructor(Resource, Service) {
        this.resource = Resource;
        this.service = Service;
    }
    async successResponse(data: any = null, message = 'Success', status = HttpStatus.OK) {
        if(!data){
            return {
                statusCode: status,
                success: true,
                message,
                data: null
            }
        }
        if (this.resource && this.collection) {
            if (Array.isArray(data)) {
                data = data.map((item) => this.resource.toResponse(item, this.request));
            } else {
                data = this.resource.toResponse(data, this.request);
            }
        }
        if (this.pagination) {
            const limit = this.request?.query?.limit ? parseInt(this.request?.query?.limit) : PER_PAGE_LIMIT;
            const total = this.request.count;
            const page = this.request?.query?.page ? parseInt(this.request?.query?.page) : 1;
            const total_page = Math.ceil(
                total / limit
            );
            return {
                statusCode: status,
                success: true,
                message,
                data,
                links: {
                    total: total_page > 0 ? total_page : 1,
                    per_page: PER_PAGE_LIMIT,
                    current: page,
                    prev: page - 1,
                    next: page + 1,
                    total_records: total
                }
            };
        }
        return {
            statusCode: status,
            status: true,
            message,
            data,
        };
    }

    async sendError(message = 'Something went wrong', status = HttpStatus.BAD_REQUEST, data: any = {}) {
        throw new RpcException(new BadRequestException(message,{cause:status}));
    }

}