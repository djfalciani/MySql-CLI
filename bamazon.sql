DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

-- Tables...
-- Products ...
CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(250) NOT NULL,
  department_id INT NOT NULL,
  price DECIMAL(10,2) default 0,
  stock_quantity INT default 0,
  PRIMARY KEY (id)
);

-- departments ...
CREATE TABLE departments(
  id INT NOT NULL AUTO_INCREMENT,
  department_name VARCHAR(100) NOT NULL,
  over_head_costs DECIMAL(10,2) default 0,
  PRIMARY KEY (id)
);
