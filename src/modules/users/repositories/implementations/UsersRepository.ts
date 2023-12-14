import { getRepository, Repository } from 'typeorm';

import { IFindUserWithGamesDTO, IFindUserByFullNameDTO } from '../../dtos';
import { User } from '../../entities/User';
import { IUsersRepository } from '../IUsersRepository';

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findUserWithGamesById({
    user_id,
  }: IFindUserWithGamesDTO): Promise<User> {
    return await this.repository.createQueryBuilder('user')
      .where({ id: user_id })
      .select(['user.first_name', 'user.last_name', 'user.email', 'game.title'])
      .leftJoin('user.games', 'game')
      .getOne() as User;


    // // const id = user_id
    // // const user = await this.repository.createQueryBuilder("users")
    // // .leftJoinAndSelect("users.games", "games")
    // // .where("users.id = :id", { id: `${user_id}`})
    // // .getOne()

    // // if(!user) throw new Error("User don't exists");

    // // return user;
    // const user = await this.repository.findOneOrFail({
    //   relations: ['games'],
    //   where: {
    //     id: user_id
    //   }
    // });

    // return user;
  }

  async findAllUsersOrderedByFirstName(): Promise<User[]> {
    return await this.repository.query("select first_name from users order by first_name"); // Complete usando raw query
  }

  async findUserByFullName({
    first_name,
    last_name,
  }: IFindUserByFullNameDTO): Promise<User[] | undefined> {
    return await this.repository.query(`select * from users where lower(first_name) ='${first_name.toLowerCase()}' and lower(last_name)='${last_name.toLowerCase()}'`); // Complete usando raw query
  }
}
