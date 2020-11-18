const dao = require('../dao.js');

dao.setDb("db/PULSeBS_test.db")

test('test getUserById', () => {
    return dao.getUserById(1).then(data => {
      expect(data).toEqual(expect.objectContaining({Username: 'student1'}));
    });
});

test('test getAllLectures', () => {
    return dao.getAllLectures().then(data => {
      expect(data).toHaveLength(3);
    });
});