import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { CurrentResponse, RequestChangePassword } from './users.dto';
import { ValidationService } from 'src/common/services/validation.service';
import { UsersValidation } from './users.validation';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private validationService: ValidationService,
  ) {}

  async current(user: Users): Promise<CurrentResponse> {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      address: user.address,
      phone: user.phone,
      is_verified: user.is_verified,
    };
  }

  async changePassword(
    user: Users,
    request: RequestChangePassword,
  ): Promise<void> {
    const requestData = this.validationService.validate(
      UsersValidation.CHANGE_PASSWORD,
      request,
    );

    const userExist = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    const check_password = await bcrypt.compare(
      requestData.current_password,
      userExist.password,
    );

    if (!check_password) {
      throw new BadRequestException('Current password is incorrect');
    }

    const newPassword = await bcrypt.hash(requestData.new_password, 10);

    userExist.password = newPassword;
    userExist.updated_at = new Date();

    await this.usersRepository.save(userExist);
  }
}
