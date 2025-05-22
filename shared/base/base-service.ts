export abstract class BaseService {
    protected constructor(protected readonly repo: any) {}

    async createRecord(dto) {
        return this.repo.create(dto);
    }

    async getRecords(query): Promise<any[]> {
        const { rows, count } = await this.repo.findAndCountAll();
        query.count = count;
        return rows.length ? rows.map(item => item.toJSON()) : [];
    }

    async findRecordByConditionAll(condition) {
        const record = await this.repo.findOne({
            where: condition
        });
        return record ? record.toJSON() : record;
    }

    async showRecord(id): Promise<any> {
        return this.repo.findOne({ where: { id } });
    }

    async updateRecord(id, dto): Promise<any> {
        await this.repo.update(id, dto);
        return this.showRecord(id);
    }

    async destroyRecord(id): Promise<{ deleted: boolean }> {
        const result = await this.repo.destroy({ where: { id } });
        return { deleted: !!result };
    }
}
