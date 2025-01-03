import PageHeader from '@/components/PageHeader'
import PairingCard from '@/components/PairingCard'
import { walletkit } from '@/utils/WalletConnectUtil'
import { Text } from '@nextui-org/react'
import { getSdkError } from '@walletconnect/utils'
import { Fragment, useState } from 'react'

export default function PairingsPage() {
  const [pairings, setPairings] = useState(walletkit.core.pairing.getPairings())

  async function onDelete(topic: string) {
    await walletkit.disconnectSession({ topic, reason: getSdkError('USER_DISCONNECTED') })
    const newPairings = pairings.filter(pairing => pairing.topic !== topic)
    setPairings(newPairings)
  }

  async function onPing(topic: string) {
    await walletkit.core.pairing.pair({ topic })
  }

  console.log(pairings)

  return (
    <Fragment>
      <PageHeader title="Pairings" />
      {pairings.length ? (
        pairings.map(pairing => {
          const { peerMetadata } = pairing

          return (
            <PairingCard
              key={pairing.topic}
              logo={peerMetadata?.icons[0]}
              url={peerMetadata?.url}
              name={peerMetadata?.name}
              topic={pairing.topic}
              onDelete={() => onDelete(pairing.topic)}
              data-testid={'pairing-' + pairing.topic}
            />
          )
        })
      ) : (
        <Text css={{ opacity: '0.5', textAlign: 'center', marginTop: '$20' }}>No pairings</Text>
      )}
    </Fragment>
  )
}
