"use strict";

window.addEventListener("DOMContentLoaded", setup);
//------------------- Variables -------------------
let allStudents = [];

const settings = {
  filterBy: "all",
  sortBy: "firstName",
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
  buildList();
}
//------------------- Create buttons -------------------
function registerButtons() {
  document.querySelectorAll("[data-action='filter']").forEach((button) => button.addEventListener("click", selectFilter));
  document.querySelectorAll("[data-action='sort']").forEach((button) => button.addEventListener("click", selectSort));
  document.querySelector("#search").addEventListener("input", searchFieldInput);
}
//------------------- Create students / clean array -------------------
function prepareObject(object) {
  //  allStudents.forEach((object) => {
  // Define a template for the data objects
  const Student = {
    prefect: false,
    firstName: "",
    lastName: "",
    middleName: "",
    nickName: "",
    image: "",
    house: "",
    gender: "",
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

  // ----- Gender -----
  let originalGender = object.gender.trim();
  student.gender = originalGender;
  student.gender = student.gender.substring(0, 1).toUpperCase() + student.gender.substring(1).toLowerCase();

  // console.table(student);
  return student;
}
//------------------- Display students/list -------------------
function displayList(list) {
  document.querySelector("tbody").innerHTML = "";
  list.forEach((student) => displayStudent(student));
}
//------------------- Define students -------------------
function displayStudent(student) {
  const clone = document.querySelector("template#student").content.cloneNode(true);

  clone.querySelector("[data-field=firstname]").textContent = student.firstName + " " + student.nickName + " " + student.middleName;
  clone.querySelector("[data-field=lastname]").textContent = student.lastName;
  clone.querySelector("[data-field=house]").textContent = student.house;
  clone.querySelector("#read_more_button").addEventListener("click", () => showPopUp(student));

  //Prefects
  clone.querySelector("[data-field=prefect]").dataset.prefect = student.prefect;
  clone.querySelector("[data-field=prefect]").addEventListener("click", clickPrefect);
  function clickPrefect() {
    console.log(student);
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToMakePrefect(student);
    }
    buildList();
  }

  document.querySelector("tbody").appendChild(clone);
}
function showPopUp(student) {
  document.querySelector("#pop_up").classList.remove("hide");

  document.querySelector("#pop_up .close_button").addEventListener("click", closePopUp);
  document.querySelector("#pop_up #expel_student").addEventListener("click", expelStudent);

  document.querySelector("#pop_up .fullname").textContent = student.firstName + " " + student.nickName + " " + student.middleName + " " + student.lastName;
  document.querySelector("#pop_up .firstname").textContent = "First name:" + " " + student.firstName;
  document.querySelector("#pop_up .lastname").textContent = "Last name:" + " " + student.lastName;

  // Only show nick name if any
  if (student.nickName === "") {
    document.querySelector("#pop_up .nickname").textContent = student.nickName;
  } else {
    document.querySelector("#pop_up .nickname").textContent = "Nick name:" + " " + student.nickName;
  }

  // Only show middle name if any
  if (student.middleName === " " || student.middleName === "") {
    document.querySelector("#pop_up .middlename").textContent = student.middleName;
  } else {
    document.querySelector("#pop_up .middlename").textContent = "Middle name:" + " " + student.middleName;
  }

  // Show if prefect or not
  if (student.prefect === true) {
    document.querySelector("#pop_up .status").textContent = " " + "yes";
  } else if (student.prefect === false) {
    document.querySelector("#pop_up .status").textContent = " " + "no";
  }

  // show student image
  document.querySelector(".student_pic").src = student.image;

  // Change color and crest on popup according to house
  if (student.house === "Gryffindor") {
    document.querySelector(".crest_img").src = "crest/Gryffindor.svg";
    document.querySelector("#pop_up_wrapper").style.backgroundColor = "#650100";
  } else if (student.house === "Slytherin") {
    document.querySelector(".crest_img").src = "crest/Slytherin.svg";
    document.querySelector("#pop_up_wrapper").style.backgroundColor = "#2E751B";
  } else if (student.house === "Hufflepuff") {
    document.querySelector(".crest_img").src = "crest/Hufflepuff.svg";
    document.querySelector("#pop_up_wrapper").style.backgroundColor = "#1F1E18";
    document.querySelector("#pop_up_wrapper").style.color = "#F2F2F2";
    document.querySelector("#expel_student").style.backgroundColor = "#F2F2F2";
  } else if (student.house === "Ravenclaw") {
    document.querySelector(".crest_img").src = "crest/Rawenclaw.svg";
    document.querySelector("#pop_up_wrapper").style.backgroundColor = "#1A3956";
    document.querySelector("#pop_up_wrapper").style.color = "#F2F2F2";
    document.querySelector("#expel_student").style.backgroundColor = "#F2F2F2";
  }
}

function closePopUp() {
  document.querySelector("#pop_up").classList.add("hide");
}

