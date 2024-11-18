import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './users.entity';
import { Repository } from 'typeorm';
import { CurrentResponse, RequestChangePassword } from './users.dto';
import { ValidationService } from 'src/common/services/validation.service';
import { UsersValidation } from './users.validation';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from 'src/auth/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { imagekit } from 'src/common/config/imagekit.config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private validationService: ValidationService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async current(user: Users): Promise<CurrentResponse> {
    console.log(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
      address: user.address,
      phone: user.phone,
      city_id: user.city?.id,
      province_id: user.province?.id,
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

  async updateProfile(user: Users, request: any): Promise<any> {
    const requestData = this.validationService.validate(
      UsersValidation.UPDATE_PROFILE,
      request,
    );

    const userCurrent = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    userCurrent.name = requestData.name;
    userCurrent.address = requestData.address;
    userCurrent.phone = requestData.phone;
    userCurrent.city = requestData.city_id;
    userCurrent.province = requestData.province_id;

    const result = await this.usersRepository.save(userCurrent);

    const findUser = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['province', 'city'],
    });

    const payload: JwtPayload = {
      id: findUser.id,
      email: findUser.email,
      name: findUser.name,
      role: findUser.role,
      image: findUser.image,
      address: findUser.address,
      phone: findUser.phone,
      is_verified: findUser.is_verified,
      province_id: findUser.province?.id,
      city_id: findUser.city?.id,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    return {
      id: result.id,
      name: result.name,
      address: result.address,
      phone: result.phone,
      city_id: result.city.id,
      province_id: result.province.id,
      newToken: token,
    };
  }

  async updateAvatar(user: Users, file: Express.Multer.File): Promise<any> {
    const userCurrent = await this.usersRepository.findOne({
      where: { id: user.id },
    });

    let uploadImage;
    if (file) {
      if (userCurrent.image_public_id !== '673b82b2e375273f608d7e3a') {
        await imagekit.deleteFile(userCurrent.image_public_id);
      }

      uploadImage = await imagekit.upload({
        file: file.buffer,
        fileName: file.originalname,
        folder: '/users',
      });
      userCurrent.image = uploadImage.url;
      userCurrent.image_public_id = uploadImage.fileId;
    }

    const result = await this.usersRepository.save(userCurrent);

    const findUser = await this.usersRepository.findOne({
      where: { id: user.id },
      relations: ['province', 'city'],
    });

    const payload: JwtPayload = {
      id: findUser.id,
      email: findUser.email,
      name: findUser.name,
      role: findUser.role,
      image: findUser.image,
      address: findUser.address,
      phone: findUser.phone,
      is_verified: findUser.is_verified,
      province_id: findUser.province?.id,
      city_id: findUser.city?.id,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    });

    return {
      id: result.id,
      image: result.image,
      newToken: token,
    };
  }
}
