exports.up = (pgm) => {
    pgm.sql(`DROP TABLE certificate;`);
    pgm.sql(`
    CREATE TABLE certificate (
        id SERIAL PRIMARY KEY, 
        url varchar(255),
        expires timestamp,
        status INTEGER
    );
        `);
};

exports.down = false;
