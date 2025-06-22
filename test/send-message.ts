// @ts-nocheck
import test from 'ava';
import * as sinon from 'sinon';
import { EventEmitter } from 'events';
import { ClientImpl } from '../src/client';
import { IClientOptions, IMedia } from '../src/types';
import { UAFactory, TransportFactory } from '../src/transport';

// Fake transport implementing minimal ITransport for sendMessage
class FakeTransport extends EventEmitter {
  public registered = true;
  public status = 'connected';
  public registeredPromise: Promise<any>;
  public extraHeaders: string[];
  public userAgent: any;
  constructor(userAgent: any, extraHeaders: string[]) {
    super();
    this.userAgent = userAgent;
    this.extraHeaders = extraHeaders;
    this.registeredPromise = Promise.resolve();
  }
  // Unused methods stubbed
  configure() {}
  connect() {
    return Promise.resolve(true);
  }
  disconnect() {
    return Promise.resolve();
  }
  updatePriority() {}
  getConnection() {
    return Promise.resolve(true);
  }
  close() {}
  createInviter() {
    throw new Error('Not implemented');
  }
  createSubscriber() {
    throw new Error('Not implemented');
  }
  createPublisher() {
    throw new Error('Not implemented');
  }
}

// Helper to build a client with fake transport and UA
function buildClient(extraHeaders: string[], fakeUA: any) {
  const uaFactory: UAFactory = () => fakeUA;
  const transportFactory: TransportFactory = (_uaF, options) =>
    new FakeTransport(fakeUA, extraHeaders);
  const media: IMedia = {
    input: { id: undefined, audioProcessing: true, volume: 1, muted: false },
    output: { id: undefined, volume: 1, muted: false }
  };
  const options: IClientOptions = {
    account: { user: 'u', password: 'p', uri: 'sip:u@domain', name: 'u' },
    transport: { wsServers: 'wss://x', iceServers: [], extraHeaders },
    media
  };
  return new ClientImpl(uaFactory, transportFactory, options);
}

test('sendMessage calls UA.message with explicit headers', async t => {
  const fakeUA = { message: sinon.spy() };
  const client = buildClient(['X-Default: A'], fakeUA);
  await client.sendMessage('sip:b@dom', 'hello', ['X-H: 1']);
  t.true(fakeUA.message.calledOnce);
  t.deepEqual(fakeUA.message.getCall(0).args, ['sip:b@dom', 'hello', { extraHeaders: ['X-H: 1'] }]);
});

test('sendMessage uses transport.extraHeaders when no explicit headers', async t => {
  const fakeUA = { message: sinon.spy() };
  const client = buildClient(['X-Default: A'], fakeUA);
  await client.sendMessage('sip:c@dom', 'hi');
  t.true(fakeUA.message.calledOnce);
  t.deepEqual(fakeUA.message.getCall(0).args, [
    'sip:c@dom',
    'hi',
    { extraHeaders: ['X-Default: A'] }
  ]);
});
