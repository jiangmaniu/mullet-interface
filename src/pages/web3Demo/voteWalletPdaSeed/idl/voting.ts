/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/voting.json`.
 */
export type Voting = {
  address: '4MF6CSQ68eDqL5Z6rMtnYu5M2JG8LPR4SLaXMCd17sje'
  metadata: {
    name: 'voting'
    version: '0.1.0'
    spec: '0.1.0'
    description: 'Created with Anchor'
  }
  instructions: [
    {
      name: 'getResults'
      discriminator: [137, 44, 100, 59, 220, 97, 105, 111]
      accounts: [
        {
          name: 'votingAccount'
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 111, 116, 105, 110, 103, 95, 97, 99, 99, 111, 117, 110, 116]
              }
            ]
          }
        }
      ]
      args: []
      returns: {
        defined: {
          name: 'voteResult'
        }
      }
    },
    {
      name: 'initialize'
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237]
      accounts: [
        {
          name: 'votingAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 111, 116, 105, 110, 103, 95, 97, 99, 99, 111, 117, 110, 116]
              }
            ]
          }
        },
        {
          name: 'user'
          writable: true
          signer: true
        },
        {
          name: 'systemProgram'
          address: '11111111111111111111111111111111'
        }
      ]
      args: []
    },
    {
      name: 'vote'
      discriminator: [227, 110, 155, 23, 136, 126, 172, 25]
      accounts: [
        {
          name: 'votingAccount'
          writable: true
          pda: {
            seeds: [
              {
                kind: 'const'
                value: [118, 111, 116, 105, 110, 103, 95, 97, 99, 99, 111, 117, 110, 116]
              }
            ]
          }
        },
        {
          name: 'user'
          signer: true
        }
      ]
      args: [
        {
          name: 'currency'
          type: 'string'
        }
      ]
    }
  ]
  accounts: [
    {
      name: 'votingAccount'
      discriminator: [245, 166, 249, 102, 0, 37, 201, 162]
    }
  ]
  errors: [
    {
      code: 6000
      name: 'invalidCurrency'
      msg: 'Invalid currency specified'
    }
  ]
  types: [
    {
      name: 'voteResult'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'eth'
            type: 'u64'
          },
          {
            name: 'btc'
            type: 'u64'
          },
          {
            name: 'sol'
            type: 'u64'
          }
        ]
      }
    },
    {
      name: 'votingAccount'
      type: {
        kind: 'struct'
        fields: [
          {
            name: 'eth'
            type: 'u64'
          },
          {
            name: 'btc'
            type: 'u64'
          },
          {
            name: 'sol'
            type: 'u64'
          }
        ]
      }
    }
  ]
}
