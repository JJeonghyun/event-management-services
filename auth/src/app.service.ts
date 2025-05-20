import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schema/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  generateReferralCode(): string {
    return Math.random().toString(36).substring(2, 10);
  }

  async createUser(
    username: string,
    password: string,
    roles: string[] = ['USER'],
    referralCode?: string,
  ) {
    const isUser = await this.userModel.findOne({ username });
    if (isUser) {
      throw new Error('User already exists');
    }

    const myReferralCode = this.generateReferralCode();

    let isReferralCode = false;

    if (referralCode) {
      const isReferral = await this.userModel.findOne({ referralCode });

      if (!isReferral) {
        throw new Error('Invalid referral code');
      }
      isReferralCode = true;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = new this.userModel({
      username,
      password: hashedPassword,
      roles,
      referralCode: myReferralCode,
      isReferral: isReferralCode,
    });
    return created.save();
  }

  async findById(userId: string) {
    return this.userModel.findById(userId).lean();
  }

  async validateUser(username: string, password: string) {
    const user = await this.userModel.findOne({ username });
    if (!user) return null;

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return null;

    return user;
  }

  // 첫 로그인 여부 확인
  async handleFirstLogin(userId: string): Promise<void> {
    const isUser = await this.userModel.findById(userId);

    if (!isUser) {
      throw new NotFoundException('User not found');
    }

    if (!isUser.isFirstLogin) {
      isUser.isFirstLogin = true;
      await isUser.save();
    }
  }
}
