INSERT INTO department (name)
VALUES
('Executives'),
('Human Resources'),
('Legal'),
('Sales'),
('Operations'),
('Finance'),
('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES
('CEO', 15, 1),
('CFO', 150, 1),
('HR Director', 100000, 2),
('HR Associate', 50000, 2),
('Lawyer', 500, 3),
('Salesperson', 30000, 4),
('Sales Director', 130000, 4),
('Project Coordinator', 30000, 5),
('Project Manager', 60000, 5),
('Senior Project Manager', 90000, 5),
('Accountant', 80000, 6),
('Junior Engineer', 80000, 7),
('Engineer', 120000, 7),
('Lead Engineer', 180000, 7);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Winona', 'Webster', 1, null),
('Dandelion', 'Cat', 2, 1),
('Rolf', 'Cat', 3, 1),
('Paint', 'Turtle', 4, 3),
('Rudy', 'Lawman', 5, 3),
('Bruce', 'BuysStuff', 6, 7),
('Jessica', 'Rabbit', 7, 1),
('Brenda', 'Newson', 8, 10),
('Kelly', 'Newson', 9, 10),
('Denise', 'Reynolds', 10, 1),
('Carla', 'Carson', 11, 2),
('Kayla', 'Jones', 12, 14),
('America', 'Lopez', 13, 14),
('Heather', 'Heart', 14, null);