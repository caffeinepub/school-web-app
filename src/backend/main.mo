import Text "mo:core/Text";
import Map "mo:core/Map";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Order "mo:core/Order";
import Migration "migration";

(with migration = Migration.run)
actor {
  type Subject = {
    #Mathematics;
    #Science;
    #LanguageArts;
    #PhysicalEducation;
    #Music;
    #ComputerScience;
  };

  type Teacher = {
    id : Text;
    name : Text;
    subject : Subject;
    email : Text;
    phone : Text;
    bio : Text;
    yearsOfExperience : Nat;
    profileImageUrl : Text;
  };

  type Student = {
    id : Text;
    name : Text;
    grade : Nat;
    classSection : Text;
    age : Nat;
    parentContact : Text;
    enrollmentDate : Int;
  };

  type AdmissionEnquiry = {
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

  var nextTeacherId = 7;
  var nextStudentId = 13;
  var nextAdmissionEnquiryId = 1;
  var nextResourceId = 1;

  let teachers = Map.empty<Text, Teacher>();
  let students = Map.empty<Text, Student>();
  let admissionEnquiries = Map.empty<Text, AdmissionEnquiry>();
  let teacherResources = Map.empty<Text, TeacherResource>();

  let initialTeachers : [Teacher] = [
    {
      id = "1";
      name = "Alice Johnson";
      subject = #Mathematics;
      email = "alice.johnson@school.com";
      phone = "123-456-7890";
      bio = "Passionate about teaching math to young minds.";
      yearsOfExperience = 8;
      profileImageUrl = "https://example.com/images/alice.jpg";
    },
    {
      id = "2";
      name = "Bob Smith";
      subject = #Science;
      email = "bob.smith@school.com";
      phone = "234-567-8901";
      bio = "Loves making science fun and interactive.";
      yearsOfExperience = 10;
      profileImageUrl = "https://example.com/images/bob.jpg";
    },
    {
      id = "3";
      name = "Carol Lee";
      subject = #LanguageArts;
      email = "carol.lee@school.com";
      phone = "345-678-9012";
      bio = "Enjoys helping students develop strong language skills.";
      yearsOfExperience = 12;
      profileImageUrl = "https://example.com/images/carol.jpg";
    },
    {
      id = "4";
      name = "David Kim";
      subject = #PhysicalEducation;
      email = "david.kim@school.com";
      phone = "456-789-0123";
      bio = "Dedicated to promoting physical health and activity.";
      yearsOfExperience = 6;
      profileImageUrl = "https://example.com/images/david.jpg";
    },
    {
      id = "5";
      name = "Eva Martinez";
      subject = #Music;
      email = "eva.martinez@school.com";
      phone = "567-890-1234";
      bio = "Believes in the power of music education.";
      yearsOfExperience = 9;
      profileImageUrl = "https://example.com/images/eva.jpg";
    },
    {
      id = "6";
      name = "Frank Nelson";
      subject = #ComputerScience;
      email = "frank.nelson@school.com";
      phone = "678-901-2345";
      bio = "Passionate about teaching technology and coding.";
      yearsOfExperience = 7;
      profileImageUrl = "https://example.com/images/frank.jpg";
    },
  ];

  let initialStudents : [Student] = [
    {
      id = "1";
      name = "Sophia Brown";
      grade = 3;
      classSection = "3A";
      age = 8;
      parentContact = "Mr. Brown - 123-456-7890";
      enrollmentDate = 1679846400;
    },
    {
      id = "2";
      name = "Liam Smith";
      grade = 2;
      classSection = "2B";
      age = 7;
      parentContact = "Mrs. Smith - 234-567-8901";
      enrollmentDate = 1679750000;
    },
    {
      id = "3";
      name = "Olivia Martinez";
      grade = 4;
      classSection = "4A";
      age = 9;
      parentContact = "Mr. Martinez - 345-678-9012";
      enrollmentDate = 1679640000;
    },
    {
      id = "4";
      name = "Noah Chen";
      grade = 5;
      classSection = "5B";
      age = 10;
      parentContact = "Mrs. Chen - 456-789-0123";
      enrollmentDate = 1679530000;
    },
    {
      id = "5";
      name = "Emma Rodriguez";
      grade = 1;
      classSection = "1A";
      age = 6;
      parentContact = "Mr. Rodriguez - 567-890-1234";
      enrollmentDate = 1679420000;
    },
    {
      id = "6";
      name = "Benjamin Lee";
      grade = 3;
      classSection = "3B";
      age = 8;
      parentContact = "Mrs. Lee - 678-901-2345";
      enrollmentDate = 1679300000;
    },
    {
      id = "7";
      name = "Ava Singh";
      grade = 2;
      classSection = "2A";
      age = 7;
      parentContact = "Mr. Singh - 789-012-3456";
      enrollmentDate = 1679190000;
    },
    {
      id = "8";
      name = "William Kim";
      grade = 4;
      classSection = "4B";
      age = 9;
      parentContact = "Mrs. Kim - 890-123-4567";
      enrollmentDate = 1679080000;
    },
    {
      id = "9";
      name = "Mia Patel";
      grade = 5;
      classSection = "5A";
      age = 10;
      parentContact = "Mr. Patel - 901-234-5678";
      enrollmentDate = 1678970000;
    },
    {
      id = "10";
      name = "James Wilson";
      grade = 1;
      classSection = "1B";
      age = 6;
      parentContact = "Mrs. Wilson - 012-345-6789";
      enrollmentDate = 1678860000;
    },
    {
      id = "11";
      name = "Isabella Torres";
      grade = 3;
      classSection = "3C";
      age = 8;
      parentContact = "Mr. Torres - 123-456-7891";
      enrollmentDate = 1678750000;
    },
    {
      id = "12";
      name = "Ethan Nguyen";
      grade = 2;
      classSection = "2C";
      age = 7;
      parentContact = "Mrs. Nguyen - 234-567-8902";
      enrollmentDate = 1678640000;
    },
  ];

  let initialAnnouncements = List.singleton<{ title : Text; content : Text; date : Nat }>({
    title = "School Sports Day";
    content = "Join us for a day of fun and games!";
    date = 1678848000;
  });

  public shared ({ caller }) func seedData() : async () {
    for (teacher in initialTeachers.values()) {
      teachers.add(teacher.id, teacher);
    };
    for (student in initialStudents.values()) {
      students.add(student.id, student);
    };
  };

  public query ({ caller }) func getAllTeachers() : async [Teacher] {
    teachers.values().toArray();
  };

  public query ({ caller }) func getAllStudents() : async [Student] {
    students.values().toArray();
  };

  public query ({ caller }) func getTeacherById(id : Text) : async Teacher {
    switch (teachers.get(id)) {
      case (?teacher) { teacher };
      case (null) { Runtime.trap("Teacher not found") };
    };
  };

  public query ({ caller }) func getStudentById(id : Text) : async Student {
    switch (students.get(id)) {
      case (?student) { student };
      case (null) { Runtime.trap("Student not found") };
    };
  };

  public shared ({ caller }) func submitAdmissionEnquiry(
    studentName : Text,
    fatherName : Text,
    village : Text,
    admissionClass : Text,
    phone : Text,
  ) : async AdmissionEnquiry {
    let id = nextAdmissionEnquiryId.toText();
    nextAdmissionEnquiryId += 1;

    let enquiry : AdmissionEnquiry = {
      id;
      studentName;
      fatherName;
      village;
      admissionClass;
      phone;
      submittedAt = Int.abs(Time.now() / 1_000_000_000);
    };

    admissionEnquiries.add(id, enquiry);
    enquiry;
  };

  public query ({ caller }) func getAdmissionEnquiries() : async [AdmissionEnquiry] {
    admissionEnquiries.values().toArray();
  };

  func compareResourcesByUploadedAtDesc(a : TeacherResource, b : TeacherResource) : Order.Order {
    Int.compare(b.uploadedAt, a.uploadedAt);
  };

  public shared ({ caller }) func addTeacherResource(
    title : Text,
    description : Text,
    resourceType : Text,
    fileData : Text,
    fileName : Text,
    externalLink : Text,
    textContent : Text,
    category : Text,
  ) : async TeacherResource {
    let id = nextResourceId.toText();
    nextResourceId += 1;

    let resource : TeacherResource = {
      id;
      title;
      description;
      resourceType;
      fileData;
      fileName;
      externalLink;
      textContent;
      uploadedAt = Int.abs(Time.now() / 1_000_000_000);
      category;
    };

    teacherResources.add(id, resource);
    resource;
  };

  public query ({ caller }) func getAllTeacherResources() : async [TeacherResource] {
    teacherResources.values().toArray().sort(compareResourcesByUploadedAtDesc);
  };

  public shared ({ caller }) func deleteTeacherResource(id : Text) : async Bool {
    if (teacherResources.containsKey(id)) {
      teacherResources.remove(id);
      true;
    } else {
      false;
    };
  };
};
