import {UserService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {securityId} from '@loopback/security';
import {JWTService} from '.';
import {User} from '../models/user.model';
import {UserRepository} from './../repositories/user.repository';
import {BcryptHasher} from './hash-password';
import {
  PasswordHasherBindings,
  TokenServiceBindings
} from './jwt-authentication/keys';
import {Credentials, MyUserProfile} from './jwt-authentication/type';

export class MyUserService implements UserService<User, Credentials> {
  constructor(
    @repository(UserRepository)
    public userRepository: UserRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: JWTService,
    @inject(PasswordHasherBindings.PASSWORD_HASHER)
    public hasher: BcryptHasher,
  ) { }

  async verifyCredentials(credentials: Credentials): Promise<User> {
    const foundUser = await this.userRepository.findOne({
      where: {
        userName: credentials.userName,
      },
      include: [{relation: "userCredentials"}],
    });

    if (!foundUser) {
      throw new HttpErrors.NotFound('user not found');
    }
    const passwordMatched = await this.hasher.comparePassword(
      credentials.password,
      foundUser?.userCredentials.password
    );
    if (!passwordMatched)
      throw new HttpErrors.Unauthorized('password is not valid');
    return foundUser;
  }

  convertToUserProfile(user: User): MyUserProfile {
    return {
      [securityId]: user.id!,
      id: user.id!,
      username: user.userName,
      role: user.role,
    };
  }
}
