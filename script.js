"use strict";

window.addEventListener("DOMContentLoaded", setup);
//------------------- Variables -------------------
let students = [];

const Student = {
  prefect: false,
  firstName: "",
  lastName: "",
  house: "",
};

const settings = {
  filterBy: "all",
  sortBy: "name",
  sortDir: "asc",
};
//------------------- Setup -------------------
function setup() {
  console.log("script er loaded");
  loadJSON();
}

//------------------- JSON -------------------
async function loadJSON() {
  const url = "https://petlatkea.dk/2021/hogwarts/students.json";
  let data = await fetch(url);
  students = await data.json();

  //   console.table(students);

  createStudents(students);
}
//------------------- create students -------------------
function createStudents() {
  students.forEach((object) => {
    // Define a template for the data objects
    const Student = {
      firstName: "",
      lastName: "",
      middleName: "",
      nickName: "",
      image: "",
      house: "",
    };
    // create a objects from a prototype
    const student = Object.create(Student);

    //Trim objects
    let originalName = object.fullname.trim();

    // ----- First name -----
    if (originalName.includes(" ")) {
      student.firstName = originalName.substring(0, 1).toUpperCase() + originalName.substring(1, originalName.indexOf(" "));
    } else {
      student.firstName = originalName.substring(0, 1).toUpperCase() + originalName.substring(1);
    }
    student.firstName = student.firstName.substring(0, 1).toUpperCase() + student.firstName.substring(1).toLowerCase();

    // ----- Last name -----
    if (originalName.includes(" ")) {
      student.lastName = originalName.substring(originalName.lastIndexOf(" ") + 1);
      student.lastName = student.lastName.substring(0, 1).toUpperCase() + student.lastName.substring(1).toLowerCase();
    }

    //----- Middle name (if any) -----
    student.middleName = originalName.substring(originalName.indexOf(" ") + 1, originalName.lastIndexOf(" "));
    student.middleName = student.middleName.substring(0, 1).toUpperCase() + student.middleName.substring(1).toLowerCase();

    //----- Nick name (if any) -----
    if (originalName.includes('"')) {
      student.middleName = undefined;
      student.nickName = originalName.substring(originalName.indexOf('"') + 1, originalName.lastIndexOf('"'));
    }
    // // ----- Image -----
    student.image = `./images/${originalName.substring(0, originalName.indexOf(" ")).toLowerCase()}_.png`;
    student.image = `./images/${originalName.substring(originalName.lastIndexOf(" ") + 1, originalName.lastIndexOf(" ") + 2).toLowerCase() + originalName.substring(originalName.lastIndexOf(" ") + 2).toLowerCase()}_${originalName
      .substring(0, 1)
      .toUpperCase()
      .toLowerCase()}.png`;

    // ----- House -----
    let originalHouse = object.house.trim();
    student.house = originalHouse;
    student.house = student.house.substring(0, 1).toUpperCase() + student.house.substring(1).toLowerCase();
    console.table(student);
  });
}
//------------------- All filter functions -------------------
function filterGryffindor() {}
function filterSlytherin() {}
function filterHufflepuff() {}
function filterRavenclaw() {}
function filterPrefects() {}
function filterExpelled() {}
function filterNonExpelled() {}
function filterSquad() {}
function filterBoys() {}
function filterGirls() {}
function filterPureBlood() {}
function filterHalfBlood() {}
function filterMuggle() {}
function removeFilter() {}

//------------------- All sort functions -------------------
function sortFirstName() {}
function sortLastName() {}
function sortHouse() {}
function sortPrefects() {}

//------------------- Search function -------------------
function search() {}

//------------------- All toogle functions -------------------
function makePrefect() {}
function undoPrefect() {}
function makeSquadMember() {}

//------------------- All non reversible functions -------------------
function expelStudent() {}
function hackSystem() {}

//------------------- Pop-up -------------------
function showStudentDetails() {}
