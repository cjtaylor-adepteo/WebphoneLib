import test from 'ava';
import { SessionImpl } from '../src/session';

test('makeInviteOptions includes extraHeaders', t => {
  // Prepare fake callbacks required by makeInviteOptions
  const callbacks = {
    onAccept: () => {},
    onReject: () => {},
    onRejectThrow: () => {},
    onProgress: () => {},
    onTrying: () => {},
    sessionDescriptionHandlerModifiers: []
  };
  // Fake 'this' with extraHeaders property
  const fakeThis: any = {
    extraHeaders: ['X-Test: foo', 'X-Other: bar']
  };
  // Call protected method
  const options = SessionImpl.prototype.makeInviteOptions.call(fakeThis, callbacks as any);
  t.truthy(options.requestOptions);
  t.deepEqual(options.requestOptions!.extraHeaders, fakeThis.extraHeaders);
});
