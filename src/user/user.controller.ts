import { Controller, Delete, Get, UseGuards } from '@nestjs/common';
import { getUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
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
}
