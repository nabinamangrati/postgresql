CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author VARCHAR(255),
  url VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes) VALUES ('Author One', 'https://example.com/one', 'First Blog', 10);
INSERT INTO blogs (author, url, title, likes) VALUES ('Author Two', 'https://example.com/two', 'Second Blog', 5);