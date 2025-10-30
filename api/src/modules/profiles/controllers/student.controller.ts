import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
import { ProfilesService } from '../services/profiles.service';
import {
  CreateStudentProfileDto,
  UpdateStudentProfileDto,
} from '../dto/student-profile.dto';

@Controller('profiles/students')
export class StudentController {
  constructor(private readonly svc: ProfilesService) {}

  @Post() create(@Body() dto: CreateStudentProfileDto) {
    return this.svc.createStudent(dto);
  }
  @Get() list() {
    return this.svc.listStudents();
  }
  @Get(':id') get(@Param('id') id: string) {
    return this.svc.getStudent(Number(id));
  }
  @Patch(':id') update(
    @Param('id') id: string,
    @Body() dto: UpdateStudentProfileDto,
  ) {
    return this.svc.updateStudent(Number(id), dto);
  }
  @Delete(':id') remove(@Param('id') id: string) {
    return this.svc.deleteStudent(Number(id));
  }
}
