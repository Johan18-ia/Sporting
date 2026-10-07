USE db_node;

CREATE TABLE IF NOT EXISTS parent_profiles (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    document VARCHAR(20) NULL,
    address VARCHAR(255) NULL,
    occupation VARCHAR(100) NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_parent_profiles_user_id (user_id),
    UNIQUE KEY uq_parent_profiles_document (document),
    CONSTRAINT fk_parent_profiles_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
) ENGINE=InnoDB;

INSERT INTO categories (category_year, description)
VALUES
    (2000, 'Categoría jugadores nacidos en 2000'),
    (2001, 'Categoría jugadores nacidos en 2001'),
    (2002, 'Categoría jugadores nacidos en 2002'),
    (2003, 'Categoría jugadores nacidos en 2003'),
    (2004, 'Categoría jugadores nacidos en 2004'),
    (2005, 'Categoría jugadores nacidos en 2005'),
    (2006, 'Categoría jugadores nacidos en 2006'),
    (2007, 'Categoría jugadores nacidos en 2007'),
    (2008, 'Categoría jugadores nacidos en 2008'),
    (2009, 'Categoría jugadores nacidos en 2009'),
    (2010, 'Categoría jugadores nacidos en 2010'),
    (2011, 'Categoría jugadores nacidos en 2011'),
    (2012, 'Categoría jugadores nacidos en 2012'),
    (2013, 'Categoría jugadores nacidos en 2013'),
    (2014, 'Categoría jugadores nacidos en 2014'),
    (2015, 'Categoría jugadores nacidos en 2015'),
    (2016, 'Categoría jugadores nacidos en 2016'),
    (2017, 'Categoría jugadores nacidos en 2017'),
    (2018, 'Categoría jugadores nacidos en 2018'),
    (2019, 'Categoría jugadores nacidos en 2019'),
    (2020, 'Categoría jugadores nacidos en 2020')
ON DUPLICATE KEY UPDATE
    description = VALUES(description),
    updated_at = NOW();