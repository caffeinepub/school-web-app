import Map "mo:core/Map";
import Text "mo:core/Text";
import Int "mo:core/Int";
import Nat "mo:core/Nat";
import List "mo:core/List";

module {
  type OldSubject = {
    #Mathematics;
    #Science;
    #LanguageArts;
    #PhysicalEducation;
    #Music;
    #ComputerScience;
  };

  type OldTeacher = {
    id : Text;
    name : Text;
    subject : OldSubject;
    email : Text;
    phone : Text;
    bio : Text;
    yearsOfExperience : Nat;
    profileImageUrl : Text;
  };

  type OldStudent = {
    id : Text;
    name : Text;
    grade : Nat;
    classSection : Text;
    age : Nat;
    parentContact : Text;
    enrollmentDate : Int;
  };

  type OldAdmissionEnquiry = {
    id : Text;
    studentName : Text;
    fatherName : Text;
    village : Text;
    admissionClass : Text;
    phone : Text;
    submittedAt : Int;
  };

  type OldActor = {
    var nextTeacherId : Nat;
    var nextStudentId : Nat;
    var nextAdmissionEnquiryId : Nat;
    var teachers : Map.Map<Text, OldTeacher>;
    var students : Map.Map<Text, OldStudent>;
    var admissionEnquiries : Map.Map<Text, OldAdmissionEnquiry>;
  };

  type NewSubject = {
    #Mathematics;
    #Science;
    #LanguageArts;
    #PhysicalEducation;
    #Music;
    #ComputerScience;
  };

  type NewTeacher = {
    id : Text;
    name : Text;
    subject : NewSubject;
    email : Text;
    phone : Text;
    bio : Text;
    yearsOfExperience : Nat;
    profileImageUrl : Text;
  };

  type NewStudent = {
    id : Text;
    name : Text;
    grade : Nat;
    classSection : Text;
    age : Nat;
    parentContact : Text;
    enrollmentDate : Int;
  };

  type NewAdmissionEnquiry = {
    id : Text;
    studentName : Text;
    fatherName : Text;
    village : Text;
    admissionClass : Text;
    phone : Text;
    submittedAt : Int;
  };

  type TeacherResource = {
    id : Text;
    title : Text;
    description : Text;
    resourceType : Text;
    fileData : Text;
    fileName : Text;
    externalLink : Text;
    textContent : Text;
    uploadedAt : Int;
    category : Text;
  };

  type NewActor = {
    var nextTeacherId : Nat;
    var nextStudentId : Nat;
    var nextAdmissionEnquiryId : Nat;
    var nextResourceId : Nat;
    var teachers : Map.Map<Text, NewTeacher>;
    var students : Map.Map<Text, NewStudent>;
    var admissionEnquiries : Map.Map<Text, NewAdmissionEnquiry>;
    var teacherResources : Map.Map<Text, TeacherResource>;
  };

  public func run(old : OldActor) : NewActor {
    var nextResourceId = 1;
    let teacherResources = Map.empty<Text, TeacherResource>();

    var newActor : NewActor = {
      var nextTeacherId = old.nextTeacherId;
      var nextStudentId = old.nextStudentId;
      var nextAdmissionEnquiryId = old.nextAdmissionEnquiryId;
      var nextResourceId = nextResourceId;
      var teachers = old.teachers;
      var students = old.students;
      var admissionEnquiries = old.admissionEnquiries;
      var teacherResources = teacherResources;
    };
    newActor;
  };
};
