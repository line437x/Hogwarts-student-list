"use strict";

window.addEventListener("DOMContentLoaded", setup);
//------------------- Variables -------------------
let allStudents = [];

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
  registerButtons();
  loadJSON();
}

//------------------- JSON -------------------
async function loadJSON() {
  const url = "https://petlatkea.dk/2021/hogwarts/students.json";
  let data = await fetch(url);
  allStudents = await data.json();

  //   console.table(allStudents);
  createStudents(allStudents);
}
function createStudents(data) {
  allStudents = data.map(prepareObject);
  //console.log("allStudents", allStudents);
  displayList(allStudents);
  //displayStudent(allStudents);
}
//------------------- Create buttons -------------------
function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
}
//------------------- create students -------------------

function prepareObject(object) {
  //  allStudents.forEach((object) => {
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
    student.middleName = "";
    student.nickName = originalName.substring(originalName.indexOf('"'), originalName.lastIndexOf('"') + 1);
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
  // console.table(student);
  return student;
  //displayStudent(student);
  //});
  // displayList(allStudents);
}
function displayList(list) {
  document.querySelector("tbody").innerHTML = "";
  list.forEach((student) => displayStudent(student));
}
//------------------- Display students -------------------
function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=firstname]").textContent = student.firstName + " " + student.nickName + " " + student.middleName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  //   clone.querySelector(".popup_button").addEventListener("click", openPopup);
  document.querySelector("tbody").appendChild(clone);
}

//------------------- All filter functions -------------------
function filterList(filterBy) {
  let filteredList = allStudents;
  // console.log(filteredList);

  if (filterBy === "gryffindor") {
    filteredList = allStudents.filter(filterGryffindor);
    console.log(filteredList);
  } else if (filterBy === "slytherin") {
    filteredList = allStudents.filter(filterSlytherin);
    console.log(filteredList);
  } else if (filterBy === "hufflepuff") {
    filteredList = allStudents.filter(filterHufflepuff);
    console.log(filteredList);
  } else if (filterBy === "ravenclaw") {
    filteredList = allStudents.filter(filterRavenclaw);
    console.log(filteredList);
  }
  displayList(filteredList);
}

function selectFilter(event) {
  const filter = event.target.dataset.filter;
  console.log(filter);
  filterList(filter);
}

function filterGryffindor(student) {
  return student.house === "Gryffindor";
}
function filterSlytherin(student) {
  return student.house === "Slytherin";
}
function filterHufflepuff(student) {
  return student.house === "Hufflepuff";
}
function filterRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function selectSort() {
  console.log("sorterknap");
}

// function filterPrefects() {}
// function filterExpelled() {}
// function filterNonExpelled() {}
// function filterSquad() {}
// function filterBoys() {}
// function filterGirls() {}
// function filterPureBlood() {}
// function filterHalfBlood() {}
// function filterMuggle() {}
// function removeFilter() {}

// //------------------- All sort functions -------------------
// function sortFirstName() {}
// function sortLastName() {}
// function sortHouse() {}
// function sortPrefects() {}

// //------------------- Search function -------------------
// function search() {}

// //------------------- All toogle functions -------------------
// function makePrefect() {}
// function undoPrefect() {}
// function makeSquadMember() {}

// //------------------- All non reversible functions -------------------
// function expelStudent() {}
// function hackSystem() {}

// //------------------- Pop-up -------------------
// function showStudentDetails() {}
