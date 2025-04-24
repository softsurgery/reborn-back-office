import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { User } from "@/types";
import { UserRepository } from "../repositories/user.repository";
import { hashPassword } from "@/lib/utils/hash.util";
import { CardinalApiKeyService } from "@/lib/cardinal/api-key.service";

export class UserService {
  private userRepository: UserRepository;
  private cardinalApiKeyService: CardinalApiKeyService;

  constructor(
    userRepository: UserRepository,
    cardinalApiKeyService: CardinalApiKeyService
  ) {
    this.userRepository = userRepository;
    this.cardinalApiKeyService = cardinalApiKeyService;
  }

  getUserIdentity(user: User): string {
    return `${user.id}${user.username}`;
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

  async getUserByCondition(queryObject: IQueryObject) {
    return this.userRepository.findOneByCondition(queryObject);
  }

  async createUser(data: Partial<User>): Promise<User> {
    const existingUser = await this.getUserByCondition({
      filter: `(username||$eq||${data.username};email||$eq||${data.email})`,
    });
    if (existingUser) {
      throw new Error("User already exists");
    }

    const hashedPassword = data.password && (await hashPassword(data.password));
    data.password = hashedPassword;

    const user = await this.userRepository.create(data);

    const keyResult = await this.cardinalApiKeyService.createKey(
      `${data.username}`,
      this.getUserIdentity(user),
      false
    );

    if ("error" in keyResult) {
      throw new Error(`Failed to create API key: ${keyResult.error}`);
    }

    return user;
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    if (data.password) {
      const hashedPassword = await hashPassword(data.password);
      data.password = hashedPassword;
    }
    return this.userRepository.update(id, data);
  }

  async activate(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (user) {
      const result = await this.cardinalApiKeyService.enableKey(
        this.getUserIdentity(user)
      );
      if ("error" in result) {
        throw new Error(`Failed to enable API key: ${result.error}`);
      }
    }
    return this.userRepository.update(id, { ...user, isActive: true });
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (user) {
      const result = await this.cardinalApiKeyService.disableKey(
        this.getUserIdentity(user)
      );
      if ("error" in result) {
        throw new Error(`Failed to disable API key: ${result.error}`);
      }
    }
    return this.userRepository.update(id, { ...user, isActive: false });
  }

  async approve(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (user) {
      const result = await this.cardinalApiKeyService.enableKey(
        this.getUserIdentity(user)
      );
      if ("error" in result) {
        throw new Error(`Failed to enable API key: ${result.error}`);
      }
    }
    return this.userRepository.update(id, { ...user, isApproved: true });
  }

  async disapprove(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (user) {
      const result = await this.cardinalApiKeyService.disableKey(
        this.getUserIdentity(user)
      );
      if ("error" in result) {
        throw new Error(`Failed to disable API key: ${result.error}`);
      }
    }
    return this.userRepository.update(id, { ...user, isApproved: false });
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (user) {
      const result = await this.cardinalApiKeyService.disableKey(
        this.getUserIdentity(user)
      );
      if ("error" in result) {
        throw new Error(
          `Failed to disable API key before delete: ${result.error}`
        );
      }
    }
    return this.userRepository.delete(id);
  }

  async refreshUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (user) {
      const result = await this.cardinalApiKeyService.refreshKey(
        `${user.username}`,
        this.getUserIdentity(user)
      );
      if ("error" in result) {
        throw new Error(`Failed to refresh API key: ${result.error}`);
      }
    }
    return this.userRepository.update(id, { ...user, isActive: true });
  }

  async countUsers(where: any = {}): Promise<number> {
    return this.userRepository.count(where);
  }
}
