DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
id INTEGER(10) AUTO_INCREMENT NOT NULL, 
product_name VARCHAR(30),
size VARCHAR(30),
department_name VARCHAR(30),
price INTEGER(10),
stock_quantity INTEGER(10),
PRIMARY KEY (id)
);


INSERT INTO products (product_name, size, department_name, price, stock_quantity)
VALUES ("Navy Sweatpants", "XS", "Adults", 16, 8), 
("Navy Sweatpants", "S", "Adults", 16, 8), 
("Navy Sweatpants", "M", "Adults", 16, 8), 
("Navy Sweatpants", "L", "Adults", 16, 8), 
("Navy Sweatpants", "XL", "Adults", 16, 8), 
("Navy Sweatpants", "XXL", "Adults", 16, 8), 
("Grey Sweatpants", "XS", "Adults", 16, 4), 
("Grey Sweatpants", "S", "Adults", 16, 4), 
("Grey Sweatpants", "M", "Adults", 16, 4), 
("Grey Sweatpants", "L", "Adults", 16, 4), 
("Grey Sweatpants", "XL", "Adults", 16, 4), 
("Grey Sweatpants", "XXL", "Adults", 16, 4), 
("Onsies", "0-3M", "Baby", 9, 24), 
("Onsies", "3-6M", "Baby", 9, 24), 
("Onsies", "6-9M", "Baby", 9, 24), 
("Onsies", "9-12M", "Baby", 9, 24), 
("Onsies", "12-18M", "Baby", 9, 24), 
("Onsies", "18-24M", "Baby", 9, 24), 
("P is for Prima Hoodie", "2T", "Youth", 14, 6), 
("P is for Prima Hoodie", "3T", "Youth", 14, 6), 
("P is for Prima Hoodie", "4T", "Youth", 14, 6), 
("P is for Prima Hoodie", "5T", "Youth", 14, 6);

CREATE TABLE departments (
department_id INTEGER(10) AUTO_INCREMENT NOT NULL, 
department_name VARCHAR(30),
over_head_costs INTEGER(10),
PRIMARY KEY (department_id)
);

ALTER TABLE products 
ADD COLUMN product_sales INTEGER(10) AFTER stock_quantity;