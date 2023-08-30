/* Replace with your SQL commands */
CREATE TABLE test (id SERIAL PRIMARY KEY, name VARCHAR, age INTEGER);
CREATE TABLE users (id SERIAL PRIMARY KEY, username VARCHAR UNIQUE, email VARCHAR, password VARCHAR);