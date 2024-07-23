import { FormattedMessage } from '@umijs/max'

export const AccountTag = ({ type }: { type: string }) => {
  return (
    <>
      {type === 'biaozhun' ? (
        <span
          style={{
            background: 'var(--color-yellow-490)',
            width: '2.625rem',
            height: '1.25rem',
            fontSize: '0.75rem',
            lineHeight: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '.25rem'
          }}
        >
          <FormattedMessage id={`mt.${type}`} />
        </span>
      ) : type === 'luodian' ? (
        <span
          style={{
            background: 'var(--color-green-700)',
            color: 'white',
            width: '2.625rem',
            height: '1.25rem',
            fontSize: '0.75rem',
            lineHeight: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '.25rem'
          }}
        >
          <FormattedMessage id={`mt.${type}`} />
        </span>
      ) : (
        <span
          style={{
            background: 'black',
            color: 'white',
            width: '2.625rem',
            height: '1.25rem',
            fontSize: '0.75rem',
            lineHeight: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '.25rem'
          }}
        >
          <FormattedMessage id={`mt.${type}`} />
        </span>
      )}
    </>
  )
}
