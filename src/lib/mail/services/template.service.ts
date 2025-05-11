import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { TemplateRepository } from "../repositories/template.repository";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { Template } from "@/prisma/interfaces";

export class TemplateService {
  private templateRepository: TemplateRepository;

  constructor(templateRepository: TemplateRepository) {
    this.templateRepository = templateRepository;
  }
  async getPaginatedTemplates(
    queryObject: IQueryObject
  ): Promise<Paginated<Template>> {
    return this.templateRepository.findPaginated(queryObject);
  }

  async getAllTemplates(queryObject: IQueryObject): Promise<Template[]> {
    return this.templateRepository.findByCondition(queryObject);
  }

  async getTemplateById(id: string): Promise<Template | null> {
    return this.templateRepository.findById(id);
  }

  async getTemplateByName(name: string): Promise<Template | null> {
    const template = await this.templateRepository.findOneByCondition({
      filter: `name||$eq||${name}`,
    });
    return template;
  }

  async createTemplate(data: Partial<Template>): Promise<Template> {
    return this.templateRepository.create(data);
  }

  async createManyTemplates(data: Partial<Template>[]): Promise<Template[]> {
    return this.templateRepository.createMany(data);
  }

  async updateTemplate(id: string, data: Partial<Template>): Promise<Template> {
    return this.templateRepository.update(id, data);
  }

  async deleteTemplate(id: string): Promise<Template> {
    return this.templateRepository.softDelete(id);
  }

  async countTemplates(where: any = {}): Promise<number> {
    return this.templateRepository.count(where);
  }
}
