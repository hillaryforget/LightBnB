

INSERT INTO users (name, email, password)
VALUES
('Harry Potter', 'theboywholived@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Ronald Weasley', 'bloodyhell@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Hermione Granger', 'ilovebooks@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES
(1, 'Privet Drive', 'Under the Stairs', 'https://i.pinimg.com/originals/51/29/6d/51296d0b1a457c427889c075f900cbcb.jpg', 'https://www.indiewire.com/wp-content/uploads/2016/09/shutterstock_5679251g.jpg', 50, 1, 1, 1, 'United Kingdom', 'Pivet', 'Little Whinging', 'Surrey', 'H1P 0T9', true),
(2, 'Grimmauld Place', 'DOA Headquarters', 'https://static.wikia.nocookie.net/harrypotter/images/5/5d/Living_room1.jpg/revision/latest/scale-to-width-down/250?cb=20140614144425', 'https://static.wikia.nocookie.net/harrypotter/images/f/fc/GrimmauldPlace_WB_F5_FrontOfGrimmualdPlace_Image_100615_Land.jpg/revision/latest?cb=20161017204708', 150, 0, 4, 6, 'United Kingdom', 'Grimmauld Place', 'England', 'London', 'D5B 1L3', true),
(3, 'Hogwarts', 'School', 'https://images.ctfassets.net/usf1vwtuqyxm/7lnoakM2cp5csDVoVVD0ZN/87025fa2ca8f22f3eeed6652b2dbcc51/HP-F1-philosophers-stone-great-hall-halloween-floating-pumpkins-feast-web-landscape?fm=jpg&q=70&w=2560', 'https://images.ctfassets.net/usf1vwtuqyxm/3QQaEkThAnIAiXveGhJYD9/f79a571dbe9fd456d65e783040601fdc/hogwarts-castle-.jpg?fm=jpg&q=70&w=2560', 100, 1, 1, 1, 'United Kingdom', 'Magic', 'Scotland', 'Dufftown', 'H0G 0W5', true);

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES
('2001-11-04', '2003-11-04', 1, 1),
('2001-12-25', '2004-12-25', 2, 2),
('2001-09-11', '2007-09-11', 3, 3);

INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES
(1, 1, 1, 1, 'Cramped'),
(2, 2, 2, 3, 'House elf is really grumpy'),
(3, 3, 3, 5, 'I never want to leave');