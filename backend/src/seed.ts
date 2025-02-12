// import { faker } from '@faker-js/faker';
// import sequelize from '../config/database';
// import Youth from './models/youth';
// import Employer from './models/employer';

// const seedDatabase = async () => {
//   try {
//     await sequelize.sync({ force: false }); // Ensure tables exist without dropping them

//     // Seeding Employers
//     // const employers = [];
//     // for (let i = 0; i < 10; i++) {
//     //   employers.push(
//     //     Employer.create({
//     //       id: faker.string.uuid(),
//     //       active: faker.datatype.boolean(),
//     //       username: faker.internet.userName(),
//     //       password: faker.internet.password(),
//     //       organization: faker.company.name(),
//     //       fullNameEnglish: faker.person.fullName(),
//     //       fullNameArabic: faker.person.fullName(),
//     //       mobilePhone: faker.phone.number(),
//     //       whatsappNumber: faker.phone.number(),
//     //       email: faker.internet.email(),
//     //       area: faker.location.city(),
//     //       signature: faker.image.avatar(),
//     //       profileImage: faker.image.avatar(),
//     //       role: 'employer',
//     //     })
//     //   );
//     // }

//     // Seeding Youth
//     const youths = [];
//     for (let i = 0; i < 20; i++) {
//       youths.push(
//         Youth.create({
//           id: faker.string.uuid(),
//           username: faker.internet.userName(),
//           password: faker.internet.password(),
//           role: 'youth',
//           firstNameEn: faker.person.firstName(),
//           fatherNameEn: faker.person.firstName(),
//           lastNameEn: faker.person.lastName(),
//           firstNameAr: faker.person.firstName(),
//           fatherNameAr: faker.person.firstName(),
//           lastNameAr: faker.person.lastName(),
//           gender: faker.helpers.arrayElement(['male', 'female']),
//           dob: faker.date.birthdate().toISOString(),
//           nationality: faker.location.country(),
//           registrationStatus: faker.helpers.arrayElement(['registered', 'not registered']),
//           personalRegistrationNumber: faker.string.numeric(10),
//           mobilePhone: faker.phone.number(),
//           whatsapp: faker.phone.number(),
//           email: faker.internet.email(),
//           area: faker.location.city(),
//           campType: faker.helpers.arrayElement(['urban', 'rural']),
//           camp: faker.location.city(),
//           fullAddress: faker.location.streetAddress(),
//           jobOpportunitySource: faker.company.name(),
//           educationLevel: faker.helpers.arrayElement(['High School', 'Bachelor', 'Master']),
//           major: faker.word.words(2),
//           institution: faker.company.name(),
//           graduationDate: faker.date.past().toISOString(),
//           gradplace: faker.location.city(),
//           employmentOpportunities: faker.word.words(3),
//           aboutYourself: faker.lorem.paragraph(),
//           placedByKfw: faker.datatype.boolean(),
//           innovationLabGraduate: faker.datatype.boolean(),
//           innovationLabGradtype: faker.helpers.arrayElements(['Tech', 'Business', 'Art'], 2),
//           disability: faker.datatype.boolean(),
//           disabilityTypes: faker.helpers.arrayElements(['Visual', 'Hearing', 'Physical'], 1),
//           employed: faker.datatype.boolean(),
//           experiences: [{ job: faker.company.name(), status: 'completed' }],
//           trainings: [{ title: faker.word.words(3), provider: faker.company.name() }],
//           computerSkills: faker.helpers.arrayElements(['Excel', 'Word', 'PowerPoint'], 2),
//           skills: { arabic: 'fluent', english: 'good', french: 'basic' },
//           cv: faker.internet.url(),
//           identityCard: faker.internet.url(),
//           registrationCard: faker.internet.url(),
//           degree: faker.internet.url(),
//           confirmation: faker.internet.url(),
//           status: faker.helpers.arrayElement(['accepted', 'rejected', 'pending', 'waiting']),
//           appliedJob: [{ job: faker.company.name(), status: 'applied' }],
//           beneficiary: faker.datatype.boolean(),
//           workStatus: faker.datatype.boolean(),
//           isEdited: faker.datatype.boolean(),
//         })
//       );
//     }

//     await Promise.all([ ...youths]);
//     console.log('✅ Mock data successfully inserted!');
//   } catch (error) {
//     console.error('❌ Error seeding database:', error);
//   } finally {
//     await sequelize.close();
//   }
// };

// seedDatabase();
