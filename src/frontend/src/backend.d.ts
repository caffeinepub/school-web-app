import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface AdmissionEnquiry {
    id: string;
    studentName: string;
    admissionClass: string;
    submittedAt: bigint;
    fatherName: string;
    village: string;
    phone: string;
}
export interface Teacher {
    id: string;
    bio: string;
    yearsOfExperience: bigint;
    subject: Subject;
    name: string;
    email: string;
    phone: string;
    profileImageUrl: string;
}
export interface Student {
    id: string;
    age: bigint;
    parentContact: string;
    classSection: string;
    name: string;
    grade: bigint;
    enrollmentDate: bigint;
}
export enum Subject {
    LanguageArts = "LanguageArts",
    ComputerScience = "ComputerScience",
    Mathematics = "Mathematics",
    PhysicalEducation = "PhysicalEducation",
    Music = "Music",
    Science = "Science"
}
export interface backendInterface {
    getAdmissionEnquiries(): Promise<Array<AdmissionEnquiry>>;
    getAllStudents(): Promise<Array<Student>>;
    getAllTeachers(): Promise<Array<Teacher>>;
    getStudentById(id: string): Promise<Student>;
    getTeacherById(id: string): Promise<Teacher>;
    seedData(): Promise<void>;
    submitAdmissionEnquiry(studentName: string, fatherName: string, village: string, admissionClass: string, phone: string): Promise<AdmissionEnquiry>;
}
