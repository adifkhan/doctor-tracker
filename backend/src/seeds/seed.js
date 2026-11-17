import { connectDB, disconnectDB } from "../config/db.js";
import * as userRepository from "../repositories/user.repository.js";
import * as doctorRepository from "../repositories/doctor.repository.js";
import * as patientRepository from "../repositories/patient.repository.js";

const ADMIN_NAME = "Admin";
const ADMIN_EMAIL = "admin@doctortracker.com";
const ADMIN_PASSWORD = "Admin@12345";

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

// Patients: [name, age, gender, condition, days since registered]
const doctors = [
  {
    name: "Dr. Amelia Hart",
    specialization: "Cardiology",
    hospital: "City General Hospital",
    phone: "+8801711000001",
    email: "amelia.hart@citygeneral.com",
    joined: 80,
    patients: [
      ["Rafiq Ahmed", 58, "male", "Hypertension", 27],
      ["Nasrin Akter", 64, "female", "Heart Failure", 21],
      ["Daniel Brooks", 49, "male", "Arrhythmia", 12],
      ["Sultana Begum", 71, "female", "Hypertension", 5],
      ["Imran Hossain", 53, "male", "Coronary Artery Disease", 1],
    ],
  },
  {
    name: "Dr. Tariq Aziz",
    specialization: "Neurology",
    hospital: "Northside Medical Center",
    phone: "+8801711000002",
    email: "tariq.aziz@northside.com",
    joined: 70,
    patients: [
      ["Farhana Islam", 34, "female", "Migraine", 25],
      ["Kevin Miller", 62, "male", "Epilepsy", 18],
      ["Anika Rahman", 41, "female", "Migraine", 9],
      ["Shahidul Karim", 67, "male", "Parkinson's Disease", 3],
    ],
  },
  {
    name: "Dr. Priya Nair",
    specialization: "Pediatrics",
    hospital: "Green Valley Clinic",
    phone: "+8801711000003",
    email: "priya.nair@greenvalley.com",
    joined: 60,
    patients: [
      ["Aryan Das", 7, "male", "Asthma", 28],
      ["Mim Chowdhury", 5, "female", "Allergy", 20],
      ["Lucas Meyer", 9, "male", "Asthma", 14],
      ["Tisha Roy", 4, "female", "Ear Infection", 8],
      ["Ibrahim Khan", 11, "male", "Allergy", 2],
    ],
  },
  {
    name: "Dr. Omar Farouk",
    specialization: "Orthopedics",
    hospital: "City General Hospital",
    phone: "+8801711000004",
    email: "omar.farouk@citygeneral.com",
    joined: 55,
    patients: [
      ["Jamal Uddin", 45, "male", "Fracture", 26],
      ["Elena Petrova", 38, "female", "Arthritis", 17],
      ["Rupa Sarker", 59, "female", "Osteoporosis", 10],
      ["Marcus Bell", 29, "male", "Fracture", 4],
    ],
  },
  {
    name: "Dr. Hana Sato",
    specialization: "Dermatology",
    hospital: "St. Mary Medical",
    phone: "+8801711000005",
    email: "hana.sato@stmary.com",
    joined: 45,
    patients: [
      ["Sofia Lopez", 26, "female", "Eczema", 23],
      ["Rakib Hasan", 31, "male", "Acne", 15],
      ["Joya Paul", 44, "female", "Psoriasis", 6],
    ],
  },
  {
    name: "Dr. Nadia Rahman",
    specialization: "Endocrinology",
    hospital: "St. Mary Medical",
    phone: "+8801711000006",
    email: "nadia.rahman@stmary.com",
    joined: 35,
    patients: [
      ["Mahbub Alam", 56, "male", "Diabetes", 22],
      ["Laila Khatun", 48, "female", "Thyroid Disorder", 16],
      ["Peter Nguyen", 61, "male", "Diabetes", 11],
      ["Salma Parvin", 39, "female", "Diabetes", 7],
      ["Zubair Ali", 52, "other", "Thyroid Disorder", 0],
    ],
  },
  {
    name: "Dr. Lucas Meyer",
    specialization: "Cardiology",
    hospital: "Northside Medical Center",
    phone: "+8801711000007",
    email: "lucas.meyer@northside.com",
    joined: 20,
    patients: [
      ["Kamal Hossain", 66, "male", "Hypertension", 13],
      ["Rina Akter", 57, "female", "Arrhythmia", 5],
    ],
  },
  {
    name: "Dr. Sarah Collins",
    specialization: "Neurology",
    hospital: "Green Valley Clinic",
    phone: "+8801711000008",
    email: "sarah.collins@greenvalley.com",
    joined: 10,
    patients: [
      ["Nilufar Yasmin", 43, "female", "Migraine", 9],
      ["Hasan Mahmud", 36, "male", "Epilepsy", 3],
    ],
  },
];

const slug = (name) =>
  name
    .toLowerCase()
    .replace(/[^a-z]+/g, ".")
    .replace(/^\.|\.$/g, "");

const seedAdmin = async () => {
  if (await userRepository.existsByEmail(ADMIN_EMAIL)) {
    console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
    return;
  }

  await userRepository.create({
    name: ADMIN_NAME,
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    role: "admin",
  });
  console.log(`Admin user created: ${ADMIN_EMAIL}`);
};

const seedDoctorsAndPatients = async () => {
  let patientNumber = 0;
  let doctorsCreated = 0;
  let patientsCreated = 0;

  for (const { patients, joined, ...doctorData } of doctors) {
    const numbered = patients.map((patient) => [...patient, ++patientNumber]);

    if (await doctorRepository.existsByEmail(doctorData.email)) continue;

    const doctor = await doctorRepository.create({
      ...doctorData,
      createdAt: daysAgo(joined),
    });
    doctorsCreated += 1;

    for (const [name, age, gender, condition, days, number] of numbered) {
      await patientRepository.create({
        name,
        age,
        gender,
        condition,
        phone: `+8801811${String(number).padStart(6, "0")}`,
        email: `${slug(name)}@example.com`,
        doctor: doctor._id,
        createdAt: daysAgo(days),
      });
      patientsCreated += 1;
    }
  }

  console.log(
    `Doctors created: ${doctorsCreated}, patients created: ${patientsCreated}`,
  );
};

const seed = async () => {
  await connectDB();
  await seedAdmin();
  await seedDoctorsAndPatients();
};

seed()
  .catch((err) => {
    console.error("Seeding failed:", err);
    process.exitCode = 1;
  })
  .finally(disconnectDB);
