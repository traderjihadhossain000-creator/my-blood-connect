const test = require('node:test');
const assert = require('node:assert/strict');
const { isProjectVercelPreview, createOriginValidator } = require('../config/cors');

test('only this project Vercel preview domains are accepted', () => {
    assert.equal(isProjectVercelPreview('https://my-blood-connect-git-main-jihadsproject.vercel.app'), true);
    assert.equal(isProjectVercelPreview('https://my-blood-connect-abc123-jihadsproject.vercel.app'), true);
    assert.equal(isProjectVercelPreview('https://attacker-jihadsproject.vercel.app'), false);
    assert.equal(isProjectVercelPreview('http://my-blood-connect-git-main-jihadsproject.vercel.app'), false);
});

test('configured production origin and requests without browser origin are accepted', async () => {
    const validate = createOriginValidator('https://my-blood-connect.vercel.app/');
    const check = (origin) => new Promise((resolve) => validate(origin, (error, allowed) => resolve({ error, allowed })));
    assert.deepEqual(await check('https://my-blood-connect.vercel.app'), { error:null, allowed:true });
    assert.deepEqual(await check(undefined), { error:null, allowed:true });
    assert.match((await check('https://evil.example')).error.message, /not allowed/i);
});
