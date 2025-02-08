import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { User } from "@/types/user-management";
import { UserRepository } from "../repositories/user.repository";

export class UserService {
    private userRepository: UserRepository;

    constructor(
        userRepository: UserRepository,
    ) {
        this.userRepository = userRepository;
    }

    async getPaginatedUsers(queryObject: IQueryObject): Promise<Paginated<User>> {
        return this.userRepository.findPaginated(queryObject);
    }

    async getAllUsers(queryObject: IQueryObject): Promise<User[]> {
        return this.userRepository.findByCondition(queryObject);
    }

    async getUserById(id: string): Promise<User | null> {
        return this.userRepository.findById(id);
    }

    async createUser(data: Partial<User>): Promise<User> {
        return this.userRepository.create(data);
    }

    async updateUser(
        id: string,
        data: Partial<User>
    ): Promise<User> {
        return this.userRepository.update(id, data);
    }

    async activate(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        return this.userRepository.update(id, { ...user, isActive: true });
    }
    async deactivate(id: string): Promise<User> {
        const user = await this.userRepository.findById(id);
        return this.userRepository.update(id, { ...user, isActive: false });
    }

    async deleteUser(id: string): Promise<User> {
        return this.userRepository.delete(id);
    }

    async countUsers(where: any = {}): Promise<number> {
        return this.userRepository.count(where);
    }
}
