import { Body, Controller, Delete, Get, Post, UseGuards } from '@nestjs/common';
import { getUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { followUserDto, paymentInfoDto } from './dto';
import { UserService } from './user.service';

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getUser(@getUser('id') id: string) {
    console.log(id);
    return this.userService.getUser(id);
  }

  @Delete('/deleteUser')
  deleteUser(@getUser('id') id: string) {
    return this.userService.deleteUser(id);
  }
  @Post('/follow')
  followUser(@getUser('id') id: string, @Body() dto: followUserDto) {
    return this.userService.followUser(id, dto.userId);
  }

  @Post('/unfollow')
  unfollowUser(@getUser('id') id: string, @Body() dto: followUserDto) {
    return this.userService.unfollowUser(id, dto.userId);
  }

  @Post('payment')
  payment(@getUser('id') id: string, @Body() dto: paymentInfoDto) {
    return this.userService.payment(id, dto);
  }
}
