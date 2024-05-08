const { expect } = require('chai');
const sinon = require('sinon');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

// Import the function to be tested
const { tokenAuthentication } = require('./tokenAuthentication'); // Update the path accordingly

describe('tokenAuthentication', () => {
  it('should call next() when token is valid', async () => {
    const req = { get: sinon.stub().returns('Bearer validToken') };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    // Stub the tokenVerification and tokendecode functions
    sinon.stub(tokenAuthentication.prototype, 'tokenVerification').returns(true);
    sinon.stub(tokenAuthentication.prototype, 'tokendecode').resolves({});

    // Call the function
    await tokenAuthentication(req, res, next);

    // Assertions
    expect(next.calledOnce).to.be.true;
    expect(res.status.called).to.be.false;

    // Restore the stubbed functions
    sinon.restore();
  });

  it('should return 401 when token is missing', async () => {
    const req = { get: sinon.stub().returns('') };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    // Call the function
    await tokenAuthentication(req, res, next);

    // Assertions
    expect(res.status.calledOnceWith(401)).to.be.true;
    expect(res.json.calledOnceWith({ message: 'Unauthorized: Missing token' })).to.be.true;
  });

  it('should return 401 when token is invalid', async () => {
    const req = { get: sinon.stub().returns('Bearer invalidToken') };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    // Stub the tokenVerification function
    sinon.stub(tokenAuthentication.prototype, 'tokenVerification').returns(false);

    // Call the function
    await tokenAuthentication(req, res, next);

    // Assertions
    expect(res.status.calledOnceWith(401)).to.be.true;
    expect(res.json.calledOnceWith({ message: 'Unauthorized: Invalid token' })).to.be.true;

    // Restore the stubbed function
    sinon.restore();
  });

  it('should return 401 when token decoding fails', async () => {
    const req = { get: sinon.stub().returns('Bearer validToken') };
    const res = { status: sinon.stub().returnsThis(), json: sinon.stub() };
    const next = sinon.stub();

    // Stub the tokendecode function to simulate failure
    sinon.stub(tokenAuthentication.prototype, 'tokendecode').rejects(new Error('Invalid Signature'));

    // Call the function
    await tokenAuthentication(req, res, next);

    // Assertions
    expect(res.status.calledOnceWith(401)).to.be.true;
    expect(res.json.calledOnceWith({ message: 'Unauthorized: Invalid Signature' })).to.be.true;

    // Restore the stubbed function
    sinon.restore();
  });
});
