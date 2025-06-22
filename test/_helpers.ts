import test from 'ava';
import * as sinon from 'sinon';
import { UA as UABase } from 'sip.js';

import { UserAgent } from 'sip.js/lib/api/user-agent';
import { UserAgentOptions } from 'sip.js/lib/api/user-agent-options';

import { IClientOptions } from '../src/types';

import { ClientImpl } from '../src/client';
import { ClientStatus } from '../src/enums';
import * as Features from '../src/features';
import { Client } from '../src/index';
import { ReconnectableTransport, TransportFactory, UAFactory } from '../src/transport';

export function defaultUAFactory() {
  return (options: UserAgentOptions) => new UserAgent(options);
}

export function defaultTransportFactory() {
  return (uaFactory: UAFactory, options: IClientOptions) =>
    new ReconnectableTransport(uaFactory, options);
}
/**
 * Create a ClientImpl with minimal default options, merged with any overrides.
 */
export function createClientImpl(
  uaFactory: UAFactory,
  transportFactory: TransportFactory,
  optionsOverrides: Partial<IClientOptions> = {}
): ClientImpl {
  const opts: IClientOptions = Object.assign({}, minimalOptions(), optionsOverrides);
  return new ClientImpl(uaFactory, transportFactory, opts);
}

export function createClient() {
  return new Client(minimalOptions());
}

export function minimalOptions() {
  return {
    account: {
      user: '',
      password: '',
      uri: '',
      name: ''
    },
    transport: {
      wsServers: '',
      iceServers: []
    },
    media: {
      input: {
        id: '',
        volume: 1.0,
        audioProcessing: false,
        muted: false
      },
      output: {
        id: '',
        volume: 1.0,
        muted: false
      }
    }
  };
}

// https://stackoverflow.com/a/37900956
test.afterEach.always(() => {
  sinon.restore();
});
