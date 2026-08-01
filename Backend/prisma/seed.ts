import { PrismaClient, Role, MembershipStatus, ClubRole, OpportunityType } from '@prisma/client';
import bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up database...');
  await prisma.globalSetting.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.certificate.deleteMany({});
  await prisma.achievement.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.activityTransaction.deleteMany({});
  await prisma.notification.deleteMany({});
  await prisma.opportunityApplication.deleteMany({});
  await prisma.opportunity.deleteMany({});
  await prisma.bookmark.deleteMany({});
  await prisma.postLike.deleteMany({});
  await prisma.comment.deleteMany({});
  await prisma.post.deleteMany({});
  await prisma.galleryItem.deleteMany({});
  await prisma.feedback.deleteMany({});
  await prisma.attendance.deleteMany({});
  await prisma.eventRegistration.deleteMany({});
  await prisma.event.deleteMany({});
  await prisma.membership.deleteMany({});
  await prisma.club.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('Seeding database...');

  const passwordHash = await bcryptjs.hash('password123', 10);

  // 1. Create Users
  const student = await prisma.user.create({
    data: {
      email: 'student@college.edu',
      password: passwordHash,
      name: 'Amit Sharma',
      department: 'Computer Science & Eng',
      role: Role.STUDENT,
      isVerified: true,
      skills: ['React', 'TypeScript', 'UI/UX', 'Python'],
      bio: 'Passionate developer and UI designer.',
      avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
      totalAp: 350,
    },
  });

  const president = await prisma.user.create({
    data: {
      email: 'president@college.edu',
      password: passwordHash,
      name: 'Alex Mercer',
      department: 'Computer Science & Eng',
      role: Role.CLUB_PRESIDENT,
      isVerified: true,
      skills: ['Node.js', 'AWS', 'System Design'],
      bio: 'President of the Coding Club.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      totalAp: 650,
    },
  });

  const faculty = await prisma.user.create({
    data: {
      email: 'faculty@college.edu',
      password: passwordHash,
      name: 'Dr. Sarah Jenkins',
      department: 'Computer Science & Eng',
      role: Role.FACULTY_COORDINATOR,
      isVerified: true,
      skills: ['Research', 'ML'],
      bio: 'Faculty HOD & CSE Lead Coordinator.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
  });

  const admin = await prisma.user.create({
    data: {
      email: 'admin@college.edu',
      password: passwordHash,
      name: 'College Admin',
      department: 'Administration',
      role: Role.COLLEGE_ADMIN,
      isVerified: true,
    },
  });

  const superadmin = await prisma.user.create({
    data: {
      email: 'superadmin@college.edu',
      password: passwordHash,
      name: 'Super Admin',
      department: 'Operations',
      role: Role.SUPER_ADMIN,
      isVerified: true,
    },
  });

  // 2. Create Clubs
  const codingClub = await prisma.club.create({
    data: {
      name: 'Coding Club',
      category: 'Technical',
      description: 'Dive deep into software engineering, algorithms, web development, and hackathons.',
      logo: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=150',
      isApproved: true,
    },
  });

  const roboticsClub = await prisma.club.create({
    data: {
      name: 'Robotics Association',
      category: 'Engineering',
      description: 'Designing, building, and programming autonomous robots.',
      logo: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=150',
      isApproved: true,
    },
  });

  // 3. Create Memberships
  await prisma.membership.createMany({
    data: [
      { userId: student.id, clubId: codingClub.id, status: MembershipStatus.APPROVED, role: ClubRole.MEMBER },
      { userId: president.id, clubId: codingClub.id, status: MembershipStatus.APPROVED, role: ClubRole.PRESIDENT },
      { userId: faculty.id, clubId: codingClub.id, status: MembershipStatus.APPROVED, role: ClubRole.MEMBER },
    ],
  });

  // 4. Create Events
  const hackathon = await prisma.event.create({
    data: {
      title: 'HackTech 2026: 36-Hour Hackathon',
      description: 'The premier software hacking challenge on campus.',
      date: new Date('2026-08-15T09:00:00Z'),
      venue: 'Main Seminar Hall & Tech Center',
      capacity: 250,
      isApproved: true,
      clubId: codingClub.id,
    },
  });

  // Register student for event
  await prisma.eventRegistration.create({
    data: {
      userId: student.id,
      eventId: hackathon.id,
      status: 'REGISTERED',
      attended: true,
    },
  });

  // 5. Create Opportunities
  await prisma.opportunity.create({
    data: {
      title: 'Google HashCode 2026',
      description: 'Google team-based competitive coding event.',
      type: OpportunityType.COMPETITION,
      company: 'Google',
      deadline: new Date('2026-08-20T23:59:59Z'),
      postedById: admin.id,
    },
  });

  await prisma.opportunity.create({
    data: {
      title: 'SpaceX Systems Engineer Intern',
      description: '3-month systems engineering internship.',
      type: OpportunityType.INTERNSHIP,
      company: 'SpaceX',
      deadline: new Date('2026-09-01T23:59:59Z'),
      postedById: admin.id,
    },
  });

  // 6. Create General Posts
  await prisma.post.create({
    data: {
      title: 'Teammates Wanted',
      content: "🚀 I'm attending the HackTech 2026 Hackathon tomorrow. Looking for 2 teammates to form a team! Specializing in frontend React/TS.",
      authorId: student.id,
    },
  });

  // 7. Seed Settings
  await prisma.globalSetting.create({
    data: {
      key: 'ALLOW_NEW_REGISTRATIONS',
      value: 'true',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
