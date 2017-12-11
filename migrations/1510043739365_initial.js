exports.up = (pgm) => {
    pgm.sql(`
CREATE TABLE certificate (
    id INTEGER PRIMARY KEY, 
    url varchar(255),
    expires timestamp,
    status INTEGER
)
    `);
};

exports.down = (pgm) => {
    pgm.sql(`
DROP TABLE certificate;
        `);

};
