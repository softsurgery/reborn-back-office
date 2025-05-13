import { IQueryObject } from "@/lib/prisma/interfaces/query-params";
import { Paginated } from "@/lib/prisma/interfaces/pagination";
import { UserRepository } from "../repositories/user.repository";
import { hashPassword } from "@/lib/utils/hash.util";
import { User } from "@/prisma/interfaces";

export class UserService {
  private userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  //base ***************************************************************************************
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

    return this.userRepository.create(data);
  }

  async updateUser(id: string, data: Partial<User>): Promise<User> {
    if (data.password) {
      const hashedPassword = await hashPassword(data.password);
      data.password = hashedPassword;
    }
    return this.userRepository.update(id, data);
  }

  async deleteUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    return this.userRepository.delete(id);
  }

  async countUsers(where: any = {}): Promise<number> {
    return this.userRepository.count(where);
  }

  //utilities ***************************************************************************************

  async getUserByEmailOrUsername(
    emailOrUsername: string
  ): Promise<User | null> {
    const user = await this.userRepository.findOneByCondition({
      filter: `(email||$eq||${emailOrUsername};username||$eq||${emailOrUsername})`,
    });
    if (!user) throw new Error("User does not exist");
    else return user;
  }

  async updateUserPassword(id: string, password: string): Promise<User> {
    const hashedPassword = await hashPassword(password);
    return this.userRepository.update(id, { password: hashedPassword });
  }

  async activate(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    return this.userRepository.update(id, { ...user, isActive: true });
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    return this.userRepository.update(id, { ...user, isActive: false });
  }

  async approve(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    return this.userRepository.update(id, { ...user, isApproved: true });
  }

  async disapprove(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    return this.userRepository.update(id, { ...user, isApproved: false });
  }

  async hasPermissions(id: string, permissions: string[]): Promise<boolean> {
    const user = await this.userRepository.findOneByCondition({
      filter: `id||$eq||${id}`,
      join: "role.permissions",
    });
    if (!user) return false;
    const userPermissions = user?.role?.permissions?.map(
      (rolePermission) => rolePermission?.permissionId
    );
    return permissions.every((permission) => userPermissions?.includes(permission));
  }
}
