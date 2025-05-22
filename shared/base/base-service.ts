import {PER_PAGE_LIMIT} from "../constants";

export abstract class BaseService {
    protected constructor(protected readonly repo: any) {}
    protected showColumns(): string[] {
        return [];
    }
    protected exceptUpdateField(): string[] {
        return [];
    }
    async createRecord(dto) {
        return this.repo.create(dto);
    }

    async getRecords(request): Promise<any[]> {
        const orderBy = request?.query?.orderBy ? request.query.orderBy : "id";
        const order = request?.query?.order ? request.query.order : "DESC";
        const page = request.query.page ? parseInt(request.query.page) - 1 : 0;
        const limit = request.query.limit ? parseInt(request.query.limit) : PER_PAGE_LIMIT;
        const is_paginate = request?.query?.is_paginate && request?.query?.is_paginate == "false" ? false : true;

        let query = {
            attributes: this.showColumns().length ? this.showColumns() : undefined,
            ...(is_paginate && { limit: limit, offset: page * limit }),
            order: [[orderBy,order]]
        }

        const { rows, count } = await this.repo.findAndCountAll(query);
        request.count = count;
        return rows.length ? rows.map(item => item.toJSON()) : [];
    }

    async findRecordByCondition(condition) {
        const record = await this.repo.findOne({
            where: condition
        });
        return record ? record.toJSON() : record;
    }

    async showRecord(id): Promise<any> {
        const record = await this.repo.findOne({ where: { id } });
        return record ? record.toJSON() : record;
    }

    async updateRecord(id, payload): Promise<any> {
        let exceptUpdateField = this.exceptUpdateField();
        exceptUpdateField.filter(exceptField => {
            delete payload[exceptField];
        });
        await this.repo.update(payload,{
            where: {
                id: id
            }
        });
        return this.showRecord(id);
    }

    async updateRecordByCondition(condition, payload): Promise<any> {
        let exceptUpdateField = this.exceptUpdateField();
        exceptUpdateField.filter(exceptField => {
            delete payload[exceptField];
        });
        await this.repo.update(payload,{
            where: condition
        });
        return this.findRecordByCondition(condition);
    }

    async destroyRecord(id): Promise<{ deleted: boolean }> {
        const result = await this.repo.destroy({ where: { id } });
        return { deleted: !!result };
    }
    async destroyRecordByCondition(condition,force = false): Promise<{ deleted: boolean }> {
        const result = await this.repo.destroy({ where: condition,force });
        return { deleted: !!result };
    }
}
