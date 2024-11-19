CREATE TABLE user (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE category (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255),
    PRIMARY KEY (id)
);

CREATE TABLE transaction (
    id INT NOT NULL AUTO_INCREMENT,
    amount DECIMAL(10, 2),
    date DATE,
    categoryId INT,
    type ENUM('income', 'expense'),
    description VARCHAR(255),
    PRIMARY KEY (id),
    FOREIGN KEY (categoryId) REFERENCES category(id) ON DELETE CASCADE
);

CREATE TABLE budget (
    id INT NOT NULL AUTO_INCREMENT,
    categoryId INT,
    amount DECIMAL(10, 2),
    month INT,
    year INT,
    PRIMARY KEY (id),
    FOREIGN KEY (categoryId) REFERENCES category(id) ON DELETE CASCADE
);

INSERT INTO category (name) VALUES 
('Food'),
('Transport'),
('Entertainment'),
('Housing'),
('Health'),
('Savings');

INSERT INTO transaction (amount, date, categoryId, type, description) VALUES 
(50.00, '2024-01-10', 1, 'expense', 'Dinner at a restaurant'),
(20.00, '2024-01-11', 2, 'expense', 'Taxi home'),
(150.00, '2024-01-12', 3, 'expense', 'Movie ticket'),
(1000.00, '2024-01-01', 6, 'income', 'Salary'),
(200.00, '2024-01-15', 4, 'expense', 'Rent payment'),
(75.00, '2024-01-20', 5, 'expense', 'Doctor visit');


INSERT INTO budget (categoryId, amount, month, year) VALUES 
(1, 500.00, 1, 2024),
(2, 300.00, 1, 2024),
(3, 150.00, 1, 2024),
(4, 1200.00, 1, 2024),
(5, 300.00, 1, 2024);

ALTER TABLE transaction
ADD COLUMN latitude DECIMAL(9, 6) NULL,
ADD COLUMN longitude DECIMAL(9, 6) NULL;


UPDATE transaction
SET latitude = 40.7128, longitude = -74.0060
WHERE id = 1;

INSERT INTO transaction (amount, date, categoryId, type, description, latitude, longitude)
VALUES 
  (100.50, '2024-11-01', 1, 'expense', 'Dinner at restaurant', 40.7128, -74.0060),
  (50.75, '2024-11-02', 2, 'expense', 'Taxi ride', 34.0522, -118.2437);
