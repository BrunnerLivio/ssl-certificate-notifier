const mock = require('mock-require');
const { expect, assert } = require('chai');

describe('certificate-repository', () => {
    let CertificateRepository;

    beforeEach(() => {
    });

    it('should add a certificate with expiry date', () => {
        mock('../database/database', {
            client: {
                query(sql, parameter) {
                    expect(sql).to.be.equal('INSERT INTO certificate (url, status, expires) VALUES ($1,$2,$3)');
                    assert.deepEqual(parameter, ['molior.rok.roche.com', 0, '2013-02-08 09:30:00']);
                }
            }
        });
        CertificateRepository = mock.reRequire('./certificate-repository');
        
        CertificateRepository.add({ url: 'molior.rok.roche.com', expires: '2013-02-08 09:30', status: 0 });
    });

    it('should add a certificate without expiry date', () => {
        mock('../database/database', {
            client: {
                query(sql, parameter) {
                    expect(sql).to.be.equal('INSERT INTO certificate (url, status, expires) VALUES ($1,$2,$3)');
                    assert.deepEqual(parameter, ['molior.rok.roche.com', 0, undefined]);
                }
            }
        });
        CertificateRepository = mock.reRequire('./certificate-repository');
        CertificateRepository.add({ url: 'molior.rok.roche.com', status: 0 });
    });

    it('should update the certificates status and expiry date', () => {
        mock('../database/database', {
            client: {
                query(sql, parameter) {
                    expect(sql).to.be.equal('UPDATE certificate SET expires = $1, status = $2 WHERE id = $3;');
                    assert.deepEqual(parameter, ['2013-02-08 09:30:00', 1, 1]);
                }
            }
        });
        CertificateRepository = mock.reRequire('./certificate-repository');
        CertificateRepository.update(1, { expires: '2013-02-08 09:30', status: 1 })
    });

    it('should update the certificates expiry date', () => {
        mock('../database/database', {
            client: {
                query(sql, parameter) {
                    expect(sql).to.be.equal('UPDATE certificate SET expires = $1, status = $2 WHERE id = $3;');
                    assert.deepEqual(parameter, ['2013-02-08 09:30:00', 0, 3]);
                }
            }
        });
        CertificateRepository = mock.reRequire('./certificate-repository');
        CertificateRepository.update(3, { expires: '2013-02-08 09:30' })
    });

    it('should update the certificates status', () => {
        mock('../database/database', {
            client: {
                query(sql, parameter) {
                    expect(sql).to.be.equal('UPDATE certificate SET expires = $1, status = $2 WHERE id = $3;');
                    assert.deepEqual(parameter, [undefined, 1, 3]);
                }
            }
        });
        CertificateRepository = mock.reRequire('./certificate-repository');
        CertificateRepository.update(3, { status: 1 })
    });

    it('should delete the certificate by url', () => {
        mock('../database/database', {
            client: {
                query(sql, parameter) {
                    expect(sql).to.be.equal('DELETE FROM certificate WHERE url = $1');
                    assert.deepEqual(parameter, ['molior.rok.roche.com']);
                }
            }
        });
        CertificateRepository = mock.reRequire('./certificate-repository');
        CertificateRepository.remove('molior.rok.roche.com');
    });

    it('should return the certificate by url', () => {
        mock('../database/database', {
            client: {
                query(sql, parameter) {
                    expect(sql).to.be.equal('SELECT * FROM certificate WHERE url = $1');
                    assert.deepEqual(parameter, ['molior.rok.roche.com']);
                }
            }
        });
        CertificateRepository = mock.reRequire('./certificate-repository');
        CertificateRepository.getCertificateByUrl('molior.rok.roche.com');
    });

    it('should return all certificates', () => {
        mock('../database/database', {
            client: {
                query(sql) {
                    expect(sql).to.be.equal('SELECT * FROM certificate');
                }
            }
        });
        CertificateRepository = mock.reRequire('./certificate-repository');
        CertificateRepository.all();
    });

    it('should add a certificate using addOrUpdate', () => {
        let queryCall = 0;
        mock('../database/database', {
            client: {
                query(sql, parameter) {
                    queryCall += 1;
                    
                    if(queryCall === 1) {
                        // Check if exists
                        expect(sql).to.be.equal('SELECT * FROM certificate WHERE url = $1');
                        assert.deepEqual(parameter, ['molior.rok.roche.com']);
                        return {
                            then(func) {
                                func({
                                    rowCount: 0
                                });
                            }
                        };
                    }
                    if(queryCall === 2) {
                        expect(sql).to.be.equal('INSERT INTO certificate (url, status, expires) VALUES ($1,$2,$3)');
                        assert.deepEqual(parameter, ['molior.rok.roche.com', '2013-02-08 09:30:00', 0]);
                    }
                }
            }
        });
        CertificateRepository = mock.reRequire('./certificate-repository');
        CertificateRepository.addOrUpdate({ url: 'molior.rok.roche.com', expires: '2013-02-08 09:30:00', status: 0 });
    });

    it('should update a certificate using addOrUpdate', () => {
        let queryCall = 0;
        mock('../database/database', {
            client: {
                query(sql, parameter) {
                    queryCall += 1;
                    
                    if(queryCall === 1) {
                        // Check if exists
                        expect(sql).to.be.equal('SELECT * FROM certificate WHERE url = $1');
                        assert.deepEqual(parameter, ['molior.rok.roche.com']);
                    
                        return {
                            then(func) {
                                func({
                                    rowCount: 1,
                                    rows: [{ id: 1 }]
                                });
                            }
                        };
                    }
                    if(queryCall === 2) {
                        expect(sql).to.be.equal('UPDATE certificate SET expires = $1, status = $2 WHERE id = $3;');
                        assert.deepEqual(parameter, ['2013-02-08 09:30:00', 0, 1]);
                    }
                }
            }
        });
        CertificateRepository = mock.reRequire('./certificate-repository');
        CertificateRepository.addOrUpdate({ url: 'molior.rok.roche.com', expires: '2013-02-08 09:30:00', status: 0 });
    });
});
