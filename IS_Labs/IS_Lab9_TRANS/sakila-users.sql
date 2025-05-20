CREATE USER 'sakila1'@'%' IDENTIFIED BY 'pass';
CREATE USER 'sakila2'@'%' IDENTIFIED BY 'pass';

GRANT ALL PRIVILEGES ON sakila.* TO 'sakila1'@'%';
GRANT ALL PRIVILEGES ON sakila.* TO 'sakila2'@'%';