function expelStudent() {
  console.log("expel student");
}
//------------------- Build new list -------------------
function buildList() {
  const currentList = filterList(allStudents);
  const sortedList = sortList(currentList);

  displayInfoBox(sortedList);

  displayList(sortedList);
}
function displayInfoBox(sortedList) {
  // Display number of students
  document.querySelector("#number_of_students").textContent = `Showing ${sortedList.length} students`;

  // Diaplay infobox /factbox
  let gryffindor = 0;
  for (let obj of allStudents) {
    if (obj.house === "Gryffindor") gryffindor++;
    document.querySelector("#info_box [data-field=gryffindor]").textContent = " " + gryffindor;
  }
  let slytherin = 0;
  for (let obj of allStudents) {
    if (obj.house === "Slytherin") slytherin++;
    document.querySelector("#info_box [data-field=slytherin]").textContent = " " + slytherin;
  }
  let hufflepuff = 0;
  for (let obj of allStudents) {
    if (obj.house === "Hufflepuff") hufflepuff++;
    document.querySelector("#info_box [data-field=hufflepuff]").textContent = " " + hufflepuff;
  }
  let ravenclaw = 0;
  for (let obj of allStudents) {
    if (obj.house === "Ravenclaw") ravenclaw++;
    document.querySelector("#info_box [data-field=ravenclaw]").textContent = " " + ravenclaw;
  }
}
//------------------- All filter functions -------------------
function filterList(filteredList) {
  if (settings.filterBy === "gryffindor") {
    filteredList = allStudents.filter(filterGryffindor);
  } else if (settings.filterBy === "slytherin") {
    filteredList = allStudents.filter(filterSlytherin);
  } else if (settings.filterBy === "hufflepuff") {
    filteredList = allStudents.filter(filterHufflepuff);
  } else if (settings.filterBy === "ravenclaw") {
    filteredList = allStudents.filter(filterRavenclaw);
  } else if (settings.filterBy === "boys") {
    filteredList = allStudents.filter(filterBoys);
  } else if (settings.filterBy === "girls") {
    filteredList = allStudents.filter(filterGirls);
  }
  return filteredList;
}
function selectFilter(event) {
  const filter = event.target.dataset.filter;
  setFilter(filter);
}
function setFilter(filter) {
  settings.filterBy = filter;
  buildList();
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
function filterBoys(student) {
  return student.gender === "Boy";
}
function filterGirls(student) {
  return student.gender === "Girl";
}
// function filterPrefects() {}
// function filterExpelled() {}
// function filterNonExpelled() {}
// function filterSquad() {}

// function filterPureBlood() {}
// function filterHalfBlood() {}
// function filterMuggle() {}
// function removeFilter() {}

// //------------------- All sort functions -------------------
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  // find old sorting element
  const oldElement = document.querySelector(`[data-sort='${settings.sortBy}']`);
  oldElement.classList.remove("sortby");

  // show arrow and indicate whats sorting / add class to active sort
  event.target.classList.add("sortby");

  // toogle the direction
  if (sortDir === "asc") {
    event.target.dataset.sortDirection = "desc";
  } else {
    event.target.dataset.sortDirection = "asc";
  }
  // console.log(`user selected ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}
function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;
  buildList();
}
function sortList(sortedList) {
  let direction = 1;
  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(a, b) {
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

//------------------- Search function -------------------
function searchFieldInput(evt) {
  // Write to the list with only those elemnts in the allStudents array that has properties containing the search frase
  displayList(
    allStudents.filter((elm) => {
      // Comparing in uppercase so that m is the same as M
      return elm.firstName.toUpperCase().includes(evt.target.value.toUpperCase()) || elm.lastName.toUpperCase().includes(evt.target.value.toUpperCase()) || elm.house.toUpperCase().includes(evt.target.value.toUpperCase());
    })
  );
}

// //------------------- All toogle functions -------------------
function tryToMakePrefect(selectedStudent) {
  const prefects = allStudents.filter((student) => student.prefect && student.house === selectedStudent.house);
  const numberOfPrefects = prefects.length;

  if (numberOfPrefects >= 2) {
    console.log("there can only be two prefects of each house");
    removeAorB(prefects[0], prefects[1]);
  } else {
    makePrefect(selectedStudent);
  }

  function removeAorB(prefectA, prefectB) {
    // ask user to ignore or remove a/b
    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .close_button").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #remove_a").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #remove_b").addEventListener("click", clickRemoveB);

    // Display names on prefects
    document.querySelector("#remove_aorb [data-field=prefectA]").textContent = prefectA.firstName;
    document.querySelector("#remove_aorb [data-field=prefectB]").textContent = prefectB.firstName;

    // if ignore - do nothing
    function closeDialog() {
      document.querySelector("#remove_aorb").classList.add("hide");
      document.querySelector("#remove_aorb .close_button").removeEventListener("click", closeDialog);
      document.querySelector("#remove_aorb #remove_a").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_aorb #remove_b").removeEventListener("click", clickRemoveB);
    }
    // if removeA
    function clickRemoveA() {
      removePrefect(prefectA);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
    // if removeB
    function clickRemoveB() {
      removePrefect(prefectB);
      makePrefect(selectedStudent);
      buildList();
      closeDialog();
    }
  }
  function removePrefect(student) {
    student.prefect = false;
  }
  function makePrefect(student) {
    student.prefect = true;
  }
}
// function makeSquadMember() {}

// //------------------- All non reversible functions -------------------
// function expelStudent() {}
// function hackSystem() {}

// //------------------- Pop-up -------------------
// function showStudentDetails() {}
