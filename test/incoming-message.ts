// @ts-nocheck
import test from 'ava';
import * as Features from '../src/features';
// Force browser features check to pass
sinon.stub(Features, 'checkRequired').returns(true);
import { EventEmitter } from 'events';
import { ClientImpl } from '../src/client';
import { IClientOptions, IMedia } from '../src/types';
import { UAFactory, TransportFactory } from '../src/transport';

// Minimal FakeTransport to emit 'message' events
class FakeTransport extends EventEmitter {
  public registered = true;
  public status = 'connected';
  public registeredPromise: Promise<any> = Promise.resolve();
  public extraHeaders: string[] = [];
  public userAgent: any;
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
    throw new Error('N/A');
  }
  createSubscriber() {
    throw new Error('N/A');
  }
  createPublisher() {
    throw new Error('N/A');
  }
}

function buildClient() {
  const fakeUA = {};
  const uaFactory: UAFactory = () => fakeUA;
  const transport = new FakeTransport();
  const transportFactory: TransportFactory = () => transport;
  const media: IMedia = {
    input: { id: undefined, audioProcessing: true, volume: 1, muted: false },
    output: { id: undefined, volume: 1, muted: false }
  };
  const options: IClientOptions = {
    account: { user: 'u', password: 'p', uri: 'sip:u@dom', name: 'u' },
    transport: { wsServers: 'wss://x', iceServers: [] },
    media
  };
  const client = new ClientImpl(uaFactory, transportFactory, options);
  return { client, transport };
}

test('client emits message events for incoming MESSAGE', t => {
  const { client, transport } = buildClient();
  const received: any[] = [];
  client.on('message', (from, body, headers) => received.push({ from, body, headers }));
  // Simulate incoming MESSAGE
  const fakeMsg = {
    request: {
      from: { uri: { toString: () => 'sip:a@domain' } },
      body: 'hello',
      headers: { 'X-Test': ['v1'] }
    }
  };
  transport.emit('message', fakeMsg);
  t.deepEqual(received, [{ from: 'sip:a@domain', body: 'hello', headers: { 'X-Test': ['v1'] } }]);
});
