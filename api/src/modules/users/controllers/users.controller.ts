import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly users: UsersService) {}

  @Post() create(@Body() dto: CreateUserDto) {
    return this.users.create(dto);
  }
  @Get() findAll() {
    return this.users.findAll();
  }
  @Get(':id') findOne(@Param('id') id: string) {
    return this.users.findOne(id);
  }
  @Patch(':id') update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.users.update(id, dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.users.remove(id);
  }
}
