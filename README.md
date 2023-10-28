# JANET'S EMPLOYEE TRACKER

### [View Project Video Here](https://drive.google.com/file/d/1F6zg5ufYqPWxx0FiAr8zQV_URiC3A96D/view?usp=sharing "JANET'S EMPLOYEE TRACKER")<br />
![image of JANET'S EMPLOYEE TRACKER](assets/img/projectimage.png "image of JANET'S EMPLOYEE TRACKER")
| Technology Used    | Resource URL |
| --------  | ------- |
| NodeJS      | https://nodejs.org/en |
| Inquirer      | https://www.npmjs.com/package/inquirer |
| FS      | https://nodejs.org/api/fs.html |
| Jest      | https://jestjs.io/ |
| Screencastify | https://www.screencastify.com/ |
| JavaScript | https://developer.mozilla.org/en-US/docs/Web/JavaScript |
| Git       | https://git-scm.com/ |
| GitHub     | https://github.com/ |
| VSCode    | https://code.visualstudio.com/ |

## Table of Contents

* [Description](#description)
* [Installation](#installation)
* [Usage](#usage)
* [Credits](#credits)
* [License](#license)

## Description:
This application acts as a wizard to create an SVG logo.<br />
<br />

#### How to use this app:

* Recommended Requirements: 
  * Node.JS
  * CLI
  * VSCode 
* Installation:
  * Clone the repo to your device 
  * Initiate NPM 
  * Install inquirer 
  * Install chalk
* Open Integrated Terminal (CLI) 
* type "node index.js" 
* Follow the question prompts until complete 
* Retrieve file from 'examples' folder

### User Story

```md
AS A business owner
I WANT to be able to view and manage the departments, roles, and employees in my company
SO THAT I can organize and plan my business
```

### Acceptance Criteria

```md
GIVEN a command-line application that accepts user input
WHEN I start the application
THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
WHEN I choose to view all departments
THEN I am presented with a formatted table showing department names and department ids
WHEN I choose to view all roles
THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
WHEN I choose to view all employees
THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
WHEN I choose to add a department
THEN I am prompted to enter the name of the department and that department is added to the database
WHEN I choose to add a role
THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
WHEN I choose to add an employee
THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
WHEN I choose to update an employee role
THEN I am prompted to select an employee to update and their new role and this information is updated in the database 
```

### Lessons Learned

#### 1. SVG
For this project I learned about scalable vector graphics and how to generate them through class objects. Through the SVG element each basic shape needed to have a element of either circle, rect or polygon. From there it was about defining their characteristics to set the size, dimensions, and color (via fill). Through SVG there's also the ability to set the text to display as well, with it's own parameters. Template literals were used to pass through the colors and the text.
<br />
![lesson 1](assets/img/lesson1.png)

#### 2. Jest
Jest is an NPM for testing. I used this to test my shape modules. It takes some time to figure out the syntax, while allowing the ability to test modules individually to check their ability. 
<br />
![lesson 2](assets/img/lesson2.png)
![lesson 2](assets/img/lesson2b.png)

#### 3. Class / Inheritance
Through our OOP classes we learned about Classes. These were essential to building this project. For the shapes I started with a parent shape that I could then pass the properties down to each type of shape.
<br />
![lesson 3](assets/img/lesson3.png)
![lesson 3](assets/img/lesson3b.png)

#### 4. Chalk (bonus!)
This one was just for fun because I wanted to spice up the text in my terminal. Chalk provides some predefined colors, highlights, bold, italics and other alteration capabilities.
<br />
![lesson 4](assets/img/lesson4.png)

#### Synopsis
Overall this was a fun project. It was difficult to turn around and immediately use the OOP lessons, but definitely necessary to accomplish the needs of this project. 

## Installation

1. Create a new repository on GitHub, to store this project.
2. Clone the repository to your computer.
3. Copy files to your own repository.
4. Follow the steps for "How to" above
5. Make changes to the code.
6. Commit the changes to the local repo.
7. Push the changes to the remote repo.

## Usage

This is a SVG logo generator app. If you would like to use this app follow the installation steps and curate it to your needs. If you would like to use this app to create your SVG logo files, follow the steps under the description above and click the link at the top of this page.

## License

MIT License
Copyright (c) 2023 Twixmixy / Janet Webster

<hr />

## About The Author
### Janet Webster
Full Stack MERN Software Engineer in training.

- [GitHub](https://github.com/TwixmixyJanet/)
- [LinkedIn](https://www.linkedin.com/in/twixmixy/)
- [Twitter](https://twitter.com/Twixmixy)
- [WakaTime](https://wakatime.com/@Twixmixy)

![Janet with her dog Winona on the beach](https://avatars.githubusercontent.com/u/117195025?v=4)